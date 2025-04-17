import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import '../Home.css'; 

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Fresh Food from <span className="highlight">Local Farmers</span></h1>
                    <p>Support local agriculture and enjoy the freshest products delivered to your doorstep</p>
                    <div className="hero-buttons">
                        <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                        <Link to="/about" className="btn btn-secondary">Learn More</Link>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Placeholder for hero image */}
                    <div className="placeholder-image">
                        <Logo />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
                <h2>Why Choose Fresh Connect?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">🌱</div>
                        <h3>Locally Sourced</h3>
                        <p>All products come directly from farmers and artisans in the Palouse region</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🥕</div>
                        <h3>Farm Fresh</h3>
                        <p>Enjoy produce harvested at peak freshness and delivered within hours</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">💚</div>
                        <h3>Support Local</h3>
                        <p>Your purchases directly support small farms and sustainable agriculture</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🌎</div>
                        <h3>Eco-Friendly</h3>
                        <p>Reducing food miles means less environmental impact from transportation</p>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-products">
                <h2>Featured Products</h2>
                <div className="product-slider">
                    {/* Product Cards */}
                    <div className="product-card">
                        <div className="product-thumbnail">
                            <div className="placeholder-image">
                                <img src="/images/tomatoes.jpg" alt="Organic Tomatoes" />
                            </div>
                        </div>
                        <h3>Organic Tomatoes</h3>
                        <p className="farmer">Green Valley Farm</p>
                        <p className="price">$4.99/lb</p>
                    </div>
                    <div className="product-card">
                        <div className="product-thumbnail">
                            <div className="placeholder-image">
                                <img src="/images/honey.jpeg" alt="Fresh Honey" />
                            </div>
                        </div>
                        <h3>Fresh Honey</h3>
                        <p className="farmer">Bee Happy Apiaries</p>
                        <p className="price">$12.99/jar</p>
                    </div>
                    <div className="product-card">
                        <div className="product-thumbnail">
                            <div className="placeholder-image">
                                <img src="/images/sourdough.jpeg" alt="Artisan Bread" />
                            </div>
                        </div>
                        <h3>Artisan Bread</h3>
                        <p className="farmer">Heritage Bakery</p>
                        <p className="price">$7.99/loaf</p>
                    </div>
                </div>
                <div className="view-all">
                    <Link to="/shop" className="btn btn-outline">View All Products</Link>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>What Our Customers Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="quote-icon">"</div>
                        <p className="quote">Fresh Connect has completely changed how I shop for groceries. The quality and taste of everything I've ordered is incredible!</p>
                        <p className="customer">- Sarah L., Pullman</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="quote-icon">"</div>
                        <p className="quote">I love supporting local farmers and knowing exactly where my food comes from. The convenience of home delivery is a huge bonus!</p>
                        <p className="customer">- Michael T., Moscow</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="quote-icon">"</div>
                        <p className="quote">As a small farm owner, Fresh Connect has helped us reach more customers than ever. Great platform for both farmers and buyers!</p>
                        <p className="customer">- Emma R., Green Valley Farm</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta">
                <div className="cta-content">
                    <h2>Ready to taste the difference?</h2>
                    <p>Browse our selection of fresh, locally-sourced products today.</p>
                    <Link to="/shop" className="btn btn-primary btn-large">Shop Now</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;