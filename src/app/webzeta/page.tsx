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

const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    }
    return bytes + ' B';
};

/* ---------- Component ---------- */

const HomePage: React.FC = () => {
    const [files, setFiles]                   = useState<FileList | null>(null);
    const [myId, setMyId]                     = useState('');
    const [remoteId, setRemoteId]             = useState('');
    const [totalBytes, setTotalBytes]         = useState(0);   // receiver current-file total
    const [receivedBytes, setReceivedBytes]   = useState(0);   // receiver current-file progress
    const [sendTotalBytes, setSendTotalBytes] = useState(0);   // sender overall total (all files)
    const [sentBytes, setSentBytes]           = useState(0);   // sender overall progress
    const [shareUrl, setShareUrl]             = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] =
        useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [isReceiver, setIsReceiver]         = useState(false);
    const [downloadReadySent, setDownloadReadySent] = useState(false);
    const [dataChannelOpen, setDataChannelOpen]     = useState(false);

    // multi-file display
    const [sendTotalFiles, setSendTotalFiles]           = useState(0);
    const [sendCurrentFileIdx, setSendCurrentFileIdx]   = useState(0);
    const [sendCurrentFileName, setSendCurrentFileName] = useState('');
    const [recvTotalFiles, setRecvTotalFiles]           = useState(0);
    const [recvCurrentFileIdx, setRecvCurrentFileIdx]   = useState(0);
    const [recvCurrentFileName, setRecvCurrentFileName] = useState('');

    const wsRef      = useRef<WebSocket | null>(null);
    const pcRef      = useRef<RTCPeerConnection | null>(null);
    const dcRef      = useRef<RTCDataChannel | null>(null);

    const writerRef  = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
    const bufferRef  = useRef<Uint8Array[] | null>(null);

    const expectedNameRef = useRef<string>('');
    const recvKeyRef      = useRef<CryptoKey | null>(null);
    const sendKeyRef      = useRef<CryptoKey | null>(null);

    const recvStartRef    = useRef<number>(0);

    // always-fresh reference to selected files
    const filesRef        = useRef<FileList | null>(null);

    // refs for logic
    const isReceiverRef      = useRef(false);
    const remoteIdRef        = useRef<string | null>(null);
    const peerReadyRef       = useRef(false);  // receiver clicked "Start download"
    const sendingRef         = useRef(false);  // prevent double send
    const dataChannelOpenRef = useRef(false);

    const fileInputRef       = useRef<HTMLInputElement | null>(null);

    // throttle state (local var, used inside sendFiles)
    let sendStart = 0;
    let bitsSent  = 0;

    const log = (m: string) => console.log('[P2P]', m);
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
        const target  = (bitsSent / LIMIT_BPS) * 1000;
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

        // Optional throttling
        // await throttleIfNeeded(buffer.byteLength);

        try {
            dc.send(buffer);
        } catch (err) {
            console.error('❌ Failed to send:', err);
        }
    }

    /* ---------- Central handshake: maybe start sending ---------- */

    const maybeStartSending = () => {
        if (isReceiverRef.current) return;
        if (sendingRef.current) return;
        if (!peerReadyRef.current) return;

        const currentFiles = filesRef.current;
        if (!currentFiles || currentFiles.length === 0) {
            log('peer is ready but no files selected yet');
            return;
        }
        if (!dataChannelOpenRef.current) {
            log('peer is ready but data channel not open yet');
            return;
        }

        log('All conditions met -> starting sendFiles()');
        sendFiles();
    };

    /* ---------- Parse URL: "?<code>" form ---------- */

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // e.g. "?abc123" -> code = "abc123"
        const raw = window.location.search.startsWith('?')
            ? window.location.search.slice(1)
            : '';
        const code = raw || null;

        if (code) {
            setRemoteId(code);
            remoteIdRef.current = code;
            setIsReceiver(true);
            isReceiverRef.current = true;
            log(`Receiver mode: remote peer ID from URL = ${code}`);
        }
    }, []);

    /* ---------- SW for StreamSaver (desktop) ---------- */

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/streamserver-sw.js')
                .then(() => log('ServiceWorker registered'))
                .catch((err) => log(`SW registration failed: ${err}`));
        }
    }, []);

    /* ---------- WS signaling + auto-connect for receiver ---------- */

    useEffect(() => {
        const id = Math.random().toString(36).slice(2, 8);
        setMyId(id);

        const ws = new WebSocket(`${SIGNALING_SERVER}?id=${id}`);
        ws.onopen = () => {
            log('WS connected');
            if (isReceiverRef.current && remoteIdRef.current) {
                log('Auto-connecting as receiver...');
                startCall(remoteIdRef.current);
            }
        };
        ws.onerror   = () => log('WS error');
        ws.onmessage = (e) => handleSignal(JSON.parse(e.data));
        wsRef.current = ws;

        return () => {
            ws.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- File selection + share link (sender) ---------- */

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setFiles(selectedFiles);
        filesRef.current = selectedFiles;

        const total = Array.from(selectedFiles).reduce(
            (acc, f) => acc + f.size,
            0
        );
        setSendTotalBytes(total);
        setSentBytes(0);
        setSendTotalFiles(selectedFiles.length);
        setSendCurrentFileIdx(selectedFiles.length > 0 ? 1 : 0);
        setSendCurrentFileName(selectedFiles[0]?.name || '');

        if (typeof window !== 'undefined' && myId) {
            const base = `${window.location.origin}${window.location.pathname}`;
            // URL format: https://domain/path?<myId>
            const url  = `${base}?${myId}`;
            setShareUrl(url);
            log(`Share link: ${url}`);
        }

        maybeStartSending();
    };

    const handleCopyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch (e) {
            console.warn('Failed to copy link', e);
        }
    };

    /* ---------- RTCPeerConnection & DataChannel ---------- */

    const initPC = (initiator: boolean) => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pc.onicecandidate = (ev) => {
            if (ev.candidate && remoteIdRef.current) {
                wsRef.current?.send(
                    JSON.stringify({
                        type: 'candidate',
                        candidate: ev.candidate,
                        to: remoteIdRef.current,
                    })
                );
            }
        };
        pc.oniceconnectionstatechange = () => {
            const state = pc.iceConnectionState;
            if (state === 'connected' || state === 'completed') {
                setConnectionStatus('connected');
            } else if (
                state === 'disconnected' ||
                state === 'failed' ||
                state === 'closed'
            ) {
                setConnectionStatus('disconnected');
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
            log('DataChannel open');
            setDataChannelOpen(true);
            dataChannelOpenRef.current = true;
            setConnectionStatus('connected');
            if (!isIOS()) {
                recvKeyRef.current = await importEncryptionKey(SECRET_KEY);
            } else {
                recvKeyRef.current = null;
            }

            maybeStartSending();
        };

        dc.onclose = () => {
            log('DataChannel closed');
            setDataChannelOpen(false);
            dataChannelOpenRef.current = false;
            setConnectionStatus('disconnected');
        };

        dc.onmessage = async (ev) => {
            if (typeof ev.data === 'string') {
                const msg = JSON.parse(ev.data);
                switch (msg.type) {
                    case 'file-meta': {
                        recvStartRef.current    = performance.now();
                        expectedNameRef.current = msg.name;

                        setTotalBytes(msg.size);
                        setReceivedBytes(0);

                        setRecvCurrentFileName(msg.name || '');
                        setRecvCurrentFileIdx(msg.index ?? 1);
                        setRecvTotalFiles(msg.total ?? 1);

                        writerRef.current = null;
                        bufferRef.current = null;

                        try {
                            if (!isIOS() && window.showSaveFilePicker) {
                                const handle = await window.showSaveFilePicker({
                                    suggestedName: msg.name,
                                });
                                writerRef.current = await handle.createWritable();
                            } else if (!isIOS() && window.streamSaver) {
                                const fileStream = window.streamSaver.createWriteStream(msg.name, {
                                    size: msg.size,
                                });
                                writerRef.current = fileStream.getWriter();
                            } else {
                                bufferRef.current = [];
                            }
                        } catch (err: any) {
                            console.error(err);
                            bufferRef.current = [];
                        }
                        break;
                    }

                    case 'file-end': {
                        const dur = (performance.now() - recvStartRef.current) / 1000;
                        log(`Received in ${dur.toFixed(2)}s`);

                        if (writerRef.current) {
                            try {
                                await writerRef.current.close();
                            } catch (e) {
                                console.warn('Failed to close writer (likely errored earlier):', e);
                            } finally {
                                writerRef.current = null;
                            }
                        }

                        if (bufferRef.current) {
                            try {
                                const blob = new Blob(bufferRef.current);
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement('a');
                                a.href     = url;
                                a.download = expectedNameRef.current || 'download.bin';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                            } catch (err: any) {
                                console.error('Failed to create Blob/download', err);
                            } finally {
                                bufferRef.current = null;
                            }
                        }

                        expectedNameRef.current = '';
                        sendingRef.current = false;
                        break;
                    }

                    case 'ready': {
                        log('Receiver is ready');
                        peerReadyRef.current = true;
                        maybeStartSending();
                        break;
                    }

                    default:
                        break;
                }
            } else {
                const encryptedOrPlain = new Uint8Array(ev.data as ArrayBuffer);
                let plain: Uint8Array;

                try {
                    if (!isIOS() && recvKeyRef.current) {
                        plain = await decryptChunk(encryptedOrPlain, recvKeyRef.current);
                    } else {
                        plain = encryptedOrPlain;
                    }

                    if (writerRef.current) {
                        try {
                            await writerRef.current.write(plain);
                        } catch (e) {
                            console.warn('writer.write errored, switching to in-memory buffer', e);
                            writerRef.current = null;
                            if (!bufferRef.current) bufferRef.current = [];
                            bufferRef.current.push(plain);
                        }
                    } else if (bufferRef.current) {
                        bufferRef.current.push(plain);
                    }

                    setReceivedBytes((r) => r + plain.byteLength);
                } catch (err: any) {
                    console.error('❌ Failed to handle incoming chunk:', err);
                }
            }
        };

        dcRef.current = dc;
    };

    /* ---------- Signaling handling ---------- */

    const handleSignal = async (msg: any) => {
        if (msg.type === 'offer') {
            remoteIdRef.current = msg.from;
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

    const startCall = async (targetId?: string | null) => {
        const to = targetId ?? remoteIdRef.current ?? remoteId;
        if (!to) {
            log('No remoteId set for startCall');
            return;
        }
        remoteIdRef.current = to;
        if (!pcRef.current) {
            initPC(true);
        }
        const offer = await pcRef.current!.createOffer();
        await pcRef.current!.setLocalDescription(offer);
        wsRef.current?.send(
            JSON.stringify({
                type: 'offer',
                offer,
                to,
            })
        );
        setConnectionStatus('connecting');
    };

    /* ---------- File sending ---------- */

    const sendFiles = async () => {
        if (sendingRef.current) {
            log('Already sending');
            return;
        }

        const currentFiles = filesRef.current;
        if (!currentFiles || currentFiles.length === 0) {
            log('No files selected to send (filesRef is empty)');
            return;
        }

        const dc = dcRef.current;
        if (!dc || dc.readyState !== 'open') {
            log('DataChannel is not open');
            return;
        }

        sendingRef.current = true;
        sendStart = performance.now();
        bitsSent  = 0;
        setSentBytes(0);
        setSendTotalFiles(currentFiles.length);

        if (!isIOS()) {
            sendKeyRef.current = await importEncryptionKey(SECRET_KEY);
        } else {
            sendKeyRef.current = null;
        }

        for (let i = 0; i < currentFiles.length; i++) {
            const f      = currentFiles[i];
            const size   = f.size;
            const chunks = Math.ceil(size / CHUNK_SIZE);

            setSendCurrentFileIdx(i + 1);
            setSendCurrentFileName(f.name);

            dc.send(
                JSON.stringify({
                    type: 'file-meta',
                    name:  f.name,
                    size,
                    chunks,
                    index: i + 1,
                    total: currentFiles.length,
                })
            );

            const t0  = performance.now();
            const key = sendKeyRef.current;
            const useEncryption = !!key; // false on iOS

            for (let idx = 0; idx < chunks; idx++) {
                const offset = idx * CHUNK_SIZE;
                const slice  = new Uint8Array(
                    await f.slice(offset, offset + CHUNK_SIZE).arrayBuffer()
                );

                const payload = useEncryption ? await encryptChunk(slice, key!) : slice;

                await safeSendWithThrottle(payload.buffer);

                setSentBytes((prev) => prev + slice.byteLength);
            }

            dc.send(
                JSON.stringify({
                    type: 'file-end',
                    name:  f.name,
                    size,
                    chunks,
                })
            );

            const dur = (performance.now() - t0) / 1000;
            log(
                `Sent ${f.name} (${(size / (1024 * 1024)).toFixed(
                    2
                )} MB) in ${dur.toFixed(2)}s`
            );
        }

        sendingRef.current = false;
    };

    /* ---------- UI ---------- */

    const prettyStatus =
        connectionStatus === 'connected'
            ? 'Connected'
            : connectionStatus === 'connecting'
                ? 'Connecting…'
                : 'Not connected';

    const currentTotal   = isReceiver ? totalBytes     : sendTotalBytes;
    const currentCurrent = isReceiver ? receivedBytes  : sentBytes;

    const progressPercent =
        currentTotal > 0 ? Math.round((currentCurrent / currentTotal) * 100) : 0;

    const showStartDownloadButton =
        isReceiver &&
        connectionStatus === 'connected' &&
        dataChannelOpen &&
        !downloadReadySent;

    const handleStartDownloadClick = () => {
        if (!dcRef.current) return;
        dcRef.current.send(JSON.stringify({ type: 'ready' }));
        peerReadyRef.current = true;
        setDownloadReadySent(true);
    };

    const currentFileName   = isReceiver ? recvCurrentFileName : sendCurrentFileName;
    const currentFileIndex  = isReceiver ? recvCurrentFileIdx  : sendCurrentFileIdx;
    const currentFileCount  = isReceiver ? recvTotalFiles      : sendTotalFiles;

    return (
        <>
            <Script src="/streamsaver.js" strategy="beforeInteractive" />
            <div
                style={{
                    minHeight: '100vh',
                    margin: 0,
                    padding: 0,
                    background: '#f9fafb',
                    color: '#111827',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
            >
                <div
                    style={{
                        maxWidth: 520,
                        margin: '0 auto',
                        padding: '24px 16px 40px',
                    }}
                >
                    {/* Header */}
                    <header style={{ textAlign: 'center', marginBottom: 24 }}>
                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                marginBottom: 4,
                            }}
                        >
                            Zetarya - Browser to Browser Transfer
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 13 }}>
                            end-to-end encrypted data transfer
                        </p>
                        <div
                            style={{
                                display: 'inline-flex',
                                marginTop: 8,
                                padding: '4px 10px',
                                borderRadius: 999,
                                border: '1px solid #e5e7eb',
                                fontSize: 11,
                                color: '#4b5563',
                            }}
                        >
                            Status:&nbsp;
                            <span style={{ fontWeight: 600 }}>{prettyStatus}</span>
                        </div>
                    </header>

                    {/* Card */}
                    <main
                        style={{
                            background: '#ffffff',
                            borderRadius: 16,
                            padding: 20,
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
                        }}
                    >
                        {/* IDs */}
                        <div
                            style={{
                                marginBottom: 16,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: 12,
                            }}
                        >
                            <div>
                                <div style={{ color: '#9ca3af', marginBottom: 2 }}>
                                    Your peer ID
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: '#111827',
                                    }}
                                >
                                    {myId || '…'}
                                </div>
                            </div>
                            <div
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: 999,
                                    border: '1px solid #e5e7eb',
                                    fontSize: 11,
                                    color: '#4b5563',
                                }}
                            >
                                {isReceiver ? 'Receiver' : 'Sender'}
                            </div>
                        </div>

                        {/* Sender: file picker + share link + file list */}
                        {!isReceiver && (
                            <>
                                <div
                                    style={{
                                        borderRadius: 12,
                                        padding: 16,
                                        border: '1px dashed #d1d5db',
                                        marginBottom: 16,
                                        textAlign: 'center',
                                        backgroundColor: '#f9fafb',
                                    }}
                                >
                                    <p style={{ marginBottom: 8, fontSize: 14 }}>
                                        Choose one or more files to share
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: 999,
                                            border: '1px solid #d1d5db',
                                            backgroundColor: '#ffffff',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Select files
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                                        Share the link below with the receiver.
                                    </p>
                                </div>

                                {files && files.length > 0 && (
                                    <div
                                        style={{
                                            marginBottom: 16,
                                            padding: 12,
                                            borderRadius: 12,
                                            backgroundColor: '#f9fafb',
                                            border: '1px solid #e5e7eb',
                                            fontSize: 13,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 4,
                                            }}
                                        >
                                            <span style={{ fontWeight: 500 }}>Files selected</span>
                                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {files.length} file{files.length > 1 ? 's' : ''} ·{' '}
                                                {formatSize(sendTotalBytes)}
                      </span>
                                        </div>
                                        <div
                                            style={{
                                                maxHeight: 120,
                                                overflowY: 'auto',
                                                paddingTop: 4,
                                            }}
                                        >
                                            {Array.from(files).map((f, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: 12,
                                                        padding: '4px 0',
                                                        borderBottom:
                                                            idx === files.length - 1
                                                                ? 'none'
                                                                : '1px dashed #e5e7eb',
                                                    }}
                                                >
                          <span
                              style={{
                                  maxWidth: '70%',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                              }}
                          >
                            {f.name}
                          </span>
                                                    <span style={{ color: '#6b7280' }}>
                            {formatSize(f.size)}
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {shareUrl && (
                                    <div
                                        style={{
                                            marginBottom: 16,
                                            padding: 12,
                                            borderRadius: 12,
                                            backgroundColor: '#f9fafb',
                                            border: '1px solid #e5e7eb',
                                            fontSize: 13,
                                        }}
                                    >
                                        <div style={{ marginBottom: 6, fontWeight: 500 }}>
                                            Share link
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 12,
                                                wordBreak: 'break-all',
                                                marginBottom: 8,
                                            }}
                                        >
                                            {shareUrl}
                                        </div>
                                        <button
                                            onClick={handleCopyLink}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: 999,
                                                border: 'none',
                                                fontSize: 12,
                                                fontWeight: 500,
                                                backgroundColor: '#2563eb',
                                                color: '#f9fafb',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Copy link
                                        </button>
                                        <p
                                            style={{
                                                marginTop: 6,
                                                fontSize: 11,
                                                color: '#6b7280',
                                            }}
                                        >
                                            Receiver opens this link, waits for connection,
                                            then clicks “Start download”. All files will transfer
                                            automatically.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Receiver: Start download button */}
                        {isReceiver && (
                            <div
                                style={{
                                    marginBottom: 16,
                                    padding: 12,
                                    borderRadius: 12,
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#f9fafb',
                                    fontSize: 13,
                                }}
                            >
                                <p style={{ marginBottom: 6 }}>
                                    You opened a share link. We’re connecting to the sender…
                                </p>
                                <p style={{ fontSize: 11, color: '#6b7280' }}>
                                    Once connected, click the button below to start the download.
                                </p>

                                {showStartDownloadButton ? (
                                    <button
                                        onClick={handleStartDownloadClick}
                                        style={{
                                            marginTop: 10,
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 999,
                                            border: 'none',
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            backgroundColor: '#2563eb',
                                            color: '#f9fafb',
                                        }}
                                    >
                                        Start download
                                    </button>
                                ) : (
                                    <div
                                        style={{
                                            marginTop: 10,
                                            fontSize: 12,
                                            color: '#9ca3af',
                                        }}
                                    >
                                        {connectionStatus === 'connected'
                                            ? 'Ready. Waiting to start…'
                                            : 'Connecting to sender…'}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Progress */}
                        <div
                            style={{
                                marginTop: 8,
                                paddingTop: 8,
                                borderTop: '1px solid #f3f4f6',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    marginBottom: 4,
                                }}
                            >
                                <div style={{ fontSize: 12 }}>
                                    <div style={{ fontWeight: 500, marginBottom: 2 }}>
                                        {currentFileName || 'No file active'}
                                    </div>
                                    {currentFileIndex > 0 && currentFileCount > 0 && (
                                        <div style={{ fontSize: 11, color: '#6b7280' }}>
                                            File {currentFileIndex} of {currentFileCount}
                                        </div>
                                    )}
                                </div>
                                <span style={{ fontSize: 12 }}>
                  {progressPercent}%{' '}
                                    <span style={{ color: '#6b7280', fontSize: 11 }}>
                    ({isReceiver ? 'download' : 'upload'})
                  </span>
                </span>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    height: 8,
                                    borderRadius: 999,
                                    backgroundColor: '#e5e7eb',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${progressPercent}%`,
                                        height: '100%',
                                        backgroundColor: '#22c55e',
                                        transition: 'width 0.15s linear',
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: '#6b7280',
                                    marginTop: 4,
                                    fontFamily: 'monospace',
                                }}
                            >
                                {formatSize(currentCurrent)} / {formatSize(currentTotal)}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default HomePage;
