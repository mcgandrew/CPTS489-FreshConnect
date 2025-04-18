import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from './UserContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { role } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  
  // Add this flag to prevent localStorage update loops
  const isInitialMount = useRef(true);

  // Initialize cart from localStorage on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
          const count = parsedCart.reduce((total, item) => total + (item.quantity || 0), 0);
          setCartCount(count);
        }
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      localStorage.removeItem('cart');
    }
    
    // Mark initial mount as complete
    isInitialMount.current = false;
  }, []);

  // Update localStorage whenever cart changes, but skip on initial mount
  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Update cart count when items change
  useEffect(() => {
    if (!isInitialMount.current) {
      const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartCount(count);
    }
  }, [cartItems]);

  // Clear cart if user logs out
  useEffect(() => {
    if (!role) {
      setCartItems([]);
      localStorage.removeItem('cart');
      setCartCount(0);
    }
  }, [role]);

  const addToCart = (product, quantity = 1) => {
    // Create a sanitized product object with only necessary fields
    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: Number(product.price),
      unit: product.unit || 'each',
      vendor: product.vendor || 'Unknown',
      image: product.image || '',
      quantity: quantity
    };
    
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item._id === cartProduct._id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, cartProduct];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        calculateTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);