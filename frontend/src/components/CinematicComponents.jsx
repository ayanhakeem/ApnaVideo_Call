import React, { useState } from 'react';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const CinematicNav = () => {
    const navigate = useNavigate();
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [meetingCode, setMeetingCode] = useState("");

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleJoin = () => {
        if (meetingCode.trim()) {
            navigate(`/${meetingCode}`);
        }
    };

    return (
        <nav className="nav-cinematic">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '900', 
                    letterSpacing: '-1.5px',
                    background: 'var(--accent-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0 
                }}>APNA CALL</h2>
            </div>

            <div style={{ display: 'flex', gap: '40px', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.2em' }}>
                <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => scrollToSection('meetings')}>Meetings</span>
                <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => scrollToSection('ecosystem')}>Ecosystem</span>
                <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => scrollToSection('pricing')}>Pricing</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {showJoinInput ? (
                    <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 10px' }}>
                        <input 
                            autoFocus
                            placeholder="SESSION ID" 
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                            style={{ background: 'transparent', border: 'none', color: 'white', padding: '10px', outline: 'none', fontSize: '0.8rem', width: '120px' }}
                        />
                        <FiSearch style={{ cursor: 'pointer', color: '#06B6D4' }} onClick={handleJoin} />
                        <span style={{ marginLeft: '10px', cursor: 'pointer', opacity: 0.5 }} onClick={() => setShowJoinInput(false)}>✕</span>
                    </div>
                ) : (
                    <span style={{ cursor: 'pointer', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', borderBottom: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setShowJoinInput(true)}>JOIN SESSION</span>
                )}
                
                <button className="btn-cinematic" onClick={() => navigate('/auth')}>
                    ACCESS <FiArrowRight />
                </button>
            </div>
        </nav>
    );
};

export const HeroRolodex = () => {
    return (
        <div className="perspective-container" style={{ 
            height: '100vh', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ 
                position: 'absolute', 
                fontSize: '25vw', 
                fontWeight: '900', 
                color: 'rgba(255,255,255,0.03)', 
                whiteSpace: 'nowrap',
                zIndex: 0,
                pointerEvents: 'none',
                letterSpacing: '-0.05em'
            }}>
                APNA CALL
            </div>
            
            <div className="cube-wrapper">
                <div className="cube-face face-front">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000" alt="Face 1" />
                    <h2 className="tracking-wide">CONNECT</h2>
                </div>
                <div className="cube-face face-bottom">
                    <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1000" alt="Face 2" />
                    <h2 className="tracking-wide">COLLABORATE</h2>
                </div>
                <div className="cube-face face-back">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000" alt="Face 3" />
                    <h2 className="tracking-wide">CREATE</h2>
                </div>
                <div className="cube-face face-top">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000" alt="Face 4" />
                    <h2 className="tracking-wide">COMMUNICATE</h2>
                </div>
            </div>
        </div>
    );
};

export const CaseStudiesGrid = () => {
    return (
        <section style={{ padding: '100px 4rem', maxWidth: '100rem', margin: '0 auto' }}>
            <h1 className="section-header tracking-tighter" style={{ marginBottom: '60px' }}>CASE STUDIES</h1>
            
            <div className="glass-morphism" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '40px' }}>
                <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                </div>
                <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <img className="grayscale-img" src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000" alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}>
                        <h2 style={{ fontSize: '3rem' }}>Enterprise Suite</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>01 / VIDEO ARCHITECTURE</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {[
                    { title: "Mobile Core", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000", id: "02" },
                    { title: "Global Sync", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000", id: "03" }
                ].map((item, i) => (
                    <div key={i} className="glass-morphism" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ aspectRatio: '4/3' }}>
                            <img className="grayscale-img" src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{item.id} / SUB-SYSTEM</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const PricingSection = () => {
    const [price, setPrice] = useState(125);
    const [selectedPlan, setSelectedPlan] = useState('GROWTH');

    const plans = [
        { name: 'BASIC', price: 'FREE', features: ['Up to 10 participants', '40 min duration', 'Standard security'], height: '450px' },
        { name: 'GROWTH', price: '$29', features: ['Unlimited participants', 'HD Quality', 'Recording & AI Summary', '24/7 Support'], height: '550px', highlight: true },
        { name: 'ULTIMATE', price: 'CUSTOM', features: ['Dedicated server', 'SDK Access', 'Custom Branding'], height: '450px' }
    ];

    return (
        <section style={{ 
            padding: '120px 4rem', 
            background: '#0B0216', 
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'var(--purple-glow)',
                filter: 'blur(150px)',
                opacity: 0.15,
                zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '90rem', margin: '0 auto' }}>
                <h1 className="section-header tracking-tighter" style={{ textAlign: 'center', marginBottom: '80px' }}>PRICING</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '100px' }}>
                    {plans.map((plan, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={plan.highlight ? "" : "glass-morphism"} 
                            style={{ 
                                flex: plan.highlight ? 1.1 : 1, 
                                padding: plan.highlight ? '60px 40px' : '40px', 
                                borderRadius: plan.highlight ? '16px' : '12px', 
                                height: plan.height,
                                background: plan.highlight ? 'white' : 'rgba(255,255,255,0.05)',
                                color: plan.highlight ? '#111111' : 'white',
                                transform: plan.highlight ? (selectedPlan === plan.name ? 'scale(1.08)' : 'scale(1.05)') : (selectedPlan === plan.name ? 'scale(1.03)' : 'scale(1)'),
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: selectedPlan === plan.name ? '0 30px 60px rgba(0,0,0,0.8)' : 'none',
                                cursor: 'pointer',
                                border: selectedPlan === plan.name ? '2px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <h3 style={{ fontSize: plan.highlight ? '1.4rem' : '1.2rem', marginBottom: '10px' }}>{plan.name}</h3>
                            <h2 style={{ fontSize: plan.highlight ? '4rem' : '3rem', marginBottom: '30px' }}>
                                {plan.price}{plan.highlight && <span style={{ fontSize: '1rem' }}>/MO</span>}
                            </h2>
                            <ul style={{ listStyle: 'none', color: plan.highlight ? '#444' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                                {plan.features.map((f, i) => <li key={i}>✓ {f}</li>)}
                            </ul>
                            <button className="btn-cinematic" style={{ width: '100%', justifyContent: 'center', padding: '16px', background: selectedPlan === plan.name ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.1)', color: selectedPlan === plan.name ? 'white' : (plan.highlight ? '#111' : 'white') }}>
                                {selectedPlan === plan.name ? 'SELECTED' : 'CHOOSE'}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ 
                    background: '#1A0B2E', 
                    padding: '60px', 
                    borderRadius: '32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '60px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Estimate for Enterprise</h3>
                        <input 
                            type="range" 
                            className="cinematic-slider" 
                            min="1" 
                            max="500" 
                            value={price / 125} 
                            onChange={(e) => setPrice(e.target.value * 125)} 
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <span>1 USER</span>
                            <span>500 USERS</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ESTIMATED COST</p>
                        <h2 style={{ fontSize: '4rem', margin: 0, fontWeight: '900' }}>${price.toLocaleString()}</h2>
                    </div>
                </div>
            </div>
        </section>
    );
};
