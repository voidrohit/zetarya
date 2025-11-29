'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import SparkMD5 from 'spark-md5';

const SIGNALING_SERVER = 'wss://signal.mineger.com/ws';
const ICE_SERVERS      = [{ urls: 'stun:stun.l.google.com:19302' }];
const CHUNK_SIZE       = 1024 * 64; // 64 KiB
const LIMIT_BPS        = 1024 * 1024 * 50; // 50 Mbps (throttle, if enabled)

declare global {
    interface Window {
        showSaveFilePicker?: any;
        streamSaver?: any;
    }
}

const SECRET_KEY = 'abcdefghijklmnopqrstuwxyz'; // must match on both sides

const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

/* ---------- Crypto helpers ---------- */

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

    // Prepend IV to encrypted data
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
    // UI
    const [files, setFiles]                 = useState<FileList | null>(null);
    const [myId, setMyId]                   = useState('');
    const [remoteId, setRemoteId]           = useState('');
    const [logs, setLogs]                   = useState<string[]>([]);
    const [totalBytes, setTotalBytes]       = useState(0);
    const [receivedBytes, setReceivedBytes] = useState(0);

    // Refs
    const wsRef        = useRef<WebSocket | null>(null);
    const pcRef        = useRef<RTCPeerConnection | null>(null);
    const dcRef        = useRef<RTCDataChannel | null>(null);
    const writerRef    = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
    const recvHasher   = useRef<SparkMD5.ArrayBuffer | null>(null);
    const recvStartRef = useRef(0);
    const expectedName = useRef('');
    const recvKeyRef   = useRef<CryptoKey | null>(null);

    // Fallback for platforms with no WritableStream to disk (iOS)
    const bufferedChunksRef = useRef<Uint8Array[] | null>(null);

    // Sender-side key
    const sendKeyRef = useRef<CryptoKey | null>(null);

    // Throttle
    let sendStart = 0;
    let bitsSent = 0;

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

        // Optionally enable throttling:
        // await throttleIfNeeded(buffer.byteLength);

        try {
            dc.send(buffer);
        } catch (err) {
            console.error('❌ Failed to send:', err);
            log('❌ Failed to send a chunk');
        }
    }

    /* ---------- Service worker for StreamSaver ---------- */

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/streamserver-sw.js')
                .then((reg) => {
                    log(`🥞 ServiceWorker registered`);
                })
                .catch((err) => {
                    log(`⚠️ ServiceWorker registration failed: ${err}`);
                });
        }
    }, []);

    /* ---------- WS signaling setup ---------- */

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

    /* ---------- PeerConnection & DataChannel ---------- */

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
            // Prepare Crypto key for receiving
            recvKeyRef.current = await importEncryptionKey(SECRET_KEY);
        };

        dc.onmessage = async (ev) => {
            if (typeof ev.data === 'string') {
                const msg = JSON.parse(ev.data);
                switch (msg.type) {
                    case 'file-meta': {
                        recvStartRef.current = performance.now();
                        expectedName.current = msg.name;
                        setTotalBytes(msg.size);
                        setReceivedBytes(0);
                        recvHasher.current = new SparkMD5.ArrayBuffer();

                        // Try streaming to disk where possible (desktop)
                        writerRef.current = null;
                        bufferedChunksRef.current = null;

                        try {
                            if (window.showSaveFilePicker && !isIOS()) {
                                log('📝 Using showSaveFilePicker');
                                const handle = await window.showSaveFilePicker({
                                    suggestedName: msg.name,
                                });
                                writerRef.current = await handle.createWritable();
                            } else if (window.streamSaver && !isIOS()) {
                                log('📝 Using StreamSaver');
                                const fileStream = window.streamSaver.createWriteStream(msg.name, {
                                    size: msg.size,
                                });
                                writerRef.current = fileStream.getWriter();
                            } else {
                                // Fallback: buffer in memory; will turn into Blob at the end
                                log('🧠 Fallback: buffering in memory (may be limited on mobile)');
                                bufferedChunksRef.current = [];
                            }
                        } catch (err: any) {
                            console.error(err);
                            log('❌ Failed to open file for saving: ' + (err?.message || err));
                            bufferedChunksRef.current = [];
                        }

                        if (!writerRef.current && !bufferedChunksRef.current) {
                            log(
                                '❌ No valid saving mechanism. Will receive data but cannot save file.'
                            );
                        } else {
                            log(`📁 Receiving ${msg.name}`);
                        }
                        break;
                    }

                    case 'file-end': {
                        const dur = (performance.now() - recvStartRef.current) / 1000;

                        if (writerRef.current) {
                            await writerRef.current.close();
                            log(`💾 Saved ${expectedName.current} via stream`);
                        } else if (bufferedChunksRef.current) {
                            try {
                                const blob = new Blob(bufferedChunksRef.current);
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = expectedName.current || 'download.bin';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                                log(`💾 Saved ${expectedName.current} via Blob download`);
                            } catch (err) {
                                console.error(err);
                                log('❌ Failed to create Blob/download: ' + (err as any)?.message);
                            } finally {
                                bufferedChunksRef.current = null;
                            }
                        }

                        const finalHash = recvHasher.current?.end();
                        log(`⏱ Received in ${dur.toFixed(2)}s`);
                        if (finalHash) {
                            log(`🔑 Final MD5 (receiver): ${finalHash}`);
                        }

                        expectedName.current = '';
                        recvHasher.current = null;
                        setTotalBytes(0);
                        setReceivedBytes(0);
                        break;
                    }

                    default:
                        break;
                }
            } else {
                // Binary data: an encrypted chunk
                const key = recvKeyRef.current;
                if (!key) {
                    log('❌ No decryption key on receiver');
                    return;
                }

                try {
                    const encrypted = new Uint8Array(ev.data as ArrayBuffer);
                    const decrypted = await decryptChunk(encrypted, key);

                    // Stream to writer if available, else buffer
                    if (writerRef.current) {
                        await writerRef.current.write(decrypted);
                    } else if (bufferedChunksRef.current) {
                        bufferedChunksRef.current.push(decrypted);
                    }

                    // Update MD5 & progress
                    recvHasher.current?.append(
                        decrypted.buffer.slice(
                            decrypted.byteOffset,
                            decrypted.byteOffset + decrypted.byteLength
                        )
                    );
                    setReceivedBytes((r) => r + decrypted.byteLength);
                } catch (err) {
                    console.error(err);
                    log('❌ Failed to decrypt/write a chunk: ' + (err as any)?.message);
                }
            }
        };

        dcRef.current = dc;
    };

    /* ---------- Signaling handlers ---------- */

    const handleSignal = async (msg: any) => {
        if (msg.type === 'offer') {
            setRemoteId(msg.from);
            initPC(false);
            await pcRef.current!.setRemoteDescription(msg.offer);
            const answer = await pcRef.current!.createAnswer();
            await pcRef.current!.setLocalDescription(answer);
            wsRef.current!.send(
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
        wsRef.current!.send(
            JSON.stringify({
                type: 'offer',
                offer,
                to: remoteId,
            })
        );
    };

    /* ---------- File sending logic (streaming, no pre-buffer) ---------- */

    const sendFiles = async () => {
        if (!files || files.length === 0) return;
        const dc = dcRef.current;
        if (!dc || dc.readyState !== 'open') {
            log('⚠️ DataChannel is not open');
            return;
        }

        sendStart = performance.now();
        bitsSent = 0;
        sendKeyRef.current = await importEncryptionKey(SECRET_KEY);

        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const size = f.size;
            const chunks = Math.ceil(size / CHUNK_SIZE);

            // Pre-calc MD5 of original file (optional, but streaming all at once is heavy).
            // For large files you may want to skip this or compute on the fly.
            const md5 = await new SparkMD5.ArrayBuffer().append(await f.arrayBuffer()).end();

            // Send meta
            dc.send(
                JSON.stringify({
                    type: 'file-meta',
                    name: f.name,
                    size,
                    chunks,
                    md5,
                })
            );

            log(
                `📄 Sending file ${i + 1}/${files.length}: ${f.name} (${(
                    size /
                    (1024 * 1024)
                ).toFixed(2)} MB)`
            );
            log(`🔑 MD5 (sender): ${md5}`);

            const key = sendKeyRef.current!;
            const t0 = performance.now();

            // Stream chunks sequentially (simpler & more stable for large files)
            for (let idx = 0; idx < chunks; idx++) {
                const offset = idx * CHUNK_SIZE;
                const slice = new Uint8Array(
                    await f.slice(offset, offset + CHUNK_SIZE).arrayBuffer()
                );

                const encrypted = await encryptChunk(slice, key);
                await safeSendWithThrottle(encrypted.buffer);

                if (idx % 128 === 0 || idx === chunks - 1) {
                    log(`⬆️ Sent chunk ${idx + 1}/${chunks}`);
                }
            }

            // Send end marker
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
