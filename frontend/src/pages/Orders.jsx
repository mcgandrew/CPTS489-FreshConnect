import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import { useCart } from '../contexts/CartContext.jsx'; // Add this import
import '../Orders.css';

const Orders = () => {
    const { role } = useContext(UserContext); // Remove username as it's not used
    const { showNotification } = useNotification();
    const { addToCart } = useCart(); // Add this to properly use the cart functionality
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for expanded order detail
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Fetch orders from the API
    useEffect(() => {
        const fetchOrders = async () => {
            if (!role) {
                navigate('/login');
                return;
            }
            
            try {
                setLoading(true);
                // Use the new user-specific endpoint
                const response = await axios.get('http://localhost:4000/orders/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // Format the orders data to match our UI structure
                const formattedOrders = response.data.map(order => ({
                    id: order._id,
                    date: new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    status: order.status,
                    total: order.total,
                    items: order.items.map(item => ({
                        id: item._id,
                        name: item.name,
                        quantity: 1, 
                        price: item.price,
                        farmer: item.vendor,
                        image: item.image || '/images/placeholder.jpg',
                        category: item.category,
                        location: item.location
                    }))
                }));
                
                setOrders(formattedOrders);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again later.');
                showNotification('Error loading orders', 'error');
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [role, navigate, showNotification]);

    // Toggle order detail expansion
    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };
    
    // Fix the reorder functionality to actually add items to cart
    const handleReorder = (order) => {
        // Add each item to the cart
        order.items.forEach(item => {
            addToCart({
                _id: item.id,
                name: item.name,
                price: item.price,
                vendor: item.farmer,
                image: item.image,
                unit: item.unit,
                location: item.location,
                category: item.category, 
                quantity: item.quantity
            });
        });
        
        showNotification('Items added to cart', 'success');
       
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                </div>
                <div className="loading">Loading your orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                </div>
                <div className="error-message">
                    <p>{error}</p>
                    <button 
                        className="btn-primary" 
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    // Fix the image rendering issue in the order details section
    return (
        <div className="orders-container">
            {/* Header section remains the same */}
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>View and track all your Fresh Connect orders</p>
            </div>

            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-summary" onClick={() => toggleOrderDetails(order.id)}>
                                {/* Order summary content remains the same */}
                                <div className="order-info">
                                    <h3 className="order-id">Order #{order.id.substring(order.id.length - 6)}</h3>
                                    <p className="order-date">{order.date}</p>
                                </div>
                                <div className="order-status">
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-total">
                                    <p>${order.total.toFixed(2)}</p>
                                </div>
                                <div className="order-toggle">
                                    <button className="toggle-btn">
                                        {expandedOrderId === order.id ? "Hide Details" : "Show Details"}
                                    </button>
                                </div>
                            </div>

                            {expandedOrderId === order.id && (
                                <div className="order-details">
                                    <h4>Order Items</h4>
                                    <div className="order-items">
                                        {order.items.map(item => (
                                            <div key={item.id} className="order-item">
                                                <div className="item-image">
                                                    {/* Fix image rendering with proper error handling */}
                                                    <img 
                                                        src={item.image}
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            if (e.target.src !== '/images/placeholder.jpg') {
                                                                e.target.src = '/images/placeholder.jpg';
                                                                e.target.onerror = null; // Prevent infinite error loop
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="item-details">
                                                    <h5>{item.name}</h5>
                                                    <p className="item-farmer">From: {item.farmer}</p>
                                                    <div className="item-pricing">
                                                        <p>Qty: {item.quantity}</p>
                                                        <p>${item.price.toFixed(2)} each</p>
                                                        <p className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-summary-footer">
                                        <div className="summary-details">
                                            <div className="summary-row">
                                                <span>Subtotal:</span>
                                                <span>${order.total.toFixed(2)}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Delivery:</span>
                                                <span>$0.00</span>
                                            </div>
                                            <div className="summary-row total">
                                                <span>Total:</span>
                                                <span>${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="order-actions">
                                            <button 
                                                className="btn-outline" 
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent toggle when clicking reorder
                                                    handleReorder(order);
                                                }}
                                            >
                                                Reorder
                                            </button>
                                            {order.status === "Shipped" && (
                                                <button className="btn-primary">Track Delivery</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-orders">
                    <div className="no-orders-message">
                        <h3>You haven't placed any orders yet</h3>
                        <p>When you place orders, they will appear here for you to track and reorder.</p>
                        <Link to="/shop" className="btn-primary">Browse Products</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;