import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import "./index.css";
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
        
      </UserProvider>
    </NotificationProvider>
  </React.StrictMode>
);

