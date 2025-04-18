import { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [show, setShow] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setShow(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notification, show, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};