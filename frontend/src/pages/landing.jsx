import React from 'react'
import { CinematicNav, HeroRolodex, CaseStudiesGrid, PricingSection } from '../components/CinematicComponents';

export default function LandingPage() {
    return (
        <div className='landingPageContainer' style={{ background: '#050505' }}>
            <div className="animate-fade-in">
                <CinematicNav />
                
                <HeroRolodex />

                <section id="ecosystem" style={{ padding: '120px 4rem', textAlign: 'center' }}>
                    <h1 className="hero-heading tracking-tighter">FUTURE <br/> ECOSYSTEM</h1>
                    <p style={{ fontSize: '1.125rem', fontWeight: 300, color: 'var(--text-secondary)', maxWidth: '600px', margin: '40px auto' }}>
                        A high-performance WebGL architecture built for the next generation of digital spatial communication.
                    </p>
                </section>

                <div id="meetings">
                    <CaseStudiesGrid />
                </div>

                <div id="pricing">
                    <PricingSection />
                </div>

                <footer style={{ 
                    padding: '120px 0 60px 0', 
                    borderTop: '1px solid rgba(255,255,255,0.05)', 
                    background: '#050505',
                    marginTop: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {/* Massive Text ABOVE */}
                    <div style={{ width: '100%', overflow: 'hidden', textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ 
                            fontSize: '22vw', 
                            fontWeight: '900', 
                            letterSpacing: '-0.05em', 
                            margin: '0', 
                            opacity: 0.05, 
                            lineHeight: '0.8',
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                        }}>
                            APNA CALL
                        </h1>
                    </div>

                    {/* Footer Links AT BOTTOM */}
                    <div style={{ 
                        width: '100%',
                        maxWidth: '90rem',
                        padding: '0 4rem',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-1px', margin: 0 }}>APNA CALL</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>© 2026 APNA CALL PROTOCOL</p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '40px', fontWeight: '700', fontSize: '0.7rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                            <span style={{ cursor: 'pointer' }}>TWITTER</span>
                            <span style={{ cursor: 'pointer' }}>INSTAGRAM</span>
                            <span style={{ cursor: 'pointer' }}>DRIBBBLE</span>
                            <span style={{ cursor: 'pointer' }}>PRIVACY</span>
                            <span style={{ color: 'white', cursor: 'pointer' }}>TERMS</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
