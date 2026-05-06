import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge } from '@mui/material';
import styles from "../styles/videoComponent.module.css";
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiPhoneOff, FiMonitor, FiMessageSquare, FiSend, FiX, FiRefreshCw, FiAlertCircle, FiUser } from 'react-icons/fi';
import server from '../environment';

const server_url = server;
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    const connections = useRef({});

    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);

    let [showModal, setModal] = useState(false);
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [videos, setVideos] = useState([])

    const [localStream, setLocalStream] = useState(null);
    const [mediaError, setMediaError] = useState(null);
    const localStreamRef = useRef(null);
    const [screen, setScreen] = useState(false);
    const screenStreamRef = useRef(null);

    const lobbyVideoRef = useRef(null);
    const meetingVideoRef = useRef(null);
    
    // 1. Resilient Media Initialization
    const getMedia = async () => {
        setMediaError(null);
        console.log("CRITICAL: Requesting media...");
        
        try {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
            }

            // Attempt Dual (Video + Audio)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            setLocalStream(stream);
            setVideoAvailable(true);
            setAudioAvailable(true);
            console.log("DUAL STREAM ACQUIRED");

            // Update existing connections if any
            Object.keys(connections.current).forEach(id => {
                const pc = connections.current[id];
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
            });

        } catch (err) {
            console.warn("DUAL MEDIA FAILED:", err.name);
            
            // Fallback: Try Audio Only
            try {
                const aStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                localStreamRef.current = aStream;
                setLocalStream(aStream);
                setAudioAvailable(true);
                setVideoAvailable(false);
                setVideo(false);
                setMediaError("CAMERA_UNAVAILABLE_AUDIO_ONLY");
                console.log("AUDIO-ONLY STREAM ACQUIRED");
            } catch (aErr) {
                console.error("TOTAL MEDIA FAILURE:", aErr);
                setAudioAvailable(false);
                setVideoAvailable(false);
                setMediaError("NO_DEVICES_FOUND");
            }
        }
    };

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMediaError("BROWSER_UNSUPPORTED");
            return;
        }
        getMedia();
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // 2. Sync Loop
    useEffect(() => {
        const interval = setInterval(() => {
            if (localStream && videoAvailable) {
                if (askForUsername && lobbyVideoRef.current && lobbyVideoRef.current.srcObject !== localStream) {
                    lobbyVideoRef.current.srcObject = localStream;
                }
                if (!askForUsername && meetingVideoRef.current && meetingVideoRef.current.srcObject !== localStream) {
                    meetingVideoRef.current.srcObject = localStream;
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, [localStream, askForUsername, videoAvailable]);

    // 3. Track Control
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(t => t.enabled = video);
        }
    }, [video]);

    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => t.enabled = audio);
        }
    }, [audio]);

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { transports: ['websocket'] });
        
        socketRef.current.on('signal', gotMessageFromServer);
        
        socketRef.current.on('connect', () => {
            console.log("CONNECTED TO SERVER");
            socketRef.current.emit('join-call', window.location.pathname);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', (data, sender, id) => {
                setMessages(prev => [...prev, { sender, data }]);
                if (id !== socketIdRef.current) setNewMessages(prev => prev + 1);
            });

            socketRef.current.on('user-left', (id) => {
                console.log("USER LEFT:", id);
                if (connections.current[id]) {
                    connections.current[id].close();
                    delete connections.current[id];
                }
                setVideos(prev => prev.filter(v => v.socketId !== id));
            });

            socketRef.current.on('user-joined', (id, clients) => {
                console.log("USER JOINED:", id, "TOTAL CLIENTS:", clients);
                
                clients.forEach((socketListId) => {
                    if (socketListId === socketIdRef.current) return; // Skip self

                    if (!connections.current[socketListId]) {
                        console.log("CREATING NEW CONNECTION FOR:", socketListId);
                        const pc = new RTCPeerConnection(peerConfigConnections);
                        connections.current[socketListId] = pc;

                        pc.onicecandidate = (e) => {
                            if (e.candidate) {
                                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': e.candidate }));
                            }
                        };

                        pc.ontrack = (e) => {
                            console.log("RECEIVED REMOTE TRACK FROM:", socketListId);
                            setVideos(prev => {
                                const exists = prev.find(v => v.socketId === socketListId);
                                if (exists) return prev.map(v => v.socketId === socketListId ? { ...v, stream: e.streams[0] } : v);
                                return [...prev, { socketId: socketListId, stream: e.streams[0] }];
                            });
                        };

                        if (localStreamRef.current) {
                            localStreamRef.current.getTracks().forEach(track => {
                                pc.addTrack(track, localStreamRef.current);
                            });
                        }
                    }
                });

                // If I am the one who just joined, create offers to everyone else
                if (id === socketIdRef.current) {
                    clients.forEach(id2 => {
                        if (id2 === socketIdRef.current) return;
                        console.log("CREATING OFFER FOR:", id2);
                        connections.current[id2].createOffer().then((desc) => {
                            connections.current[id2].setLocalDescription(desc).then(() => {
                                socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections.current[id2].localDescription }));
                            });
                        });
                    });
                }
            });
        });
    };

    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);
        if (fromId === socketIdRef.current) return;

        if (!connections.current[fromId]) {
            console.warn("RECEIVED SIGNAL FOR UNKNOWN CONNECTION:", fromId);
            return;
        }

        if (signal.sdp) {
            connections.current[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                if (signal.sdp.type === 'offer') {
                    connections.current[fromId].createAnswer().then((desc) => {
                        connections.current[fromId].setLocalDescription(desc).then(() => {
                            socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections.current[fromId].localDescription }));
                        });
                    });
                }
            });
        }
        if (signal.ice) {
            connections.current[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(e => console.log("ICE Error:", e));
        }
    };

    const handleEndCall = () => {
        if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
        if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
        if (socketRef.current) socketRef.current.disconnect();
        window.location.href = "/home";
    };

    const handleScreenShare = async () => {
        try {
            if (!screen) {
                // START SCREEN SHARE
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = stream;
                const screenTrack = stream.getVideoTracks()[0];

                // If user stops sharing via browser bar
                screenTrack.onended = () => {
                    stopScreenShare();
                };

                // Replace track for all peers
                Object.keys(connections.current).forEach(id => {
                    const pc = connections.current[id];
                    const senders = pc.getSenders();
                    const videoSender = senders.find(s => s.track && s.track.kind === 'video');
                    if (videoSender) {
                        videoSender.replaceTrack(screenTrack);
                    }
                });

                // Update local preview
                if (meetingVideoRef.current) {
                    meetingVideoRef.current.srcObject = stream;
                }

                setScreen(true);
            } else {
                stopScreenShare();
            }
        } catch (e) {
            console.error("Screen share error:", e);
        }
    };

    const stopScreenShare = () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
        }

        // Revert to camera track for all peers
        const cameraTrack = localStreamRef.current.getVideoTracks()[0];
        Object.keys(connections.current).forEach(id => {
            const pc = connections.current[id];
            const senders = pc.getSenders();
            const videoSender = senders.find(s => s.track && s.track.kind === 'video');
            if (videoSender && cameraTrack) {
                videoSender.replaceTrack(cameraTrack);
            }
        });

        // Update local preview back to camera
        if (meetingVideoRef.current) {
            meetingVideoRef.current.srcObject = localStreamRef.current;
        }

        setScreen(false);
    };

    const joinRoom = () => {
        if (!username) {
            alert("Please enter a NODE NAME to initialize sync.");
            return;
        }
        setAskForUsername(false);
        connectToSocketServer();
    };

    return (
        <div className="animate-fade-in" style={{ height: '100vh', width: '100vw', background: '#050505', color: 'white', position: 'relative', overflow: 'hidden' }}>
            {askForUsername ? (
                <div className={styles.lobbyContainer}>
                    <div className={`${styles.lobbyCard} glass-panel animate-fade-in`}>
                        <div className={styles.lobbyPreview}>
                            {videoAvailable ? (
                                <video ref={lobbyVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', padding: '20px', textAlign: 'center' }}>
                                    <FiVideoOff size={60} style={{ opacity: 0.2, marginBottom: '20px' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1px' }}>CAMERA IN USE OR NOT FOUND</p>
                                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '10px' }}>
                                        Check if another tab or app is using your camera.
                                    </p>
                                </div>
                            )}
                            
                            {!localStream && !mediaError && (
                                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                                    <FiRefreshCw className="animate-spin" size={40} style={{ marginBottom: '20px', opacity: 0.5 }} />
                                    <div style={{ fontWeight: '900', letterSpacing: '2px', opacity: 0.5 }}>SYNCING SYSTEM...</div>
                                </div>
                            )}

                            {mediaError && mediaError !== "CAMERA_UNAVAILABLE_AUDIO_ONLY" && (
                                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', padding: '40px', textAlign: 'center' }}>
                                    <FiAlertCircle size={48} style={{ color: '#ff4d4d', marginBottom: '20px' }} />
                                    <h3 style={{ fontWeight: '900' }}>{mediaError.replace(/_/g, ' ')}</h3>
                                    <button className="btn-cinematic" style={{ marginTop: '30px', padding: '12px 24px' }} onClick={getMedia}>RETRY SYNC</button>
                                </div>
                            )}

                            <div className={styles.videoLabel}>PROTOCOL_v1.0</div>
                        </div>
                        <div className={styles.lobbyControls}>
                            <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-3px' }}>{videoAvailable ? "SYNC" : "AUDIO"}</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>{videoAvailable ? "VISUALS ONLINE" : "HARDWARE LIMITATION DETECTED"}</p>
                            
                            <input 
                                className="input-field" 
                                style={{ background: '#111', color: 'white', padding: '24px', fontSize: '1.1rem' }}
                                placeholder="NODE NAME" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                            />

                            <button className="btn-cinematic" style={{ width: '100%', justifyContent: 'center', padding: '24px' }} onClick={joinRoom}>
                                INITIALIZE NODE
                            </button>

                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                                {videoAvailable && (
                                    <button onClick={() => setVideo(!video)} className={`${styles.controlButton} ${video ? styles.active : ''}`}>
                                        {video ? <FiVideo size={24} /> : <FiVideoOff size={24} />}
                                    </button>
                                )}
                                <button onClick={() => setAudio(!audio)} className={`${styles.controlButton} ${audio ? styles.active : ''}`}>
                                    {audio ? <FiMic size={24} /> : <FiMicOff size={24} />}
                                </button>
                                <button onClick={getMedia} className={styles.controlButton}>
                                    <FiRefreshCw size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.meetVideoContainer}>
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatHeader}>
                                <h3 style={{ fontWeight: '900', letterSpacing: '1px' }}>TRANSMISSIONS</h3>
                                <button className={styles.controlButton} style={{ width: '32px', height: '32px' }} onClick={() => setModal(false)}>
                                    <FiX size={18} />
                                </button>
                            </div>
                            <div className={styles.chatMessages}>
                                {messages.map((item, index) => (
                                    <div key={index} className={`${styles.message} ${item.sender === username ? styles.own : ''}`}>
                                        <p style={{ fontSize: '0.65rem', color: '#06B6D4', marginBottom: '4px', fontWeight: '900' }}>{item.sender.toUpperCase()}</p>
                                        <p style={{ fontSize: '1rem', lineHeight: '1.4' }}>{item.data}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.chatInputContainer}>
                                <input 
                                    className="input-field" 
                                    style={{ background: '#000', color: 'white' }}
                                    placeholder="SIGNAL..." 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (socketRef.current.emit('chat-message', message, username), setMessage(""))}
                                />
                                <button className="btn-cinematic" style={{ padding: '12px' }} onClick={() => (socketRef.current.emit('chat-message', message, username), setMessage(""))}>
                                    <FiSend size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.conferenceView}>
                        <div className={styles.videoWrapper}>
                            {videoAvailable ? (
                                <video ref={meetingVideoRef} autoPlay muted playsInline></video>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                                    <FiUser size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.2)', fontWeight: '900', letterSpacing: '2px' }}>{username.toUpperCase() || "YOU"}</p>
                                </div>
                            )}
                            <div className={styles.videoLabel}>LOCAL NODE (YOU)</div>
                        </div>

                        {videos.map((v) => (
                            <div key={v.socketId} className={styles.videoWrapper}>
                                <video
                                    ref={ref => { if (ref && v.stream) ref.srcObject = v.stream; }}
                                    autoPlay
                                    playsInline
                                ></video>
                                <div className={styles.videoLabel}>REMOTE NODE</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.buttonContainers}>
                        {videoAvailable && (
                            <button onClick={() => setVideo(!video)} className={`${styles.controlButton} ${video ? styles.active : ''}`}>
                                {video ? <FiVideo size={22} /> : <FiVideoOff size={22} />}
                            </button>
                        )}
                        <button onClick={() => setAudio(!audio)} className={`${styles.controlButton} ${audio ? styles.active : ''}`}>
                            {audio ? <FiMic size={22} /> : <FiMicOff size={22} />}
                        </button>
                        <button onClick={handleScreenShare} className={`${styles.controlButton} ${screen ? styles.active : ''}`}>
                            <FiMonitor size={22} />
                        </button>
                        <button onClick={() => setModal(!showModal)} className={styles.controlButton}>
                            <Badge badgeContent={newMessages} color="error" overlap="circular">
                                <FiMessageSquare size={22} />
                            </Badge>
                        </button>
                        <button onClick={handleEndCall} className={`${styles.controlButton} ${styles.danger}`}>
                            <FiPhoneOff size={22} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
