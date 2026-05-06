import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { FiVideo, FiClock, FiPlus, FiLogOut, FiHash } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (!meetingCode) return;
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    const generateRandomCode = () => {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        setMeetingCode(code);
    }

    return (
        <div className="homePageContainer" style={{ padding: '0', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505' }}>
            <nav style={{ padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mixBlendMode: 'difference' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: '900', 
                        letterSpacing: '-1.5px',
                        background: 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>APNA CALL</h2>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button className="btn-cinematic" onClick={() => navigate("/history")} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                        HISTORY
                    </button>
                    <button className="btn-cinematic" onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }}>
                        LOGOUT
                    </button>
                </div>
            </nav>

            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 60px' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '80px' }}>
                    <div style={{ flex: 1 }}>
                        <h1 className="hero-heading tracking-tighter" style={{ marginBottom: '40px' }}>SYSTEM <br/><span style={{ color: 'var(--text-secondary)' }}>CONTROL</span></h1>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '500px' }}>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    className="input-field" 
                                    style={{ 
                                        background: '#111', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        fontSize: '1.2rem',
                                        padding: '24px',
                                        borderRadius: '4px',
                                        color: 'white'
                                    }}
                                    placeholder="ENTER ACCESS CODE" 
                                    value={meetingCode}
                                    onChange={e => setMeetingCode(e.target.value)} 
                                />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <button className="btn-cinematic" style={{ flex: 1, padding: '24px' }} onClick={handleJoinVideoCall}>
                                    INITIALIZE CALL
                                </button>
                                <button className="btn-cinematic" style={{ flex: 0.5, padding: '24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={generateRandomCode}>
                                    GENERATE
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, position: 'relative' }}>
                         <div className="glass-morphism" style={{ padding: '0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?auto=format&fit=crop&q=80&w=1000" 
                                alt="Meeting" 
                                style={{ width: '100%', display: 'block' }}
                            />
                        </div>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', padding: '20px', background: 'var(--accent-gradient)', fontWeight: '900', fontSize: '0.8rem' }}>
                            READY TO SYNC
                        </div>
                    </div>
                </div>
            </div>

            <footer style={{ padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>APNA CALL SYSTEM / STABLE_v1.0</p>
                <div style={{ display: 'flex', gap: '30px', fontSize: '0.8rem', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>SUPPORT</span>
                    <span style={{ color: 'var(--text-secondary)' }}>DOCUMENTATION</span>
                </div>
            </footer>
        </div>
    )
}

export default withAuth(HomeComponent)