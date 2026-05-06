import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0 for Login, 1 for Register
    const [open, setOpen] = React.useState(false)

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password)
            } else {
                let result = await handleRegister(name, username, password);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {
            console.log(err);
            let message = (err.response?.data?.message) || "Something went wrong";
            setError(message);
        }
    }

    return (
        <div className="authPageContainer" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#050505' }}>
            <div style={{ width: '100%', maxWidth: '500px', position: 'relative' }} className="animate-fade-in">
                
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '5rem', fontWeight: '900', letterSpacing: '-3px', marginBottom: '10px' }}>{formState === 0 ? "SIGN IN" : "SIGN UP"}</h1>
                    <p style={{ color: 'var(--text-secondary)', letterSpacing: '2px', fontWeight: '500' }}>CINEMATIC PROTOCOL / ACCESS</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formState === 1 && (
                        <input 
                            className="input-field" 
                            style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '20px',
                                borderRadius: '4px'
                            }}
                            placeholder="FULL NAME" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    )}

                    <input 
                        className="input-field" 
                        style={{ 
                            background: '#111111', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '20px',
                            borderRadius: '4px',
                            color: 'white'
                        }}
                        placeholder="USERNAME" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />

                    <input 
                        className="input-field" 
                        style={{ 
                            background: '#111111', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '20px',
                            borderRadius: '4px',
                            color: 'white'
                        }}
                        type="password" 
                        placeholder="PASSWORD" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

                    <button 
                        className="btn-cinematic" 
                        style={{ width: '100%', padding: '24px', marginTop: '20px', fontSize: '1.2rem', justifyContent: 'center', borderRadius: '4px' }}
                        onClick={handleAuth}
                    >
                        {formState === 0 ? "INITIALIZE" : "CREATE ACCOUNT"}
                    </button>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' }}>
                    {formState === 0 ? "NEW TO THE ECOSYSTEM?" : "ALREADY ENROLLED?"} 
                    <span 
                        onClick={() => setFormState(formState === 0 ? 1 : 0)} 
                        style={{ color: 'white', marginLeft: '12px', cursor: 'pointer', borderBottom: '1px solid white' }}
                    >
                        {formState === 0 ? "REGISTER" : "LOGIN"}
                    </span>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </div>
    );
}