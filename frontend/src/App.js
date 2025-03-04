import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages and components
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Sell from "./pages/Sell"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import Orders from "./pages/Orders"
import Account from "./pages/Account"
import ScrollToTop from "./components/ScrollToTop"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop/>
        <Navbar/>
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
