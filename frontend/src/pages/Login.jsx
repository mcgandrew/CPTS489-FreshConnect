import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError('');
        
        // Basic validation
        if (!email || !password) {
            setError('All fields must be filled');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        console.log('Form submitted:', { email, password, isLogin });
        // Here you would typically connect to your backend
        // For now, just log the attempt
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="form-header">
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    <p>Welcome to Fresh Connect!</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}
                    
                    <button className="login-btn">
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                
                <div className="form-footer">
                    {isLogin ? (
                        <>
                            <p>Don't have an account?</p>
                            <button 
                                className="toggle-form" 
                                onClick={() => setIsLogin(false)}
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            <p>Already have an account?</p>
                            <button 
                                className="toggle-form" 
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;