import { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Sell.css';

const Sell = () => {
  const { role } = useContext(UserContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [vendorName, setVendorName] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'lb',
    category: 'Vegetables',
    location: '',
    description: '',
    image: ''
  });
  const [error, setError] = useState('');

  // Get vendor name from token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setVendorName(decodedToken.username || 'Your Farm'); 
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!vendorName) return; // Don't fetch if vendor name isn't loaded yet
    
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
  
      // Get all products
      const response = await axios.get('http://localhost:4000/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Filter products by the current vendor's name
      const myProducts = response.data.filter(product => 
        product.vendor === vendorName
      );
      
      // Set products first, then update loading state and initialLoadComplete
      setProducts(myProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load your products. Please try again later.');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      // Small delay to prevent flashing
      setTimeout(() => {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }, 100);
    }
  }, [vendorName, navigate]);
  
  // Fetch seller's products when component mounts or vendorName changes
  useEffect(() => {
    if (role && vendorName) {
      fetchProducts();
    }
  }, [role, vendorName, fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const productData = {
        ...formData,
        vendor: vendorName,
        price: parseFloat(formData.price)
      };

      if (editingProduct) {
        // Update existing product
        await axios.patch(
          `http://localhost:4000/products/${editingProduct._id}`, 
          productData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        showNotification('Product updated successfully!');
      } else {
        // Create new product
        await axios.post(
          'http://localhost:4000/products', 
          productData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        showNotification('Product added successfully!');
      }

      // Reset form and refetch products
      setFormData({
        name: '',
        price: '',
        unit: 'lb',
        category: 'Vegetables',
        location: '',
        description: '',
        image: ''
      });
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.error || 'Failed to save product');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      unit: product.unit,
      category: product.category,
      location: product.location,
      description: product.description || '',
      image: product.image || ''
    });
    setShowForm(true);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        await axios.delete(`http://localhost:4000/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showNotification('Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product');
        
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({
        ...formData,
        image: event.target.result // This is the base64 string
      });
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
  };

  return (
    <div className="sell-container">
      <div className="sell-header">
        <h1>Sell With Us</h1>
        <p>Manage your products and reach customers looking for fresh local produce</p>
      </div>

      {role ? (
        <>
          <div className="seller-dashboard">
            <div className="dashboard-header">
              <h2>{vendorName}'s Products</h2>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    price: '',
                    unit: 'lb',
                    category: 'Vegetables',
                    location: '',
                    description: '',
                    image: ''
                  });
                  setShowForm(!showForm);
                }}
              >
                {showForm ? 'Cancel' : 'Add New Product'}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
              <div className="product-form-container">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Product Name*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Organic Heirloom Tomatoes"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="price">Price*</label>
                      <div className="price-input">
                        <span className="price-symbol">$</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          style={{ paddingLeft: '20px' }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="unit">Unit*</label>
                      <select
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="lb">Pound (lb)</option>
                        <option value="oz">Ounce (oz)</option>
                        <option value="each">Each</option>
                        <option value="bunch">Bunch</option>
                        <option value="dozen">Dozen</option>
                        <option value="jar">Jar</option>
                        <option value="loaf">Loaf</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="category">Category*</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Honey">Honey</option>
                        <option value="Eggs">Eggs</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">Farm Location*</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Pullman"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="image">Product Image</label>
                      <div className="image-upload-container">
                        {formData.image ? (
                          <div className="image-preview">
                            <img 
                              src={formData.image} 
                              alt="Preview" 
                              className="preview-image" 
                            />
                            <button 
                              type="button" 
                              className="remove-image-btn"
                              onClick={() => setFormData({...formData, image: ''})}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="upload-area">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="file-input"
                            />
                            <label htmlFor="image-upload" className="upload-label">
                              <div className="upload-icon">📷</div>
                              <span>Click to upload image</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Describe your product, including growing methods, flavor profile, etc."
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {(!initialLoadComplete || (isLoading && products.length === 0)) ? (
              <div className="loading">Loading your products...</div>
            ) : (
              <div className="products-list">
                {initialLoadComplete && !isLoading && products.length === 0 ? (
                  <div className="no-products">
                    <p>You haven't added any products yet. Click "Add New Product" to get started.</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product._id} className="product-item">
                      <div className="product-image">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <div className="placeholder-image">No Image</div>
                        )}
                      </div>
                      <div className="product-details">
                        <h3>{product.name}</h3>
                        <p className="product-price">${product.price.toFixed(2)}/{product.unit}</p>
                        <p className="product-category">{product.category}</p>
                        <p className="product-description">{product.description || 'No description provided.'}</p>
                      </div>
                      <div className="product-actions">
                        <button 
                          className="btn btn-outline"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="seller-signup">
          <p>Log in to start selling your products</p>
          <p>Are you a farmer or producer looking to sell your products online? Fresh Connect is the perfect place for you! We make it easy for you to get your products in front of customers who are looking for fresh, local produce.</p>
          
          <div className="benefits-section">
            <h3>Benefits of selling with Fresh Connect:</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🌱</div>
                <h4>Direct to Consumer</h4>
                <p>Connect directly with customers seeking fresh, local products</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h4>Fair Pricing</h4>
                <p>Set your own prices and keep more of your earnings</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h4>Simple Dashboard</h4>
                <p>Easily manage your product listings and track sales</p>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <Link className="btn btn-primary btn-large" to="/Login">Sign Up to Sell</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sell;