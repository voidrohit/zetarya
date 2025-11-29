'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const SIGNALING_SERVER = 'wss://signal.mineger.com/ws';
const ICE_SERVERS      = [{ urls: 'stun:stun.l.google.com:19302' }];
const CHUNK_SIZE       = 1024 * 64; // 64 KiB
const LIMIT_BPS        = 1024 * 1024 * 50; // 50 Mbps (only if we throttle)
const SECRET_KEY       = 'abcdefghijklmnopqrstuwxyz'; // same on both sides

declare global {
    interface Window {
        showSaveFilePicker?: any;
        streamSaver?: any;
    }
}

/* ---------- Helpers ---------- */

const isIOS = () => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const generateIV = () => crypto.getRandomValues(new Uint8Array(12));

async function importEncryptionKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32));
    return crypto.subtle.importKey('raw', enc, 'AES-GCM', false, [
        'encrypt',
        'decrypt',
    ]);
}

async function encryptChunk(
    data: Uint8Array,
    key: CryptoKey
): Promise<Uint8Array> {
    const iv = generateIV();
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const encryptedBytes = new Uint8Array(encrypted);

    const out = new Uint8Array(12 + encryptedBytes.length);
    out.set(iv, 0);
    out.set(encryptedBytes, 12);
    return out;
}

async function decryptChunk(
    encryptedData: Uint8Array,
    key: CryptoKey
): Promise<Uint8Array> {
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new Uint8Array(decrypted);
}

/* ---------- Component ---------- */

