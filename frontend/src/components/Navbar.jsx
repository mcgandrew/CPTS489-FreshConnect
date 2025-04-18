import { Link, useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { jwtDecode } from "jwt-decode";
import Logo from "./Logo.jsx"

const Navbar = () => {
    // use context to get current user role
    const { role, logout } = useContext(UserContext);
    const [username, setUsername] = useState("User");
    const { showNotification } = useNotification();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // If token exists, decode it to get the username
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.username) {
                    setUsername(decodedToken.username);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [role]); // Re-run when role changes (login/logout)

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            showNotification(`Goodbye, ${username}! You've been logged out successfully.`, 'success');
            navigate('/');
        }
    };

    const handleCartClick = () => {
        if (role) {
            navigate('/cart');
        } else {
            showNotification('Please log in to view your cart', 'info');
            navigate('/login');
        }
    };

    return (
        <header>
            <div className="container">
                <Link to="/" className="logo">
                    <Logo/>
                </Link>
                <nav className="nav-links">
                    <Link to="/shop" className="nav-item">Shop</Link>
                    <Link to="/sell" className="nav-item">Sell With Us</Link>
                    <Link to="/about" className="nav-item">About Us</Link>
                    <Link to="/contact" className="nav-item">Contact</Link>
                    {role && (
                    <>
                        <Link to="/orders" className="nav-item">My Orders</Link>
                        <Link to="/account" className="nav-item">My Account</Link>
                    </> )}
                </nav>
                <div className="auth-buttons">
                    {!role ? (
                        <>
                            <Link to="/login" className="btn-primary">Login / Register</Link>
                            <button className="cart-button" onClick={handleCartClick}>
                                🛒
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </button>
                        </>
                        ) : (
                            <>
                                <div className="user-menu">
                                    <span className="username">{username}</span>
                                    <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                                </div>
                                <button className="cart-button" onClick={handleCartClick}>
                                    🛒
                                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                                </button>
                            </>
                        )
                    }
                </div>
            </div>
            {role === "admin" && (
                <div className="admin-nav">
                    <div className="admin-nav-container">
                        <Link to="/admin" className="nav-item-admin">Admin Panel</Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar;