import { useState } from 'react';
import { useCart } from '../contexts/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext.jsx';
import axios from 'axios';
import '../Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart();
    const { showNotification } = useNotification();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
      if (cartItems.length === 0) {
          showNotification('Your cart is empty', 'error');
          return;
      }
  
      setIsCheckingOut(true);
  
      try {
          // always include a category value
          const orderData = {
              status: "Pending",
              total: calculateTotal(),
              items: cartItems.map(item => {
                  // Check if console logs show the actual cart item data
                  console.log("Cart item being processed:", item);
                  
                  // Create object with required fields
                  return {
                      _id: item._id,
                      name: item.name,
                      vendor: item.vendor,
                      price: item.price,
                      // Set a default category if none is provided
                      category: item.category || "Vegetables",
                      image: item.image,
                      unit: item.unit,
                      location: item.location || "Pullman"
                  };
              })
          };
  
          console.log("Sending order data:", orderData);
  
          // Send order to backend
          const response = await axios.post('http://localhost:4000/orders', orderData, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
  
          if (response.status === 200 || response.status === 201) {
              clearCart();
              showNotification('Your order has been placed successfully!', 'success');
              
              // Navigate to orders page after a short delay
              setTimeout(() => {
                  navigate('/orders');
              }, 1500);
          }
      } catch (error) {
          console.error('Checkout error:', error);
          
          // Log more detailed error information
          if (error.response) {
              console.error('Error response:', error.response.data);
          }
          
          showNotification(
              error.response?.data?.error || 'Failed to process your order. Please try again.', 
              'error'
          );
      } finally {
          setIsCheckingOut(false);
      }
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
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            onError={(e) => {
                                                if (e.target.src !== '/images/placeholder.jpg') {
                                                    e.target.src = '/images/placeholder.jpg';
                                                    e.target.onerror = null;
                                                }
                                            }}
                                        />
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