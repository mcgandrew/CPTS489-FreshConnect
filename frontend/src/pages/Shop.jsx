import { useState } from 'react';
import '../Shop.css'; 

const Shop = () => {
    // Mock data for products - replace these with actual data later
    const mockProducts = [
        {
            id: 1,
            name: "Organic Heirloom Tomatoes",
            farmer: "Green Valley Farm",
            price: 4.99,
            unit: "lb",
            category: "vegetables",
            location: "Pullman",
            image: "/images/tomatoes.jpg", 
            description: "Locally grown heirloom tomatoes, perfect for salads and sauces."
        },
        {
            id: 2,
            name: "Raw Wildflower Honey",
            farmer: "Bee Happy Apiaries",
            price: 12.99,
            unit: "jar",
            category: "honey",
            location: "Moscow",
            image: "/images/honey.jpeg",
            description: "Unfiltered raw honey collected from local wildflower fields."
        },
        {
            id: 3,
            name: "Fresh Goat Cheese",
            farmer: "Hillside Dairy",
            price: 6.50,
            unit: "8oz",
            category: "dairy",
            location: "Colfax",
            image: "/images/goatcheese.jpeg",
            description: "Creamy goat cheese made from pasture-raised goats."
        },
        {
            id: 4,
            name: "Artisan Sourdough Bread",
            farmer: "Heritage Bakery",
            price: 7.99,
            unit: "loaf",
            category: "bakery",
            location: "Pullman",
            image: "/images/sourdough.jpeg",
            description: "Naturally leavened sourdough made with local grains."
        },
        {
            id: 5,
            name: "Free-Range Eggs",
            farmer: "Sunrise Farm",
            price: 5.99,
            unit: "dozen",
            category: "eggs",
            location: "Moscow",
            image: "/images/eggs.jpg",
            description: "Farm fresh eggs from free-range chickens."
        },
        {
            id: 6,
            name: "Organic Kale Bunch",
            farmer: "Green Valley Farm",
            price: 3.99,
            unit: "bunch",
            category: "vegetables",
            location: "Pullman",
            image: "/images/kale.jpeg",
            description: "Freshly harvested organic kale, rich in nutrients."
        }
    ];

    // State for filters
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [priceRange, setPriceRange] = useState(20);

    // Get unique categories and locations for filter options
    const categories = ['all', ...new Set(mockProducts.map(product => product.category))];
    const locations = ['all', ...new Set(mockProducts.map(product => product.location))];

    // Filter products based on search and filter criteria
    const filteredProducts = mockProducts.filter(product => {
        // Search query filter
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        
        // Location filter
        const matchesLocation = locationFilter === 'all' || product.location === locationFilter;
        
        // Price filter
        const matchesPrice = product.price <= priceRange;
        
        return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });

    return (
        <div className="shop-container">
            <div className="shop-header">
                <h1>Local Marketplace</h1>
                <p>Support local farmers and artisans in the Palouse region</p>
            </div>
            
            <div className="shop-content">
                {/* Filter Sidebar */}
                <div className="filter-sidebar">
                    <h2>Filter Products</h2>
                    
                    <div className="filter-section">
                        <label htmlFor="search">Search Products</label>
                        <input 
                            type="text" 
                            id="search" 
                            placeholder="Search by name, farmer..." 
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
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
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
                        <label htmlFor="price-range">Max Price: ${priceRange}</label>
                        <input 
                            type="range" 
                            id="price-range" 
                            min="1" 
                            max="50" 
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Product List */}
                <div className="product-list">
                    <p className="results-count">{filteredProducts.length} products found</p>
                    
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                  <img src={product.image} alt={product.name} />
                                </div>
                                
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="farmer-name">By {product.farmer}</p>
                                    <p className="product-location">📍 {product.location}</p>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-price-section">
                                        <span className="product-price">${product.price.toFixed(2)}/{product.unit}</span>
                                        <button className="add-to-cart-btn">Add to Cart</button>
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
        </div>
    );
};

export default Shop;