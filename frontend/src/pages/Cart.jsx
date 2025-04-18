import { useState } from 'react';
import { useCart } from '../contexts/CartContext.jsx';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext.jsx';
import '../Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart();
    const { showNotification } = useNotification();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        setIsCheckingOut(true);
        // Simulate checkout process
        setTimeout(() => {
            clearCart();
            showNotification('Your order has been placed successfully!', 'success');
            setIsCheckingOut(false);
        }, 2000);
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>Your Shopping Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any products to your cart yet.</p>
                    <Link to="/shop" className="btn btn-primary">Browse Products</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <div className="placeholder-image">No Image</div>
                                    )}
                                </div>
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-vendor">By {item.vendor}</p>
                                    <p className="item-price">${item.price.toFixed(2)}/{item.unit}</p>
                                </div>
                                <div className="item-quantity">
                                    <button 
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-subtotal">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button 
                                    className="remove-item-btn"
                                    onClick={() => removeFromCart(item._id)}
                                    aria-label="Remove item"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)}):</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <button 
                            className="checkout-btn"
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                        <button 
                            className="clear-cart-btn"
                            onClick={clearCart}
                            disabled={isCheckingOut}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;