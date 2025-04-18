import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext.jsx';
import '../Contact.css';

const Contact = () => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 1000);
        
        // For production, replace with actual API call:
        // const response = await axios.post('/api/contact', formData);
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
            </div>
            
            <div className="contact-content">
                <div className="contact-info">
                    <div className="info-section">
                        <h3>📍 Visit Us</h3>
                        <p>Fresh Connect Headquarters</p>
                        <p>1234 Campus Way</p>
                        <p>Pullman, WA 99163</p>
                    </div>
                    
                    <div className="info-section">
                        <h3>📞 Call Us</h3>
                        <p>(509) 555-0123</p>
                        <p>Monday - Friday: 9AM - 5PM PST</p>
                    </div>
                    
                    <div className="info-section">
                        <h3>✉️ Email Us</h3>
                        <p>support@freshconnect.com</p>
                        <p>vendor@freshconnect.com</p>
                    </div>
                    
                    <div className="info-section">
                        <h3>🌱 Follow Us</h3>
                        <div className="social-links">
                            <a href="/"className="social-link">Facebook</a>
                            <a href="/" className="social-link">Instagram</a>
                            <a href="/" className="social-link">Twitter</a>
                        </div>
                    </div>
                </div>
                
                <div className="contact-form-container">
                    <h2>Send Us a Message</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Your email address"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="What is this regarding?"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Your message"
                                rows="5"
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;