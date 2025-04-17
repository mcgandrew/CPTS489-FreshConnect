import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext.jsx";

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

const App = () => {
  // role of current user is always known within App
  const { role } = useContext(UserContext);

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop/>
        <Navbar/>
        <div className="pages">
          <Routes>
            <Route
              path="/home"
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
