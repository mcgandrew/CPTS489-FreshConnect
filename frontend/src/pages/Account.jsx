import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add this import
import '../Account.css';

const Account = () => {
    const { role, logout } = useContext(UserContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false); // Add this state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    // Fetch username directly from localStorage
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Simple parsing 
                // You may need to adjust this based on your actual token format
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const payload = JSON.parse(jsonPayload);
                setUsername(payload.username || 'User'); // Use a fallback
            } else {
                // If no token is found, use a generic username
                setUsername('User');
            }
        } catch (error) {
            console.error("Error extracting username from token:", error);
            // Set a fallback username to prevent infinite loading
            setUsername('User');
        }
    }, []);

    // Check if user is logged in when component mounts
    useEffect(() => {
        if (!role) {
            navigate('/login');
        }
    }, [role, navigate]);
    
    // Mock user info - in a real app, this would come from the backend
    const userInfo = {
        joinDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        lastLogin: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };
    
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (passwordData.newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Call API to change password
            await axios.patch(
                'http://localhost:4000/users/password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            showNotification('Password changed successfully', 'success');
            
            // Reset the form
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            showNotification(
                error.response?.data?.error || 'Failed to change password',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== username) {
            showNotification('Please type your username correctly to confirm deletion', 'error');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Call API to delete account
            await axios.delete(
                'http://localhost:4000/users/account',
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            showNotification('Your account has been deleted', 'success');
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            showNotification(
                error.response?.data?.error || 'Failed to delete account',
                'error'
            );
            setIsLoading(false);
        }
    };
    
    // Redirect if not logged in
    if (!role) {
        navigate('/login');
        return null;
    }
    
    // Add a loading state if username is not yet available
    if (!username) {
        return (
            <div className="account-container">
                <div className="loading">Loading account information...</div>
            </div>
        );
    }
    
    return (
        <div className="account-container">
            <div className="account-header">
                <h1>My Account</h1>
                <p>Manage your account settings and preferences</p>
            </div>
            
            <div className="account-content">
                <div className="account-sidebar">
                    <div className="account-profile">
                        <div className="account-profile-info">
                            <h3>{username}</h3>
                            <span className="account-role-badge">
                                {role === 'admin' ? 'Administrator' : 'Customer'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="account-navigation">
                        <button 
                            className={`account-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span className="account-nav-icon">📊</span>
                            Account Overview
                        </button>
                        <button 
                            className={`account-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <span className="account-nav-icon">🔒</span>
                            Security
                        </button>
                        <button 
                            className={`account-nav-item ${activeTab === 'delete' ? 'active' : ''}`}
                            onClick={() => setActiveTab('delete')}
                        >
                            <span className="account-nav-icon">⚠️</span>
                            Delete Account
                        </button>
                    </div>
                </div>
                
                <div className="account-main">
                    {activeTab === 'overview' && (
                        <div className="account-overview">
                            <div className="account-section">
                                <h2>Account Details</h2>
                                
                                <div className="account-info-list">
                                    <div className="account-info-item">
                                        <span className="account-info-label">Username</span>
                                        <span className="account-info-value">{username}</span>
                                    </div>
                                    <div className="account-info-item">
                                        <span className="account-info-label">Account Type</span>
                                        <span className="account-info-value">
                                            {role === 'admin' ? 'Administrator' : 'Customer'}
                                        </span>
                                    </div>
                                    <div className="account-info-item">
                                        <span className="account-info-label">Member Since</span>
                                        <span className="account-info-value">{userInfo.joinDate}</span>
                                    </div>
                                    <div className="account-info-item">
                                        <span className="account-info-label">Last Login</span>
                                        <span className="account-info-value">{userInfo.lastLogin}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="account-summary">
                                <div className="account-summary-box">
                                    <h3>Fresh Connect</h3>
                                    <p>Thank you for being part of our sustainable food community!</p>
                                    <button 
                                        className="account-view-orders"
                                        onClick={() => navigate('/orders')}
                                    >
                                        View Your Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'security' && (
                        <div className="account-security">
                            <div className="account-section">
                                <h2>Change Password</h2>
                                <p className="account-section-desc">
                                    Update your password to keep your account secure
                                </p>
                                
                                <form className="account-password-form" onSubmit={handlePasswordSubmit}>
                                    <div className="account-form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <input 
                                            type="password" 
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="account-form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input 
                                            type="password" 
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength="8"
                                            disabled={isLoading}
                                        />
                                        <p className="account-form-hint">
                                            Password must be at least 8 characters long
                                        </p>
                                    </div>
                                    
                                    <div className="account-form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="account-btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                            
                            <div className="account-section">
                                <h2>Account Security Tips</h2>
                                <ul className="account-security-tips">
                                    <li>Use a strong, unique password for your Fresh Connect account</li>
                                    <li>Never share your password with others</li>
                                    <li>Change your password regularly</li>
                                    <li>Log out when using shared computers</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'delete' && (
                        <div className="account-delete">
                            <div className="account-section account-delete-section">
                                <h2>Delete Account</h2>
                                <div className="account-delete-warning">
                                    <p>
                                        <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. 
                                        All your data, including order history and saved information, will be permanently removed.
                                    </p>
                                </div>
                                
                                {!showDeleteConfirm ? (
                                    <button 
                                        className="account-btn-danger"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={isLoading}
                                    >
                                        I want to delete my account
                                    </button>
                                ) : (
                                    <div className="account-delete-confirm">
                                        <p>
                                            To confirm deletion, please type your username:
                                            <strong> {username}</strong>
                                        </p>
                                        <input 
                                            type="text"
                                            placeholder="Enter your username"
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                                            className="account-delete-input"
                                            disabled={isLoading}
                                        />
                                        
                                        <div className="account-delete-actions">
                                            <button 
                                                className="account-btn-cancel"
                                                onClick={() => {
                                                    setShowDeleteConfirm(false);
                                                    setDeleteConfirmation('');
                                                }}
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                className="account-btn-danger"
                                                onClick={handleDeleteAccount}
                                                disabled={deleteConfirmation !== username || isLoading}
                                            >
                                                {isLoading ? 'Deleting...' : 'Permanently Delete Account'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;