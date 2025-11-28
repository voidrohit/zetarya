'use client';

import React, {useEffect, useRef, useState} from 'react';
import Script from 'next/script';
import SparkMD5 from 'spark-md5';

const SIGNALING_SERVER = 'ws://52.66.111.222:8080/ws';
const ICE_SERVERS      = [{ urls: 'stun:stun.l.google.com:19302' }];
const CHUNK_SIZE       = 1024 * 64;       // 64 KiB
const LIMIT_BPS        = 1024 * 1024 * 50;       // 1 Mbps throttle
const PARALLELS        = 80;

interface ChunkWithHash {
    data: Uint8Array;
    hash: string;
}

const chunkMap = new Map<number, ChunkWithHash>();

declare global {
    interface Window {
        showSaveFilePicker?: any;
        streamSaver?: any;
    }
}

interface ChunkItem {
    idx: number;          // chunk sequence number
    chunk: Uint8Array;    // the chunk payload
}

const generateIV = () => crypto.getRandomValues(new Uint8Array(12));

async function importEncryptionKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32));
    return crypto.subtle.importKey(
        'raw',
        enc,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptChunk(data: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
    const iv = generateIV();
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const encryptedBytes = new Uint8Array(encrypted);

    // Prepend IV (12 bytes) to the encrypted data
    const full = new Uint8Array(12 + encryptedBytes.length);
    full.set(iv, 0);
    full.set(encryptedBytes, 12);
    return full;
}

async function decryptChunk(encryptedData: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new Uint8Array(decrypted);
}


// 2) A generic min-heap PQ with a comparator
class PriorityQueue {
    private heap: ChunkItem[] = [];

    constructor(private compare: (a: ChunkItem, b: ChunkItem) => number) {}

    // Number of items in the queue
    size(): number {
        return this.heap.length;
    }

    clear() {
        this.heap = [];
    }

    // Peek at the smallest item
    peek(): ChunkItem | undefined {
        return this.heap[0];
    }

    // Push a new item and bubble it up
    enqueue(item: ChunkItem) {
        this.heap.push(item);
        this._siftUp(this.heap.length - 1);
    }

    // Remove and return the smallest item
    dequeue(): ChunkItem | undefined {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0];
        const last = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._siftDown(0);
        }
        return top;
    }

    private _parent(i: number) { return Math.floor((i - 1) / 2); }
    private _left(i: number)   { return 2 * i + 1; }
    private _right(i: number)  { return 2 * i + 2; }

    private _siftUp(i: number) {
        let idx = i;
        while (idx > 0) {
            const p = this._parent(idx);
            if (this.compare(this.heap[idx], this.heap[p]) < 0) {
                [this.heap[idx], this.heap[p]] = [this.heap[p], this.heap[idx]];
                idx = p;
            } else break;
        }
    }

    private _siftDown(i: number) {
        let idx = i;
        const n = this.heap.length;
        while (true) {
            const l = this._left(idx);
            const r = this._right(idx);
            let smallest = idx;

            if (l < n && this.compare(this.heap[l], this.heap[smallest]) < 0) {
                smallest = l;
            }
            if (r < n && this.compare(this.heap[r], this.heap[smallest]) < 0) {
                smallest = r;
            }
            if (smallest !== idx) {
                [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
                idx = smallest;
            } else {
                break;
            }
        }
    }
}

function pad(str: string, length: number, padChar = '\0'): Uint8Array {
    const buffer = new Uint8Array(length).fill(padChar.charCodeAt(0));
    const encoded = new TextEncoder().encode(str);
    buffer.set(encoded.slice(0, length));
    return buffer;
}

function octal(value: number, length: number): Uint8Array {
    const str = value.toString(8).padStart(length - 1, '0') + '\0';
    return new TextEncoder().encode(str.padEnd(length, '\0')).slice(0, length);
}