const HomePage: React.FC = () => {
    const [files, setFiles]                 = useState<FileList | null>(null);
    const [myId, setMyId]                   = useState('');
    const [remoteId, setRemoteId]           = useState('');
    const [logs, setLogs]                   = useState<string[]>([]);
    const [totalBytes, setTotalBytes]       = useState(0);
    const [receivedBytes, setReceivedBytes] = useState(0);

    const wsRef      = useRef<WebSocket | null>(null);
    const pcRef      = useRef<RTCPeerConnection | null>(null);
    const dcRef      = useRef<RTCDataChannel | null>(null);

    // where we write on desktop (StreamSaver / FilePicker)
    const writerRef  = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
    // where we buffer on iOS / fallback
    const bufferRef  = useRef<Uint8Array[] | null>(null);

    const expectedNameRef = useRef<string>('');
    const recvKeyRef      = useRef<CryptoKey | null>(null);
    const sendKeyRef      = useRef<CryptoKey | null>(null);

    const recvStartRef    = useRef<number>(0);

    // throttle state (kept simple)
    let sendStart = 0;
    let bitsSent  = 0;

    const log = (m: string) => setLogs((l) => [...l, m]);
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const waitForLowBuffer = () => {
        const dc = dcRef.current;
        if (!dc) return Promise.resolve();
        if (dc.bufferedAmount <= CHUNK_SIZE * 30) return Promise.resolve();
        return new Promise<void>((res) => {
            const cb = () => {
                dc.removeEventListener('bufferedamountlow', cb);
                res();
            };
            dc.addEventListener('bufferedamountlow', cb);
        });
    };

    const throttleIfNeeded = async (bytes: number) => {
        bitsSent += bytes * 8;
        const elapsed = performance.now() - sendStart;
        const target = (bitsSent / LIMIT_BPS) * 1000;
        if (target > elapsed) {
            await sleep(target - elapsed);
        }
    };

    async function safeSendWithThrottle(buffer: ArrayBuffer): Promise<void> {
        const dc = dcRef.current;
        if (!dc || dc.readyState !== 'open') return;

        while (dc.bufferedAmount > CHUNK_SIZE * 60) {
            await waitForLowBuffer();
        }

        // You can enable throttling if you see spikes:
        // await throttleIfNeeded(buffer.byteLength);

        try {
            dc.send(buffer);
        } catch (err) {
            console.error('❌ Failed to send:', err);
            log('❌ Failed to send a chunk');
        }
    }

    /* ---------- SW for StreamSaver (desktop) ---------- */

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/streamserver-sw.js')
                .then(() => log('🥞 ServiceWorker registered'))
                .catch((err) => log(`⚠️ ServiceWorker registration failed: ${err}`));
        }
    }, []);

    /* ---------- WS signaling ---------- */

    useEffect(() => {
        const id = Math.random().toString(36).slice(2, 8);
        setMyId(id);

        const ws = new WebSocket(`${SIGNALING_SERVER}?id=${id}`);
        ws.onopen = () => log('🔗 WS connected');
        ws.onerror = () => log('⚠️ WS error');
        ws.onmessage = (e) => handleSignal(JSON.parse(e.data));
        wsRef.current = ws;

        return () => {
            ws.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- File selection ---------- */

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;
        setFiles(selectedFiles);
        log(`📂 Selected ${selectedFiles.length} file(s)`);
    };

    /* ---------- RTCPeerConnection & DataChannel ---------- */

    const initPC = (initiator: boolean) => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pc.onicecandidate = (ev) => {
            if (ev.candidate && remoteId) {
                wsRef.current?.send(
                    JSON.stringify({
                        type: 'candidate',
                        candidate: ev.candidate,
                        to: remoteId,
                    })
                );
            }
        };
        pc.ondatachannel = (ev) => setupChannel(ev.channel);
        if (initiator) {
            const dc = pc.createDataChannel('fileChannel', { ordered: true });
            setupChannel(dc);
        }
        pcRef.current = pc;
    };

    const setupChannel = (dc: RTCDataChannel) => {
        dc.binaryType = 'arraybuffer';

        dc.onopen = async () => {
            log('📡 DataChannel open');
            // Only import AES key on non-iOS (we'll skip encryption on iOS to match Toffeshare behavior)
            if (!isIOS()) {
                recvKeyRef.current = await importEncryptionKey(SECRET_KEY);
            } else {
                recvKeyRef.current = null;
            }
        };

        dc.onmessage = async (ev) => {
            if (typeof ev.data === 'string') {
                const msg = JSON.parse(ev.data);
                switch (msg.type) {
                    case 'file-meta': {
                        recvStartRef.current = performance.now();
                        expectedNameRef.current = msg.name;

                        setTotalBytes(msg.size);
                        setReceivedBytes(0);

                        writerRef.current = null;
                        bufferRef.current = null;

                        try {
                            if (!isIOS() && window.showSaveFilePicker) {
                                log('📝 Using showSaveFilePicker (desktop)');
                                const handle = await window.showSaveFilePicker({
                                    suggestedName: msg.name,
                                });
                                writerRef.current = await handle.createWritable();
                            } else if (!isIOS() && window.streamSaver) {
                                log('📝 Using StreamSaver (desktop)');
                                const fileStream = window.streamSaver.createWriteStream(msg.name, {
                                    size: msg.size,
                                });
                                writerRef.current = fileStream.getWriter();
                            } else {
                                // iOS / fallback: buffer in memory, Blob at end (like Toffeshare)
                                log('🧠 Fallback: buffering chunks in memory (iOS / unsupported browser)');
                                bufferRef.current = [];
                            }
                        } catch (err: any) {
                            console.error(err);
                            log('❌ Failed to open file for saving: ' + (err?.message || err));
                            bufferRef.current = [];
                        }

                        if (!writerRef.current && !bufferRef.current) {
                            log('❌ No valid saving mechanism; will receive but cannot save file.');
                        } else {
                            log(`📁 Receiving ${msg.name}`);
                        }
                        break;
                    }

                    case 'file-end': {
                        const dur = (performance.now() - recvStartRef.current) / 1000;

                        if (writerRef.current) {
                            await writerRef.current.close();
                            log(`💾 Saved ${expectedNameRef.current} via stream`);
                        } else if (bufferRef.current) {
                            try {
                                const blob = new Blob(bufferRef.current);
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = expectedNameRef.current || 'download.bin';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                                log(`💾 Saved ${expectedNameRef.current} via Blob download`);
                            } catch (err: any) {
                                console.error(err);
                                log('❌ Failed to create Blob/download: ' + (err?.message || err));
                            } finally {
                                bufferRef.current = null;
                            }
                        }

                        log(`⏱ Received in ${dur.toFixed(2)}s`);

                        expectedNameRef.current = '';
                        setTotalBytes(0);
                        setReceivedBytes(0);
                        break;
                    }

                    default:
                        break;
                }
            } else {
                // Binary data (raw or encrypted chunk)
                const encryptedOrPlain = new Uint8Array(ev.data as ArrayBuffer);
                let plain: Uint8Array;

                try {
                    if (!isIOS() && recvKeyRef.current) {
                        // desktop with encryption
                        plain = await decryptChunk(encryptedOrPlain, recvKeyRef.current);
                    } else {
                        // iOS: no encryption, data is directly the original bytes
                        plain = encryptedOrPlain;
                    }

                    if (writerRef.current) {
                        await writerRef.current.write(plain);
                    } else if (bufferRef.current) {
                        bufferRef.current.push(plain);
                    }

                    setReceivedBytes((r) => r + plain.byteLength);
                } catch (err: any) {
                    console.error(err);
                    log('❌ Failed to handle incoming chunk: ' + (err?.message || err));
                }
            }
        };

        dcRef.current = dc;
    };

    /* ---------- Signaling handling ---------- */

    const handleSignal = async (msg: any) => {
        if (msg.type === 'offer') {
            setRemoteId(msg.from);
            initPC(false);
            await pcRef.current!.setRemoteDescription(msg.offer);
            const answer = await pcRef.current!.createAnswer();
            await pcRef.current!.setLocalDescription(answer);
            wsRef.current?.send(
                JSON.stringify({
                    type: 'answer',
                    answer,
                    to: msg.from,
                })
            );
        } else if (msg.type === 'answer') {
            await pcRef.current!.setRemoteDescription(msg.answer);
        } else if (msg.type === 'candidate') {
            await pcRef.current!.addIceCandidate(msg.candidate);
        }
    };

    const startCall = async () => {
        if (!remoteId) return;
        initPC(true);
        const offer = await pcRef.current!.createOffer();
        await pcRef.current!.setLocalDescription(offer);
        wsRef.current?.send(
            JSON.stringify({
                type: 'offer',
                offer,
                to: remoteId,
            })
        );
    };

    /* ---------- File sending (streaming, no full-buffer, no MD5) ---------- */

    const sendFiles = async () => {
        if (!files || files.length === 0) return;
        const dc = dcRef.current;
        if (!dc || dc.readyState !== 'open') {
            log('⚠️ DataChannel is not open');
            return;
        }

        sendStart = performance.now();
        bitsSent  = 0;

        // Only import key for non-iOS; on iOS we send plain bytes (like Toffeshare)
        if (!isIOS()) {
            sendKeyRef.current = await importEncryptionKey(SECRET_KEY);
        } else {
            sendKeyRef.current = null;
        }

        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const size = f.size;
            const chunks = Math.ceil(size / CHUNK_SIZE);

            // Send metadata
            dc.send(
                JSON.stringify({
                    type: 'file-meta',
                    name: f.name,
                    size,
                    chunks,
                })
            );

            log(
                `📄 Sending file ${i + 1}/${files.length}: ${f.name} (${(
                    size /
                    (1024 * 1024)
                ).toFixed(2)} MB)`
            );

            const t0 = performance.now();
            const key = sendKeyRef.current;
            const useEncryption = !!key; // false on iOS

            // Stream sequential chunks
            for (let idx = 0; idx < chunks; idx++) {
                const offset = idx * CHUNK_SIZE;
                const slice = new Uint8Array(
                    await f.slice(offset, offset + CHUNK_SIZE).arrayBuffer()
                );

                const payload = useEncryption ? await encryptChunk(slice, key!) : slice;

                await safeSendWithThrottle(payload.buffer);

                if (idx % 256 === 0 || idx === chunks - 1) {
                    log(`⬆️ Sent chunk ${idx + 1}/${chunks}`);
                }
            }

            dc.send(
                JSON.stringify({
                    type: 'file-end',
                    name: f.name,
                    size,
                    chunks,
                })
            );

            const dur = (performance.now() - t0) / 1000;
            log(
                `✅ Sent ${f.name} (${(size / (1024 * 1024)).toFixed(
                    2
                )} MB) in ${dur.toFixed(2)}s`
            );
        }
    };

    return (
        <>
            <Script src="/streamsaver.js" strategy="beforeInteractive" />
            <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
                <p>
                    Your ID: <strong>{myId}</strong>
                </p>

                <div style={{ marginBottom: 12 }}>
                    <input
                        placeholder="Remote peer ID"
                        value={remoteId}
                        onChange={(e) => setRemoteId(e.target.value)}
                        style={{ marginRight: 8 }}
                    />
                    <button onClick={startCall} disabled={!remoteId}>
                        Connect
                    </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <input type="file" multiple onChange={handleFileChange} />
                    <button onClick={sendFiles} disabled={!files} style={{ marginLeft: 8 }}>
                        Send File
                    </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <progress
                        value={receivedBytes || 0}
                        max={totalBytes || 1}
                        style={{ width: '100%' }}
                    />
                    <div>
                        {receivedBytes} / {totalBytes} bytes
                    </div>
                </div>

                <h2>Logs</h2>
                <div
                    style={{
                        border: '1px solid #ccc',
                        padding: 10,
                        height: 300,
                        overflow: 'auto',
                        background: '#fafafa',
                        fontFamily: 'monospace',
                        fontSize: 12,
                    }}
                >
                    {logs.map((l, i) => (
                        <div key={i}>{l}</div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
