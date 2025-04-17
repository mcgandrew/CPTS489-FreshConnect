import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext.jsx';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const { setRoleAndToken } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError('');
        
        // Basic validation
        if (!username || !password) {
            setError('All fields must be filled');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // login
        if (isLogin) {
            try {
                // login with api
                const response = await axios.post('http://localhost:4000/users/login', {
                    username,
                    password
                });
                
                // update token and redirect to home
                if (response.status === 200) {
                    const { token } = response.data;
                    if (token) setRoleAndToken(token); // use context
                    navigate('/home');
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to login');
            }
        }
        // register
        else {
            try {
                // register with api
                const response = await axios.post('http://localhost:4000/users/register', {
                    username,
                    password
                });

                // redirect to login
                if (response.status === 200) {
                    setConfirmPassword('');
                    setIsLogin(true);
                    navigate('/login');
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to register');
            }
        }
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
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            placeholder="Enter your username"
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