const HomePage: React.FC = () => {
    // UI
    const [file, setFile]                   = useState<File|null>(null);
    const [files, setFiles]                 = useState<FileList | null>(null);
    const [myId, setMyId]                   = useState('');
    const [remoteId, setRemoteId]           = useState('');
    const [logs, setLogs]                   = useState<string[]>([]);
    const [totalBytes, setTotalBytes]       = useState(0);
    const [receivedBytes, setReceivedBytes] = useState(0);
    const [filesSize, setFilesSize] = useState<number | 0>(0);

    // Refs
    const fileRef   = useRef<File | null>(null);
    const wsRef      = useRef<WebSocket|null>(null);
    const pcRef      = useRef<RTCPeerConnection|null>(null);
    const dcRef      = useRef<RTCDataChannel|null>(null);
    const writerRef  = useRef<WritableStreamDefaultWriter<Uint8Array>|null>(null);
    const recvHasher = useRef<SparkMD5.ArrayBuffer|null>(null);
    const totalChunks = useRef<number|0>(0);
    const receiveTotalChunks = useRef<number|0>(0);
    const nextExpectedIdxRef = useRef<number | 0>(0);
    const recvStart     = useRef(0);
    const expectedHash  = useRef('');
    const expectedName  = useRef('');
    let isProcessing = false;

    // used for throttle
    let sendStart = 0;
    let bitsSent  = 0;


    const log = (m: string) => setLogs(l => [...l, m]);
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    // ensure we don’t flood the data channel
    const waitForLowBuffer = () => {
        const dc = dcRef.current!;
        if (dc.bufferedAmount <= CHUNK_SIZE*30) return Promise.resolve();
        return new Promise<void>(res => {
            const cb = () => {
                dc.removeEventListener('bufferedamountlow', cb);
                res();
            };
            dc.addEventListener('bufferedamountlow', cb);
        });
    };

    // throttle to ~LIMIT_BPS
    const throttleIfNeeded = async (bytes: number) => {
        bitsSent += bytes * 8;
        const elapsed = performance.now() - sendStart;
        const target  = (bitsSent / LIMIT_BPS) * 1000;
        if (target > elapsed) {
            await sleep(target - elapsed);
        }
    };

    const chunkPQRef = useRef(
        // comparator: sort by idx ascending
        new PriorityQueue((a, b) => a.idx - b.idx)
    );

    const pq = chunkPQRef.current;

    // register our SW for streamsaver
    useEffect(() => {
        console.log(navigator)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/streamserver-sw.js')
                .then(reg => {
                    log(`🥞 SW registered, ${reg}`);
                })
                .catch(err => {
                    log(`⚠️ SW registration failed, ${err}`);
                });

            console.log('Service worker registration successfully.');
        }
    }, []);



    async function createEncryptedChunks(
        files: File[],
        secretKey: string
    ): Promise<void> {
        if (!files || files.length === 0) {
            console.warn("No files provided.");
            return;
        }

        const key = await importEncryptionKey(secretKey);
        const chunkSizeBytes = CHUNK_SIZE;
        let chunkIndex = 0;

        for (const file of files) {
            for (let offset = 0; offset < file.size; offset += chunkSizeBytes) {
                const chunk = new Uint8Array(
                    await file.slice(offset, offset + chunkSizeBytes).arrayBuffer()
                );

                const encryptedChunk = await encryptChunk(chunk, key);
                const hash = await getSHA256Hash(encryptedChunk);

                chunkMap.set(chunkIndex++, {
                    data: encryptedChunk,
                    hash: hash,
                });

                totalChunks.current = Math.max(totalChunks.current, chunkIndex);
            }
        }
    }



    const processQueue = async (end: boolean) => {
        // if (isProcessingRef.current) return;
        // isProcessingRef.current = true;
        if (isProcessing) return;
        isProcessing = true;


        try {
            while (nextExpectedIdxRef.current != receiveTotalChunks.current) {
                const peek = pq.peek();

                console.log(pq, peek?.idx, nextExpectedIdxRef.current, receiveTotalChunks.current);
                if (!peek || peek.idx !== nextExpectedIdxRef.current) {
                    if (!end) break;
                    log(`⏳ Waiting for chunk idx=${nextExpectedIdxRef.current}, got=${peek?.idx}`);

                    await sleep(30);
                    continue;
                }

                console.log(`Received ${peek?.idx}`);

                const chunk = pq.dequeue()!;
                writerRef.current!.write(chunk.chunk);
                recvHasher.current!.append(
                    chunk.chunk.buffer.slice(chunk.chunk.byteOffset, chunk.chunk.byteOffset + chunk.chunk.byteLength) as ArrayBuffer
                );
                nextExpectedIdxRef.current++;
                // Only process one chunk unless it's the end
            }
        } finally {
            // isProcessingRef.current = false;
            isProcessing = false;
        }
    };


    // signaling
    useEffect(() => {
        const id = Math.random().toString(36).slice(2,8);
        setMyId(id);
        const ws = new WebSocket(`${SIGNALING_SERVER}?id=${id}`);
        ws.onopen    = () => log('🔗 WS connected');
        ws.onerror   = () => log('⚠️ WS error');
        ws.onmessage = e => handleSignal(JSON.parse(e.data));
        wsRef.current = ws;
        return () => ws.close();
    }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        setFiles(selectedFiles);

        // Calculate total size in bytes
        const totalSize = Array.from(selectedFiles).reduce(
            (acc, file) => acc + file.size,
            0
        );

        setFilesSize(totalSize);
        console.log("Selected files:", selectedFiles);
        console.log("Total size (bytes):", totalSize);
    };

    // create PC + DC
    const initPC = (initiator: boolean) => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pc.onicecandidate = ev => {
            if (ev.candidate && remoteId) {
                wsRef.current!.send(JSON.stringify({
                    type: 'candidate',
                    candidate: ev.candidate,
                    to: remoteId
                }));
            }
        };
        pc.ondatachannel = ev => setupChannel(ev.channel);
        if (initiator) {
            const dc = pc.createDataChannel('fileChannel', { ordered: true });
            setupChannel(dc);
        }
        pcRef.current = pc;
    };

    // wire up the DC
    const setupChannel = (dc: RTCDataChannel) => {

        dc.binaryType = 'arraybuffer';
        dc.onopen     = () => log('📡 DataChannel open');
        dc.onmessage  = async ev => {
            if (typeof ev.data === 'string') {
                // meta or end
                const msg = JSON.parse(ev.data);
                switch (msg.type) {
                    case 'file-meta':
                        // console.log(msg);
                        recvStart.current = performance.now();
                        expectedName.current = msg.name;
                        // expectedHash.current = msg.hash;
                        // start receive
                        setTotalBytes(msg.size);
                        setReceivedBytes(0);
                        recvHasher.current = new SparkMD5.ArrayBuffer();
                        if (window.showSaveFilePicker) {
                            const handle = await window.showSaveFilePicker({ suggestedName: msg.name });
                            writerRef.current = await handle.createWritable();
                        } else {
                            writerRef.current = window.streamSaver!
                                .createWriteStream(msg.name).getWriter();
                        }
                        log(`📁 Receiving ${msg.name}`);
                        // isProcessingRef.current = true;

                        // await processQueue();
                        break
                    case 'file-end' :

                        await processQueue(true);

                        // const finalHash = recvHasher.current!.end();
                        const dur = (performance.now() - recvStart.current) / 1000;
                        // log(finalHash === expectedHash.current
                        //     ? '✅ Integrity OK'
                        //     : `❌ MD5 mismatch (got ${finalHash})`
                        // );
                        log(`⏱ ${dur.toFixed(2)}s`);
                        await writerRef.current?.close();
                        log(`💾 Saved ${expectedName.current}`);
                        nextExpectedIdxRef.current = 0;
                        // pq.clear()
                        recvHasher.current = null;
                        expectedName.current = "";
                        break;
                }
            } else {
                const packet = ev.data as ArrayBuffer;
                const dv = new DataView(packet);

                const idx = dv.getUint32(0, false);
                const chunkLen = dv.getUint32(4, false);
                const hashLen = dv.getUint32(8, false);

                receiveTotalChunks.current = dv.getUint32(12, false);


                const hashBytes = new Uint8Array(packet.slice(16, 16 + hashLen));
                const hash = new TextDecoder().decode(hashBytes);

                const chunk = new Uint8Array(packet.slice(16 + hashLen, 16 + hashLen + chunkLen));

                const receivedhash = await getSHA256Hash(chunk);

                const secretKey = "abcdefghijklmnopqrstuwxyz";
                const key = await importEncryptionKey(secretKey);

                const decryptedReceivedChunk = await decryptChunk(chunk, key)

                // console.log(hash === receivedhash)

                if (hash != receivedhash) {
                    log(`XXX Mismatched ${receivedhash}`)
                }

                pq.enqueue({idx, chunk: decryptedReceivedChunk})
                // console.log(idx);
                processQueue(false)
                // } else {
                //     console.log("Resend the chunk with idx:", idx)
                // }

                setReceivedBytes(r => r + chunk.byteLength);

            }
        };
        dcRef.current = dc;
    };

    // handle WS signaling
    const handleSignal = async (msg: any) => {
        if (msg.type === 'offer') {
            setRemoteId(msg.from);
            initPC(false);
            await pcRef.current!.setRemoteDescription(msg.offer);
            const answer = await pcRef.current!.createAnswer();
            await pcRef.current!.setLocalDescription(answer);
            wsRef.current!.send(JSON.stringify({
                type: 'answer',
                answer,
                to: msg.from
            }));
        } else if (msg.type === 'answer') {
            await pcRef.current!.setRemoteDescription(msg.answer);
        } else if (msg.type === 'candidate') {
            await pcRef.current!.addIceCandidate(msg.candidate);
        }
    };

    // “Connect” → createOffer
    const startCall = async () => {

        if (!remoteId) return;
        initPC(true);
        const offer = await pcRef.current!.createOffer();
        await pcRef.current!.setLocalDescription(offer);
        wsRef.current!.send(JSON.stringify({
            type: 'offer',
            offer,
            to: remoteId
        }));
    };

    async function safeSendWithThrottle(buffer: ArrayBuffer): Promise<void> {
        const dc = dcRef.current!;
        if (!dc || dc.readyState !== 'open') return;

        // Wait if buffer is too full
        while (dc.bufferedAmount > CHUNK_SIZE * 60) {
            await waitForLowBuffer();
        }

        // await throttleIfNeeded(buffer.byteLength);

        try {
            dc.send(buffer);
        } catch (err) {
            console.error('❌ Failed to send:', err);
            // Optional retry logic could be added here
        }
    }

    const sendNewFiles = async (batch: number, index: number, parallels: number, f: any, chunks: number) => {
        const idx = (batch * parallels) + index;
        if (idx >= chunks) return;

        // ⏳ Wait until chunk is available
        while (!chunkMap.has(idx)) {
            await sleep(50);
        }

        const entry = chunkMap.get(idx)!;
        const chunk = entry.data;
        const hashStr = entry.hash;

        const hashBytes = new TextEncoder().encode(hashStr);
        const hashLen = hashBytes.length;

        const header = new ArrayBuffer(16);
        const dv = new DataView(header);
        dv.setUint32(0, idx, false);
        dv.setUint32(4, chunk.byteLength, false);
        dv.setUint32(8, hashLen, false);
        dv.setUint32(12, totalChunks.current, false);

        const packet = new Uint8Array(16 + hashLen + chunk.byteLength);
        packet.set(new Uint8Array(header), 0);
        packet.set(hashBytes, 16);
        packet.set(chunk, 16 + hashLen);

        await safeSendWithThrottle(packet.buffer);
        log(`⬆️ Sent chunk ${idx}/${chunks}`);

        await sendNewFiles(batch + 1, index, parallels, f, chunks);
    };


    async function getSHA256Hash(data: Uint8Array): Promise<string> {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const sendFiles = async () => {
        if (!files || files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            fileRef.current = f;

            const secretKey = "abcdefghijklmnopqrstuwxyz";

            createEncryptedChunks([f], secretKey);

            // await sleep(1000);

            const size   = f.size;
            const chunks = Math.ceil(size / CHUNK_SIZE);
            // const fileHash = new SparkMD5.ArrayBuffer()
            //     .append(await f.arrayBuffer())
            //     .end();

            while (dcRef.current?.readyState !== 'open') {
                await sleep(50);
            }

            dcRef.current!.send(JSON.stringify({
                type: 'file-meta',
                name:  f.name,
                size,
                // hash:  fileHash,
                chunks
            }));
            log(`📄 Sending file ${i + 1}/${files.length}: ${f.name}`);
            // log(`🔑 MD5 ${fileHash}`);

            const t0 = performance.now();

            const promises: Promise<void>[] = [];
            for (let worker = 0; worker < PARALLELS; worker++) {
                promises.push(sendNewFiles(0, worker, PARALLELS, f, chunks));
            }

            await Promise.all(promises);

            dcRef.current!.send(JSON.stringify({
                type: 'file-end',
                name:  f.name,
                size,
                chunks,
            }));

            const dur = (performance.now() - t0) / 1000;

            // await sleep(1000);

            log(`✅ Sent ${f.name} (${(size / (1024 * 1024)).toFixed(2)} MB) in ${dur.toFixed(2)}s`);
        }
    };


    return (
        <>
            <Script src="/streamsaver.js" strategy="beforeInteractive" />
            <div style={{ padding:20, maxWidth:600, margin:'auto' }}>
                {/*<h1>P2P File Transfer</h1>*/}
                <p>Your ID: <strong>{myId}</strong></p>

                <div style={{ marginBottom:12 }}>
                    <input
                        placeholder="Remote peer ID"
                        value={remoteId}
                        onChange={e => setRemoteId(e.target.value)}
                        style={{ marginRight:8 }}
                    />
                    <button onClick={startCall} disabled={!remoteId}>
                        Connect
                    </button>
                </div>

                <div style={{ marginBottom:12 }}>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    <button onClick={sendFiles} disabled={!files} style={{ marginLeft:8 }}>
                        Send File
                    </button>
                </div>

                <div style={{ marginBottom:12 }}>
                    <progress value={receivedBytes} max={totalBytes} style={{ width:'100%' }} />
                    <div>{receivedBytes} / {totalBytes} bytes</div>
                </div>

                <h2>Logs</h2>
                <div style={{
                    border:'1px solid #ccc',
                    padding:10,
                    height:300,
                    overflow:'auto',
                    background:'#fafafa',
                    fontFamily:'monospace',
                    fontSize:12
                }}>
                    {logs.map((l,i)=><div key={i}>{l}</div>)}
                </div>
            </div>
        </>
    );
};

export default HomePage;
