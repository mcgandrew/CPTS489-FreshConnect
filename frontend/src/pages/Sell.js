import { useState } from 'react';
import { Link } from "react-router-dom"

const Sell = () => {
  const [isLoggedIn] = useState(false);
    return (
        <div>
            <h1>Sell With Us</h1>
            { isLoggedIn ? (
              <p>Start selling your products here</p>
            ) : (
              <div>
                <p>Log in to start selling your products</p>
                <p>Are you a farmer or producer looking to sell your products online? Fresh Connect is the perfect place for you! We make it easy for you to get your products in front of customers who are looking for fresh, local produce. Sign up today and start selling with us!</p>
                <Link className="sell-btn-primary" to="/Login">Sign Up</Link>
              </div>
            )}
        </div>
    )
}

export default Sell