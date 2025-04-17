import { useState } from 'react';
import '../Orders.css';

const Orders = () => {
    // Mock data for orders - replace with real data later
    const mockOrders = [
        {
            id: "ORD-2024-001",
            date: "February 28, 2025",
            status: "Delivered",
            total: 34.97,
            items: [
                {
                    id: 1,
                    name: "Organic Heirloom Tomatoes",
                    quantity: 2,
                    price: 4.99,
                    farmer: "Green Valley Farm",
                    image: "/images/tomatoes.jpg"
                },
                {
                    id: 4,
                    name: "Artisan Sourdough Bread",
                    quantity: 1,
                    price: 7.99,
                    farmer: "Heritage Bakery",
                    image: "/images/sourdough.jpeg"
                },
                {
                    id: 2,
                    name: "Raw Wildflower Honey",
                    quantity: 1,
                    price: 12.99,
                    farmer: "Bee Happy Apiaries",
                    image: "/images/honey.jpeg"
                }
            ]
        },
        {
            id: "ORD-2024-002",
            date: "February 21, 2025",
            status: "Delivered",
            total: 22.97,
            items: [
                {
                    id: 5,
                    name: "Free-Range Eggs",
                    quantity: 2,
                    price: 5.99,
                    farmer: "Sunrise Farm",
                    image: "/images/eggs.jpg"
                },
                {
                    id: 6,
                    name: "Organic Kale Bunch",
                    quantity: 1,
                    price: 3.99,
                    farmer: "Green Valley Farm",
                    image: "/images/kale.jpeg"
                },
                {
                    id: 3,
                    name: "Fresh Goat Cheese",
                    quantity: 1,
                    price: 6.50,
                    farmer: "Hillside Dairy",
                    image: "/images/goatcheese.jpeg"
                }
            ]
        },
        {
            id: "ORD-2024-003",
            date: "February 14, 2025",
            status: "Delivered",
            total: 18.48,
            items: [
                {
                    id: 1,
                    name: "Organic Heirloom Tomatoes",
                    quantity: 1,
                    price: 4.99,
                    farmer: "Green Valley Farm",
                    image: "/images/tomatoes.jpg"
                },
                {
                    id: 6,
                    name: "Organic Kale Bunch",
                    quantity: 1,
                    price: 3.99,
                    farmer: "Green Valley Farm",
                    image: "/images/kale.jpeg"
                },
                {
                    id: 5,
                    name: "Free-Range Eggs",
                    quantity: 1,
                    price: 5.99,
                    farmer: "Sunrise Farm",
                    image: "/images/eggs.jpg"
                },
                {
                    id: 3,
                    name: "Fresh Goat Cheese",
                    quantity: 0.5,
                    price: 6.50,
                    farmer: "Hillside Dairy",
                    image: "/images/goatcheese.jpeg"
                }
            ]
        }
    ];

    // State for expanded order detail
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Toggle order detail expansion
    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>View and track all your Fresh Connect orders</p>
            </div>

            {mockOrders.length > 0 ? (
                <div className="orders-list">
                    {mockOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-summary" onClick={() => toggleOrderDetails(order.id)}>
                                <div className="order-info">
                                    <h3 className="order-id">{order.id}</h3>
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
                                                    <img src={item.image} alt={item.name} />
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
                                            <button className="btn-outline">Reorder</button>
                                            <button className="btn-primary">Track Delivery</button>
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
                        <a href="/shop" className="btn-primary">Browse Products</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;