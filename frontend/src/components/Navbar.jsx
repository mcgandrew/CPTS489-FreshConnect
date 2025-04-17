import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { UserContext } from "../contexts/UserContext.jsx";
import Logo from "./Logo.jsx"

const Navbar = () => {
    const [isLoggedIn] = useState(true);
    // use context to get current user role
    const { role } = useContext(UserContext);

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <Logo />
                </Link>
                <nav className="nav-links">
                        <Link to="/shop" className="nav-item">Shop</Link>
                        <Link to="/sell" className="nav-item">Sell With Us</Link>
                        <Link to="/about" className="nav-item">About Us</Link>
                        <Link to="/contact" className="nav-item">Contact</Link>
                        {isLoggedIn && (
                        <>
                            <Link to="/orders" className="nav-item">My Orders</Link>
                            <Link to="/account" className="nav-item">My Account</Link>
                        </> )}
                        {role === "admin" && ( // only display admin features when user is admin
                            <Link to="/home" className="nav-item">Admin</Link> 
                        )}
                    </nav>
                    <div className="auth-buttons">
                        {!isLoggedIn ? (
                            <Link to="/login" className="btn btn-primary">Login / Register</Link>
                        ) : (
                            <div className="user-menu">
                                <span className="username">User</span>
                                <button onClick={() => console.log("Logout clicked")} className="btn btn-outline">Logout</button>
                            </div>
                        )}
                    </div>
            </div>
        </header>
    )
}

export default Navbar;