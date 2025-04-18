import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNotification } from '../contexts/NotificationContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Add this import
import '../Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [priceRange, setPriceRange] = useState(50);
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [currentUsername, setCurrentUsername] = useState(''); // Add this state
    const { showNotification } = useNotification();
    const { addToCart } = useCart();
    const { role } = useContext(UserContext);
    const navigate = useNavigate();

    // Get current username from token - add this useEffect
    useEffect(() => {
        if (role) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setCurrentUsername(decodedToken.username || '');
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        }
    }, [role]);

    // Your existing fetchProducts useEffect stays the same
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:4000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                showNotification('Failed to load products. Please try again later.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [showNotification]);

    // Get unique categories and locations for filter options
    const categories = ['all', ...new Set(products.map(product => product.category))];
    const locations = ['all', ...new Set(products.map(product => product.location))];

    // Your existing handleAddToCart function stays the same
    const handleAddToCart = (product) => {
        if (role) {
            // Create a clean product object with only the necessary properties
            // to prevent potential circular references or excessive data
            const cartProduct = {
                _id: product._id,
                name: product.name,
                price: Number(product.price),
                unit: product.unit,
                vendor: product.vendor,
                image: product.image,
                quantity: 1
            };
            
            addToCart(cartProduct);
            showNotification(`Added ${product.name} to your cart!`, 'success');
        } else {
            // If user is not logged in, redirect to login page
            showNotification('Please log in to add items to your cart', 'info');
            navigate('/login');
        }
    };

    // Filter products - just modify this function to add the username check
    const filteredProducts = products.filter(product => {
        // Skip products owned by the current user
        if (currentUsername && product.vendor === currentUsername) {
            return false;
        }
        
        // Search query filter
        const matchesSearch = 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        
        // Location filter
        const matchesLocation = locationFilter === 'all' || product.location === locationFilter;
        
        // Price filter
        const matchesPrice = isUnlimited || product.price <= priceRange;
        
        return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });

    // The rest of your component stays exactly the same
    return (
        <div className="shop-container">
            <div className="shop-header">
                <h1>Local Marketplace</h1>
                <p>Support local farmers and artisans in the Palouse region</p>
            </div>
            
            {isLoading ? (
                <div className="loading">Loading products...</div>
            ) : (
                <div className="shop-content">
                    {/* Filter Sidebar */}
                    <div className="filter-sidebar">
                        <h2>Filter Products</h2>
                        
                        <div className="filter-section">
                            <label htmlFor="search">Search Products</label>
                            <input 
                                type="text" 
                                id="search" 
                                placeholder="Search by name, vendor..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-section">
                            <label htmlFor="category">Category</label>
                            <select 
                                id="category" 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="filter-section">
                            <label htmlFor="location">Farm Location</label>
                            <select 
                                id="location" 
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                {locations.map(location => (
                                    <option key={location} value={location}>
                                        {location === 'all' ? 'All Locations' : location}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="filter-section">
                            <div className="price-filter-header">
                                <label htmlFor="price-range">
                                    Max Price: {isUnlimited ? 'Unlimited' : `$${priceRange}`}
                                </label>
                                <div className="unlimited-checkbox">
                                    <input
                                        type="checkbox"
                                        id="unlimited-price"
                                        checked={isUnlimited}
                                        onChange={() => setIsUnlimited(!isUnlimited)}
                                    />
                                    <label htmlFor="unlimited-price">Unlimited</label>
                                </div>
                            </div>
                            <input 
                                type="range" 
                                id="price-range" 
                                min="1" 
                                max="100" 
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                disabled={isUnlimited}
                                className={isUnlimited ? 'disabled-slider' : ''}
                            />
                        </div>
                    </div>
                    
                    {/* Product List */}
                    <div className="product-list">
                        <p className="results-count">{filteredProducts.length} products found</p>
                        
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image">
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="placeholder-image">No Image</div>
                                        )}
                                    </div>
                                    
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="farmer-name">By {product.vendor}</p>
                                        <p className="product-location">📍 {product.location}</p>
                                        <p className="product-description">{product.description || 'No description available.'}</p>
                                        <div className="product-price-section">
                                            <span className="product-price">${product.price.toFixed(2)}/{product.unit}</span>
                                            <button 
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <p>No products match your criteria. Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;