import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiHash, FiArrowLeft, FiClock, FiVideo } from 'react-icons/fi';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                console.log(err);
            }
        }
        fetchHistory();
    }, [getHistoryOfUser])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div className="historyPageContainer" style={{ padding: '60px', minHeight: '100vh', background: '#050505', color: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px' }} className="animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <button className="control-button" onClick={() => navigate("/home")} style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white'
                        }}>
                            <FiArrowLeft size={24} />
                        </button>
                        <h1 className="hero-heading tracking-tighter" style={{ fontSize: '4rem', margin: 0 }}>HISTORY</h1>
                    </div>
                    <button className="btn-cinematic" onClick={() => navigate("/home")}>
                        <FiHome /> DASHBOARD
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }} className="animate-fade-in">
                    {meetings.length !== 0 ? [...meetings].reverse().map((e, i) => (
                        <div key={i} className="glass-morphism" style={{ padding: '32px', borderRadius: '16px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '20px' }}>
                                <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '12px', flexShrink: 0 }}>
                                    <FiVideo color="white" size={24} />
                                </div>
                                <div style={{ textAlign: 'right', minWidth: 0, flex: 1 }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '4px' }}>CODE</p>
                                    <h3 style={{ 
                                        fontSize: '1.25rem', 
                                        margin: 0, 
                                        color: '#06B6D4', 
                                        wordBreak: 'break-all',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {e.meetingCode.split('/').pop()}
                                    </h3>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                                    <FiCalendar size={18} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{formatDate(e.date)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                                    <FiClock size={18} />
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Duration: Session Data Recorded</span>
                                </div>
                            </div>

                            <button 
                                className="btn-cinematic" 
                                style={{ width: '100%', justifyContent: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                onClick={() => navigate(`/${e.meetingCode}`)}
                            >
                                RE-INITIALIZE SYNC
                            </button>
                        </div>
                    )) : (
                        <div className="glass-morphism" style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center', borderRadius: '24px' }}>
                            <FiClock size={60} style={{ opacity: 0.1, marginBottom: '30px' }} />
                            <h2 style={{ opacity: 0.5, letterSpacing: '4px' }}>NO DATA LOGGED</h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '20px', maxWidth: '400px', margin: '20px auto' }}>Your past neural transmissions will appear here once you initialize your first session.</p>
                            <button className="btn-cinematic" style={{ marginTop: '40px' }} onClick={() => navigate("/home")}>INITIALIZE FIRST NODE</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
