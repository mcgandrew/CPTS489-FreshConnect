import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import '../Admin.css';

const Admin = () => {
    const { role } = useContext(UserContext);
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    
    // State for tab management
    const [activeTab, setActiveTab] = useState('products');
    
    // Products state
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    
    // Orders state
    const [orders, setOrders] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [orderSortField, setOrderSortField] = useState('createdAt');
    const [orderSortDirection, setOrderSortDirection] = useState('desc');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    
    // Check if user is admin, redirect if not
    useEffect(() => {
        if (role !== 'admin') {
            showNotification('Unauthorized access: Admin privileges required', 'error');
            navigate('/');
        }
    }, [role, navigate, showNotification]);
    
    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            if (activeTab !== 'products') return;
            
            try {
                setIsProductsLoading(true);
                const response = await axios.get('http://localhost:4000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                showNotification('Failed to load products', 'error');
            } finally {
                setIsProductsLoading(false);
            }
        };
        
        fetchProducts();
    }, [activeTab, showNotification]);
    
    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (activeTab !== 'orders') return;
            
            try {
                setIsOrdersLoading(true);
                const response = await axios.get('http://localhost:4000/orders', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // Format orders for display
                const formattedOrders = response.data.map(order => ({
                    id: order._id,
                    userId: order.userId,
                    status: order.status,
                    total: order.total,
                    date: new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    time: new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    createdAt: order.createdAt,
                    items: order.items.map(item => ({
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        vendor: item.vendor,
                        quantity: 1,
                        image: item.image
                    }))
                }));
                
                setOrders(formattedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                showNotification('Failed to load orders', 'error');
            } finally {
                setIsOrdersLoading(false);
            }
        };
        
        fetchOrders();
    }, [activeTab, showNotification]);
    
    // Handle product deletion
    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/products/${id}`);
            setProducts(products.filter(product => product._id !== id));
            showNotification('Product deleted successfully', 'success');
            setConfirmDeleteId(null);
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Failed to delete product', 'error');
        }
    };
    
    // Handle product update
    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await axios.patch(
                `http://localhost:4000/products/${updatedProduct._id}`, 
                updatedProduct
            );
            
            // Update products state with the updated product
            setProducts(products.map(product => 
                product._id === updatedProduct._id ? {...product, ...updatedProduct} : product
            ));
            
            setShowEditModal(false);
            setEditingProduct(null);
            showNotification('Product updated successfully', 'success');
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification('Failed to update product', 'error');
        }
    };
    
    // Handle order status update
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/orders/${orderId}`, 
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            // Update orders state with the new status
            setOrders(orders.map(order => 
                order.id === orderId ? {...order, status: newStatus} : order
            ));
            
            showNotification(`Order #${orderId.substring(orderId.length - 6)} updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification('Failed to update order status', 'error');
        }
    };
    
    // Filter and sort products
    const filteredProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Handle different field types
            if (sortField === 'price') {
                return sortDirection === 'asc' 
                    ? a.price - b.price 
                    : b.price - a.price;
            } else if (sortField === 'createdAt') {
                return sortDirection === 'asc' 
                    ? new Date(a.createdAt) - new Date(b.createdAt) 
                    : new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                // String comparison for other fields
                const aValue = a[sortField] ? a[sortField].toLowerCase() : '';
                const bValue = b[sortField] ? b[sortField].toLowerCase() : '';
                
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });
    
    // Filter and sort orders
    const filteredOrders = orders
        .filter(order => {
            // Apply status filter
            if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
                return false;
            }
            
            // Apply search filter if present
            if (orderSearchTerm) {
                return (
                    order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                    order.items.some(item => 
                        item.name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                        item.vendor.toLowerCase().includes(orderSearchTerm.toLowerCase())
                    )
                );
            }
            
            return true;
        })
        .sort((a, b) => {
            if (orderSortField === 'total') {
                return orderSortDirection === 'asc' 
                    ? a.total - b.total 
                    : b.total - a.total;
            } else if (orderSortField === 'createdAt') {
                return orderSortDirection === 'asc' 
                    ? new Date(a.createdAt) - new Date(b.createdAt) 
                    : new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                // String comparison for other fields
                const aValue = a[orderSortField] ? a[orderSortField].toLowerCase() : '';
                const bValue = b[orderSortField] ? b[orderSortField].toLowerCase() : '';
                
                return orderSortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });
    
    // Toggle sort direction for products
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    
    // Toggle sort direction for orders
    const handleOrderSort = (field) => {
        if (orderSortField === field) {
            setOrderSortDirection(orderSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderSortField(field);
            setOrderSortDirection('asc');
        }
    };
    
    // Toggle order details expansion
    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    
    // Edit Product Modal Component
    const EditProductModal = () => {
        const [formData, setFormData] = useState({...editingProduct});
        
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: name === 'price' ? Number(value) : value
            });
        };
        
        const handleSubmit = (e) => {
            e.preventDefault();
            handleUpdateProduct(formData);
        };
        
        return (
            <div className="admin-modal-backdrop">
                <div className="admin-modal">
                    <div className="admin-modal-header">
                        <h2>Edit Product</h2>
                        <button 
                            className="admin-modal-close" 
                            onClick={() => setShowEditModal(false)}
                        >
                            ×
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="admin-edit-form">
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label htmlFor="name">Product Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="admin-form-group">
                                <label htmlFor="vendor">Vendor</label>
                                <input
                                    type="text"
                                    id="vendor"
                                    name="vendor"
                                    value={formData.vendor}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="admin-form-group">
                                <label htmlFor="unit">Unit</label>
                                <input
                                    type="text"
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Honey">Honey</option>
                                    <option value="Eggs">Eggs</option>
                                </select>
                            </div>
                            
                            <div className="admin-form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="admin-form-group">
                            <label htmlFor="image">Image URL</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="admin-form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>
                        
                        <div className="admin-form-buttons">
                            <button 
                                type="button" 
                                className="admin-btn-cancel"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="admin-btn-save"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    // Delete Confirmation Modal
    const DeleteConfirmModal = ({ productId, productName }) => {
        return (
            <div className="admin-modal-backdrop">
                <div className="admin-delete-modal">
                    <div className="admin-modal-header">
                        <h2>Confirm Deletion</h2>
                        <button 
                            className="admin-modal-close" 
                            onClick={() => setConfirmDeleteId(null)}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="admin-delete-content">
                        <p>Are you sure you want to delete <strong>{productName}</strong>?</p>
                        <p className="admin-delete-warning">This action cannot be undone.</p>
                        
                        <div className="admin-form-buttons">
                            <button 
                                className="admin-btn-cancel"
                                onClick={() => setConfirmDeleteId(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="admin-btn-delete"
                                onClick={() => handleDeleteProduct(productId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Panel</h1>
                <p>Manage products and orders in the Fresh Connect marketplace</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products Management
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders Management
                </button>
            </div>
            
            {/* Products Tab */}
            {activeTab === 'products' && (
                <>
                    <div className="admin-toolbar">
                        <div className="admin-search">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className="admin-search-clear" 
                                    onClick={() => setSearchTerm('')}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        
                        <div className="admin-stats">
                            <div className="admin-stat-box">
                                <span className="admin-stat-value">{products.length}</span>
                                <span className="admin-stat-label">Total Products</span>
                            </div>
                        </div>
                    </div>
                    
                    {isProductsLoading ? (
                        <div className="admin-loading">Loading products...</div>
                    ) : (
                        <>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('name')}>
                                                Product Name
                                                {sortField === 'name' && (
                                                    <span className="sort-indicator">
                                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('vendor')}>
                                                Vendor
                                                {sortField === 'vendor' && (
                                                    <span className="sort-indicator">
                                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('price')}>
                                                Price
                                                {sortField === 'price' && (
                                                    <span className="sort-indicator">
                                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('category')}>
                                                Category
                                                {sortField === 'category' && (
                                                    <span className="sort-indicator">
                                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('createdAt')}>
                                                Date Added
                                                {sortField === 'createdAt' && (
                                                    <span className="sort-indicator">
                                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="admin-no-data">
                                                    No products found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map(product => (
                                                <tr key={product._id}>
                                                    <td className="admin-product-name">
                                                        <div className="admin-product-name-cell">
                                                            {product.image ? (
                                                                <div className="admin-product-thumbnail">
                                                                    <img src={product.image} alt={product.name} />
                                                                </div>
                                                            ) : (
                                                                <div className="admin-product-thumbnail admin-no-image">
                                                                    <span>No Image</span>
                                                                </div>
                                                            )}
                                                            <span>{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{product.vendor}</td>
                                                    <td>${product.price.toFixed(2)}/{product.unit}</td>
                                                    <td>
                                                        <span className={`admin-category-badge ${product.category.toLowerCase()}`}>
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(product.createdAt)}</td>
                                                    <td className="admin-actions">
                                                        <button 
                                                            className="admin-btn admin-btn-edit"
                                                            onClick={() => {
                                                                setEditingProduct(product);
                                                                setShowEditModal(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="admin-btn admin-btn-delete"
                                                            onClick={() => setConfirmDeleteId(product._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="admin-pagination">
                                <span className="admin-results-count">
                                    Showing {filteredProducts.length} of {products.length} products
                                </span>
                            </div>
                        </>
                    )}
                </>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <>
                    <div className="admin-toolbar">
                        <div className="admin-search">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={orderSearchTerm}
                                onChange={(e) => setOrderSearchTerm(e.target.value)}
                            />
                            {orderSearchTerm && (
                                <button 
                                    className="admin-search-clear" 
                                    onClick={() => setOrderSearchTerm('')}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        
                        <div className="admin-order-filters">
                            <select 
                                value={orderStatusFilter} 
                                onChange={(e) => setOrderStatusFilter(e.target.value)}
                                className="admin-status-filter"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        
                        <div className="admin-stats">
                            <div className="admin-stat-box">
                                <span className="admin-stat-value">{orders.length}</span>
                                <span className="admin-stat-label">Total Orders</span>
                            </div>
                            <div className="admin-stat-box">
                                <span className="admin-stat-value">
                                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                                </span>
                                <span className="admin-stat-label">Total Revenue</span>
                            </div>
                        </div>
                    </div>
                    
                    {isOrdersLoading ? (
                        <div className="admin-loading">Loading orders...</div>
                    ) : (
                        <>
                            <div className="admin-table-container">
                                <table className="admin-table admin-orders-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleOrderSort('id')}>
                                                Order ID
                                                {orderSortField === 'id' && (
                                                    <span className="sort-indicator">
                                                        {orderSortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleOrderSort('date')}>
                                                Date
                                                {orderSortField === 'date' && (
                                                    <span className="sort-indicator">
                                                        {orderSortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleOrderSort('status')}>
                                                Status
                                                {orderSortField === 'status' && (
                                                    <span className="sort-indicator">
                                                        {orderSortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th onClick={() => handleOrderSort('total')}>
                                                Total
                                                {orderSortField === 'total' && (
                                                    <span className="sort-indicator">
                                                        {orderSortDirection === 'asc' ? ' ↑' : ' ↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th>Items</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="admin-no-data">
                                                    No orders found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map(order => (
                                                <React.Fragment key={order.id}>
                                                    <tr 
                                                        className={expandedOrderId === order.id ? 'admin-order-row expanded' : 'admin-order-row'}
                                                        onClick={() => toggleOrderDetails(order.id)}
                                                    >
                                                        <td>#{order.id.substring(order.id.length - 6)}</td>
                                                        <td>{`${order.date} at ${order.time}`}</td>
                                                        <td>
                                                            <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td>${order.total.toFixed(2)}</td>
                                                        <td>{order.items.length} item(s)</td>
                                                        <td className="admin-actions" onClick={(e) => e.stopPropagation()}>
                                                            <select 
                                                                className="admin-status-select"
                                                                value={order.status}
                                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    {expandedOrderId === order.id && (
                                                        <tr className="admin-order-details-row">
                                                            <td colSpan="6">
                                                                <div className="admin-order-details">
                                                                    <h4>Order Items</h4>
                                                                    <div className="admin-order-items">
                                                                        {order.items.map(item => (
                                                                            <div key={item.id} className="admin-order-item">
                                                                                <div className="admin-order-item-image">
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
                                                                                        <div className="admin-placeholder-image">No Image</div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="admin-order-item-details">
                                                                                    <h5>{item.name}</h5>
                                                                                    <p>From: {item.vendor}</p>
                                                                                    <p>${item.price.toFixed(2)} each</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="admin-order-summary">
                                                                        <div className="admin-order-summary-row">
                                                                            <span>Order ID:</span>
                                                                            <span>{order.id}</span>
                                                                        </div>
                                                                        <div className="admin-order-summary-row">
                                                                            <span>Customer ID:</span>
                                                                            <span>{order.userId}</span>
                                                                        </div>
                                                                        <div className="admin-order-summary-row">
                                                                            <span>Date & Time:</span>
                                                                            <span>{`${order.date} at ${order.time}`}</span>
                                                                        </div>
                                                                        <div className="admin-order-summary-row">
                                                                            <span>Items:</span>
                                                                            <span>{order.items.length}</span>
                                                                        </div>
                                                                        <div className="admin-order-summary-row total">
                                                                            <span>Total:</span>
                                                                            <span>${order.total.toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="admin-pagination">
                                <span className="admin-results-count">
                                    Showing {filteredOrders.length} of {orders.length} orders
                                </span>
                            </div>
                        </>
                    )}
                </>
            )}
            
            {/* Modals */}
            {showEditModal && editingProduct && <EditProductModal />}
            {confirmDeleteId && (
                <DeleteConfirmModal 
                    productId={confirmDeleteId} 
                    productName={products.find(p => p._id === confirmDeleteId)?.name || 'this product'} 
                />
            )}
        </div>
    );
};

export default Admin;