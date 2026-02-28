import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">TiffinBox</div>
            <p className="footer-desc">
              Fresh, hygienic, and home-style meals delivered to your doorstep every day.
              Nourish your body, simplify your life.
            </p>
            <div className="social-links">
              <a href="#" className="social-btn" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-btn" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-btn" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="social-btn" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h6>Quick Links</h6>
            <a href="#features">Why TiffinBox</a>
            <a href="#plans">Meal Plans</a>
            <a href="#menu">Today's Menu</a>
            <a href="#how">How It Works</a>
            <a href="#reviews">Reviews</a>
          </div>

          <div className="footer-col">
            <h6>Plans</h6>
            <a href="#plans">Daily Plan</a>
            <a href="#plans">Weekly Plan</a>
            <a href="#plans">Monthly Plan</a>
            <a href="#">Custom Plan</a>
            <a href="#">Corporate Plans</a>
          </div>

          <div className="footer-col">
            <h6>Support</h6>
            <a href="#help">FAQ</a>
            <a href="#">Track Order</a>
            <a href="#">Cancel/Pause</a>
            <a href="#">Refund Policy</a>
            <a href="#help">Contact Us</a>
          </div>

          <div className="footer-col">
            <h6>Contact</h6>
            <a href="tel:+919876543210">
              <i className="bi bi-telephone" style={{ marginRight: '8px' }}></i>
              +91 98765 43210
            </a>
            <a href="mailto:hello@tiffinbox.in">
              <i className="bi bi-envelope" style={{ marginRight: '8px' }}></i>
              hello@tiffinbox.in
            </a>
            <a href="#">
              <i className="bi bi-geo-alt" style={{ marginRight: '8px' }}></i>
              Serving Ahmedabad, Surat & Rajkot
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 TiffinBox. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
