import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx"; // Add this import
import Toast from "./components/Toast.jsx";

// pages and components
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Sell from "./pages/Sell.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Orders from "./pages/Orders.jsx";
import Account from "./pages/Account.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Cart from "./pages/Cart.jsx";

const App = () => {

  return (
    <NotificationProvider>
      <CartProvider> {/* Add the CartProvider here */}
        <div className="App">
          <BrowserRouter>
            <ScrollToTop/>
            <Navbar/>
            <Toast/>
            <div className="pages">
              <Routes>
                <Route
                  path="/"
                  element={<Home/>}
                />
                <Route
                  path="/shop"
                  element={<Shop/>}
                />
                <Route
                  path="/sell"
                  element={<Sell/>}
                />
                <Route
                  path="/about"
                  element={<About/>}
                />
                <Route
                  path="/contact"
                  element={<Contact/>}
                />
                <Route
                  path="/login"
                  element={<Login/>}
                />
                <Route
                  path="/orders"
                  element={<Orders/>}
                />
                <Route
                  path="/account"
                  element={<Account/>}
                />
                <Route
                  path="/cart"
                  element={<Cart/>}
                />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </CartProvider>
    </NotificationProvider>
  );
};

export default App;