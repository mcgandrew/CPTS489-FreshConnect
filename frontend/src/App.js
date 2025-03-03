import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages and components
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Sell from "./pages/Sell"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
