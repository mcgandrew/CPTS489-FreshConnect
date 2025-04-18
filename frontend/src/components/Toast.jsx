import { useNotification } from '../contexts/NotificationContext.jsx';
import { useEffect } from 'react';
import '../Toast.css';

const Toast = () => {
  const { notification, show } = useNotification();

  // Add animation class when showing/hiding
  useEffect(() => {
    const toastElement = document.getElementById('toast');
    if (toastElement) {
      if (show) {
        toastElement.classList.add('show');
      } else {
        toastElement.classList.remove('show');
      }
    }
  }, [show]);

  if (!show) return null;

  return (
    <div 
      id="toast" 
      className={`toast ${notification.type}`}
    >
      <div className="toast-content">
        {notification.message}
      </div>
    </div>
  );
};

export default Toast;