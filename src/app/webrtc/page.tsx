'use client';

import React, { useRef, useState, useEffect } from 'react';

const SIGNALING_URL = 'wss://signal.mineger.com/ws';
const ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
];

type Role = 'host' | 'viewer';

type PlayPauseSeekMsg = {
    type: 'play' | 'pause' | 'seek';
    time: number;
    from: Role;
};

type MetaMsg = {
    type: 'meta';
    duration: number;
};

type TimeMsg = {
    type: 'time';
    time: number;
};

type ControlMsg = PlayPauseSeekMsg | MetaMsg | TimeMsg;

function formatTime(seconds: number) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s
            .toString()
            .padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function WebRTCFilePage() {
    const [role, setRole] = useState<Role>('host');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('Idle');
    const [error, setError] = useState<string | null>(null);

    const [hostFile, setHostFile] = useState<File | null>(null);

    // canonical timeline from host
    const [remoteDuration, setRemoteDuration] = useState(0);
    const [remoteCurrentTime, setRemoteCurrentTime] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const controlDcRef = useRef<RTCDataChannel | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    // host's real file duration
    const hostDurationRef = useRef(0);
    // host's MediaStream from captureStream
    const localStreamRef = useRef<MediaStream | null>(null);

    // used to avoid feedback loops when we apply remote actions
    const isApplyingRemoteRef = useRef(false);

    function logStatus(msg: string) {
        console.log('[STATUS]', msg);
        setStatus(msg);
    }

    function resetConnection() {
        try {
            controlDcRef.current?.close();
            controlDcRef.current = null;
            pcRef.current?.getSenders().forEach((s) => {
                if (s.track) s.track.stop();
            });
            pcRef.current?.close();
            pcRef.current = null;
            wsRef.current?.close();
            wsRef.current = null;
        } catch (e) {
            console.warn('Error resetting', e);
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = '';
        }

        hostDurationRef.current = 0;
        localStreamRef.current = null;

        setRemoteDuration(0);
        setRemoteCurrentTime(0);
        setError(null);
        logStatus('Idle');
    }

    function connectSignaling(onOpen: () => void) {
        if (!code.trim()) {
            setError('Please enter a room code.');
            return;
        }

        setError(null);
        const ws = new WebSocket(SIGNALING_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            logStatus('Connected to signaling server.');
            onOpen();
        };

        ws.onerror = (evt) => {
            console.error('WS error', evt);
            setError('WebSocket error.');
        };

        ws.onclose = () => {
            logStatus('Signaling connection closed.');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleSignalingMessage(data);
        };
    }

    function sendToSignaling(msg: any) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
    }

    function createPeerConnection() {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pcRef.current = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendToSignaling({
                    type: 'signal',
                    code,
                    payload: { kind: 'ice-candidate', candidate: event.candidate },
                });
            }
        };

        pc.onconnectionstatechange = () => {
            console.log('PC state:', pc.connectionState);
            if (
                pc.connectionState === 'failed' ||
                pc.connectionState === 'disconnected' ||
                pc.connectionState === 'closed'
            ) {
                logStatus(`Peer connection ${pc.connectionState}`);
            }
        };

        // Viewer: receive media stream
        pc.ontrack = (event) => {
            const [stream] = event.streams;
            if (videoRef.current && role === 'viewer') {
                videoRef.current.srcObject = stream;
                videoRef.current.controls = false;
                videoRef.current
                    .play()
                    .catch(() => {
                        // user interaction may be required
                    });
            }
        };

        // Viewer: receive control data channel
        pc.ondatachannel = (event) => {
            if (event.channel.label === 'control') {
                setupControlChannel(event.channel);
            }
        };

        return pc;
    }

    function sendControlRaw(msg: ControlMsg) {
        const ch = controlDcRef.current;
        if (!ch || ch.readyState !== 'open') return;
        ch.send(JSON.stringify(msg));
    }

    function sendControl(msg: PlayPauseSeekMsg) {
        sendControlRaw(msg);
    }

    function setupControlChannel(channel: RTCDataChannel) {
        controlDcRef.current = channel;

        channel.onopen = () => {
            logStatus('Control channel open.');

            // Host sends metadata (duration) once DC is open
            if (role === 'host' && hostDurationRef.current > 0) {
                sendControlRaw({
                    type: 'meta',
                    duration: hostDurationRef.current,
                });
            }
        };

        channel.onclose = () => {
            logStatus('Control channel closed.');
        };

        channel.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data as string) as ControlMsg;
                handleControlMessage(msg);
            } catch (e) {
                console.warn('Invalid control msg', e);
            }
        };
    }

    function handleControlMessage(msg: ControlMsg) {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        // metadata: duration
        if (msg.type === 'meta') {
            const d = msg.duration || 0;
            setRemoteDuration(d);
            return;
        }

        // periodic time sync from host
        if (msg.type === 'time') {
            setRemoteCurrentTime(msg.time);
            return;
        }

        // from here: play/pause/seek
        if (!('from' in msg)) return;

        // ignore viewer→viewer
        if (msg.from === 'viewer' && role === 'viewer') {
            return;
        }

        // viewer requested something, host applies then rebroadcasts
        if (msg.from === 'viewer' && role === 'host') {
            isApplyingRemoteRef.current = true;
            videoEl.currentTime = msg.time;
            if (msg.type === 'play') {
                videoEl.play().catch(() => {});
            } else if (msg.type === 'pause') {
                videoEl.pause();
            } else if (msg.type === 'seek') {
                // just jump
            }
            isApplyingRemoteRef.current = false;

            // broadcast authoritative host action
            sendControl({
                type: msg.type,
                time: msg.time,
                from: 'host',
            });
            return;
        }

        // host → viewer: apply authoritative command
        if (msg.from === 'host' && role === 'viewer') {
            const t = msg.time;
            isApplyingRemoteRef.current = true;
            videoEl.currentTime = t;
            if (msg.type === 'play') {
                videoEl.play().catch(() => {});
            } else if (msg.type === 'pause') {
                videoEl.pause();
            } else if (msg.type === 'seek') {
                // just jump
            }
            isApplyingRemoteRef.current = false;

            setRemoteCurrentTime(t);
            return;
        }
    }

    // Host: prepare video + captureStream
    async function setupHostFileStream(): Promise<MediaStream> {
        if (!hostFile) throw new Error('No file selected.');
        const el = videoRef.current;
        if (!el) throw new Error('Video element not ready.');

        const url = URL.createObjectURL(hostFile);
        el.srcObject = null;
        el.src = url;
        el.controls = true;
        el.muted = true; // avoid echo on host

        await new Promise<void>((resolve, reject) => {
            const onMeta = () => {
                el.removeEventListener('loadedmetadata', onMeta);
                hostDurationRef.current = el.duration || 0;
                resolve();
            };
            const onErr = () => {
                el.removeEventListener('loadedmetadata', onMeta);
                reject(new Error('Failed to load metadata'));
            };
            el.addEventListener('loadedmetadata', onMeta);
            el.addEventListener('error', onErr, { once: true });
        });

        // start playback so captureStream has frames
        await el.play().catch(() => {});

        const anyVid = el as any;
        const stream: MediaStream | null =
            typeof anyVid.captureStream === 'function'
                ? anyVid.captureStream()
                : typeof anyVid.mozCaptureStream === 'function'
                    ? anyVid.mozCaptureStream()
                    : null;

        if (!stream) {
            throw new Error('captureStream is not supported in this browser.');
        }

        return stream;
    }

    async function startHost(e: React.FormEvent) {
        e.preventDefault();
        resetConnection();

        try {
            if (!hostFile) {
                setError('Select a video file first.');
                return;
            }

            const localStream = await setupHostFileStream();
            localStreamRef.current = localStream;

            connectSignaling(() => {
                sendToSignaling({ type: 'host-join', code });
                logStatus('Host joined room. Waiting for viewer…');
            });
        } catch (err: any) {
            console.error(err);
            setError('Failed to start host: ' + (err?.message || String(err)));
        }
    }

    function startViewer(e: React.FormEvent) {
        e.preventDefault();
        resetConnection();

        connectSignaling(() => {
            sendToSignaling({ type: 'viewer-join', code });
            logStatus('Viewer joined room. Waiting for offer…');
        });
    }

    // Host local controls
    function onHostPlay() {
        if (role !== 'host') return;
        if (isApplyingRemoteRef.current) return;
        const v = videoRef.current;
        if (!v) return;
        sendControl({ type: 'play', time: v.currentTime, from: 'host' });
    }

    function onHostPause() {
        if (role !== 'host') return;
        if (isApplyingRemoteRef.current) return;
        const v = videoRef.current;
        if (!v) return;
        sendControl({ type: 'pause', time: v.currentTime, from: 'host' });
    }

    function onHostSeeked() {
        if (role !== 'host') return;
        if (isApplyingRemoteRef.current) return;
        const v = videoRef.current;
        if (!v) return;
        sendControl({ type: 'seek', time: v.currentTime, from: 'host' });
    }

    // Viewer controls: we use the canonical host time, not our element's time
    function viewerPlayPauseToggle() {
        if (role !== 'viewer') return;
        const t = remoteCurrentTime;
        const v = videoRef.current;
        if (!v) return;

        if (v.paused) {
            sendControl({ type: 'play', time: t, from: 'viewer' });
        } else {
            sendControl({ type: 'pause', time: t, from: 'viewer' });
        }
    }

    function viewerSeek(time: number) {
        if (role !== 'viewer') return;
        sendControl({ type: 'seek', time, from: 'viewer' });
    }

    // Fullscreen helper
    function enterFullscreen() {
        const v = videoRef.current;
        if (!v) return;
        if (v.requestFullscreen) {
            v.requestFullscreen();
            // @ts-ignore
        } else if (v.webkitEnterFullscreen) {
            // @ts-ignore (iOS)
            v.webkitEnterFullscreen();
        }
    }

    async function handleSignalingMessage(data: any) {
        if (data.type === 'error') {
            setError(data.message || 'Signaling error');
            return;
        }

        if (data.type === 'host-ack') {
            logStatus(`Host registered for room ${data.code}`);
            return;
        }

        if (data.type === 'viewer-ack') {
            logStatus(`Viewer registered for room ${data.code}`);
            return;
        }

        if (data.type === 'host-left') {
            logStatus('Host left the room.');
            return;
        }

        if (data.type === 'viewer-ready' && role === 'host') {
            logStatus('Viewer ready. Creating offer…');
            const pc = createPeerConnection();

            const localStream = localStreamRef.current;
            if (!localStream) {
                setError('No local stream when viewer-ready fired.');
                return;
            }

            // add tracks
            localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

            // try to bump quality
            pc.getSenders().forEach((sender) => {
                if (!sender.track || sender.track.kind !== 'video') return;
                const params = sender.getParameters();
                if (!params.encodings || params.encodings.length === 0) {
                    (params as any).encodings = [{}];
                }
                params.encodings![0].maxBitrate = 5_000_000; // ~5 Mbps
                params.encodings![0].scaleResolutionDownBy = 1.0;
                sender
                    .setParameters(params)
                    .catch((e) => console.warn('setParameters failed', e));
            });

            // control channel
            const controlDc = pc.createDataChannel('control');
            setupControlChannel(controlDc);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            sendToSignaling({
                type: 'signal',
                code,
                payload: { kind: 'offer', sdp: offer },
            });
            return;
        }

        if (data.type === 'signal') {
            const { payload } = data;
            const kind = payload.kind;

            if (!pcRef.current && role === 'viewer') {
                createPeerConnection();
            }

            const pc = pcRef.current;
            if (!pc) return;

            if (kind === 'offer' && role === 'viewer') {
                logStatus('Received offer. Creating answer…');
                const remoteDesc = new RTCSessionDescription(payload.sdp);
                await pc.setRemoteDescription(remoteDesc);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                sendToSignaling({
                    type: 'signal',
                    code,
                    payload: { kind: 'answer', sdp: answer },
                });
            } else if (kind === 'answer' && role === 'host') {
                logStatus('Received answer.');
                const remoteDesc = new RTCSessionDescription(payload.sdp);
                await pc.setRemoteDescription(remoteDesc);
            } else if (kind === 'ice-candidate') {
                if (payload.candidate) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
                    } catch (e) {
                        console.error('Error adding ICE candidate', e);
                    }
                }
            }
        }
    }

    // Host periodically pushes canonical time to viewer
    useEffect(() => {
        if (role !== 'host') return;

        const id = setInterval(() => {
            const v = videoRef.current;
            const ch = controlDcRef.current;
            if (!v || !ch || ch.readyState !== 'open') return;

            try {
                ch.send(JSON.stringify({ type: 'time', time: v.currentTime }));
            } catch {
                // ignore
            }
        }, 300);

        return () => clearInterval(id);
    }, [role]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-5xl bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        WebRTC P2P File Streaming (Realtime + Synced Control)
                    </h1>
                    <div className="inline-flex rounded-xl bg-slate-800 p-1">
                        <button
                            onClick={() => {
                                setRole('host');
                                resetConnection();
                            }}
                            className={`px-3 py-1 text-sm rounded-lg transition ${
                                role === 'host'
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            Host
                        </button>
                        <button
                            onClick={() => {
                                setRole('viewer');
                                resetConnection();
                            }}
                            className={`px-3 py-1 text-sm rounded-lg transition ${
                                role === 'viewer'
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            Viewer
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                        Room code
                    </label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.trim())}
                        placeholder="e.g. 123456"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        Same code on both sides. Host never uploads the file; it&apos;s
                        played locally and streamed frame-by-frame via WebRTC.
                    </p>
                </div>

                {role === 'host' ? (
                    <form onSubmit={startHost} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Select video file
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setHostFile(f);
                                    setError(null);
                                }}
                                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-900 hover:file:bg-white bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                                For best quality, use MP4 (H.264 + AAC). Quality is limited only
                                by your bandwidth and WebRTC encoder.
                            </p>
                        </div>
                        <p className="text-sm text-slate-300">
                            Host: you control playback with the native video controls. Viewer
                            can also control via synced commands.
                        </p>
                        <button
                            type="submit"
                            disabled={!hostFile}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Start as host
                        </button>
                    </form>
                ) : (
                    <form onSubmit={startViewer} className="space-y-4">
                        <p className="text-sm text-slate-300">
                            Viewer: connect with the same code. Once the host starts, you&apos;ll
                            see the video here, with synced play/pause/seek.
                        </p>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
                        >
                            Connect as viewer
                        </button>
                    </form>
                )}

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold text-slate-200">
                            Video ({role === 'host' ? 'host playback' : 'remote stream'})
                        </h2>
                        <button
                            type="button"
                            onClick={enterFullscreen}
                            className="text-xs px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                        >
                            Fullscreen
                        </button>
                    </div>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-contain"
                            controls={role === 'host'}
                            muted={role === 'host'}
                            onPlay={onHostPlay}
                            onPause={onHostPause}
                            onSeeked={onHostSeeked}
                            playsInline
                        />
                    </div>
                </div>

                {role === 'viewer' && (
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>
                                Time: {formatTime(remoteCurrentTime)} /{' '}
                                {formatTime(remoteDuration)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={remoteDuration || 0}
                            step={0.1}
                            value={remoteCurrentTime}
                            onChange={(e) => {
                                const t = Number(e.target.value);
                                setRemoteCurrentTime(t); // optimistic UI
                                viewerSeek(t);           // ask host to seek
                            }}
                            disabled={!remoteDuration}
                            className="w-full accent-emerald-500"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                onClick={viewerPlayPauseToggle}
                                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
                            >
                                Play / Pause
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-xs text-slate-400 flex flex-col gap-1">
                    <div>
                        <span className="font-semibold text-slate-200">Status:</span>{' '}
                        {status}
                    </div>
                    {error && (
                        <div className="text-red-400">
                            <span className="font-semibold text-red-300">Error:</span>{' '}
                            {error}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={resetConnection}
                        className="mt-2 inline-flex w-max items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                    >
                        Reset connection
                    </button>
                </div>
            </div>
        </div>
    );
}
