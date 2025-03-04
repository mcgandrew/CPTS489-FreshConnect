import '../About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>Our Story</h1>
        <p className="subtitle">Building connections between local farmers and conscious consumers</p>
      </section>

      <section className="about-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            Fresh Connect was born from a simple idea: to create a bridge between 
            small-scale local farmers and community members seeking fresh, sustainably 
            grown food. We believe that everyone deserves access to nutritious, 
            locally-produced food, and that small farms deserve fair compensation 
            for their hard work and dedication.
          </p>
          <p>
            Our platform aims to strengthen local food systems, reduce food miles, 
            and foster connections between producers and consumers in the Palouse region.
          </p>
        </div>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Sustainability</h3>
            <p>We prioritize environmentally responsible farming practices and minimal packaging to reduce our ecological footprint.</p>
          </div>
          <div className="value-card">
            <h3>Transparency</h3>
            <p>We believe in honest relationships, clear sourcing information, and open communication across our platform.</p>
          </div>
          <div className="value-card">
            <h3>Community</h3>
            <p>We're building more than a marketplace—we're nurturing a community that values local agriculture and food security.</p>
          </div>
          <div className="value-card">
            <h3>Quality</h3>
            <p>We work only with farmers and producers who meet our standards for exceptional quality and sustainable practices.</p>
          </div>
        </div>
      </section>

      <section className="about-how-it-works">
        <h2>How Fresh Connect Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Local Sourcing</h3>
            <p>We partner with small farms and artisans within a 100-mile radius of the Palouse region.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Quality Control</h3>
            <p>We personally visit each farm and ensure all products meet our high standards for quality and sustainability.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Fair Pricing</h3>
            <p>We work with farmers to set prices that provide them fair compensation while remaining accessible to consumers.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Efficient Delivery</h3>
            <p>Our logistics system ensures fresh products reach customers within hours of harvest, minimizing waste and maximizing freshness.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <p className="team-intro">We're a group of passionate individuals committed to transforming how our community accesses local food.</p>
        <div className="team-grid">
          {/* You can add team members here with photos and bios if desired */}
          <div className="team-member">
            <img src="/images/pfp.jpg" alt="Team Member Isaiah" />
            <h3>Isaiah Doan</h3>
            <p className="member-title">Co-Founder & Position</p>
            <p>Brief bio about the team member's background and passion for local food systems.</p>
          </div>
          {/* Add more team members as needed */}
        </div>
      </section>

      <section className="about-join">
        <h2>Join Our Community</h2>
        <p>Whether you're a local farmer looking to reach more customers or a consumer seeking the freshest local produce, we'd love to welcome you to the Fresh Connect community.</p>
        <div className="join-buttons">
          <a href="/shop" className="btn btn-primary">Start Shopping</a>
          <a href="/sell" className="btn btn-secondary">Become a Vendor</a>
        </div>
      </section>
    </div>
  );
};

export default About;