import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Fresh Connect</h1>
                </Link>
                <nav className="nav-links">
                        <Link to="/shop" className="nav-item">Shop</Link>
                        <Link to="/sell" className="nav-item">Sell With Us</Link>
                        <Link to="/about" className="nav-item">About Us</Link>
                        <Link to="/contact" className="nav-item">Contact</Link>
                    </nav>
                    <div className="auth-buttons">
                        <Link to="/login" className="btn btn-primary">Login / Register</Link>
                    </div>
            </div>
        </header>
    )
}

export default Navbar