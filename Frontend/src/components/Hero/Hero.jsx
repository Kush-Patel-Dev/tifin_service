import { motion } from 'framer-motion';
import './Hero.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Hero = ({ onOrderNow }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-bg-pattern"></div>
      <div className="hero-dots"></div>
      <div className="hero-circle"></div>
      <div className="container hero-content">
        <div className="hero-row">
          <motion.div
            className="hero-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-badge" variants={itemVariants}>
              🍱 Fresh · Hygienic · Homestyle
             
              <div>
              🍱 Get instant services
              </div>
            </motion.div>
            
            <motion.h1 variants={itemVariants}>
              Delicious Meals<br />
              Delivered to Your<br />
              <em>Doorstep Daily</em>
            </motion.h1>
            <motion.p className="hero-desc" variants={itemVariants}>
              Subscribe to our handcrafted tiffin service and enjoy nutritious, home-style meals
              freshly prepared each day. No cooking, no hassle — just wholesome food.
            </motion.p>
            <motion.div className="hero-actions" variants={itemVariants}>
              <a href="#plans" className="btn-primary" onClick={(e) => {
                e.preventDefault();
                document.querySelector('#plans')?.scrollIntoView({ behavior: 'smooth' });
              }}>Explore Meal Plans</a>
              <a href="#menu" className="btn-outline" onClick={(e) => {
                e.preventDefault();
                document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
              }}>View Today's Menu</a>
            </motion.div>
            <motion.div className="hero-stats" variants={itemVariants}>
              <div className="stat-item">
                <div className="stat-num">5K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">50+</div>
                <div className="stat-label">Menu Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">4.9★</div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-image-wrap">
              <div className="hero-main-img">🍛</div>
              <div className="hero-food-card">
                <div className="food-card-icon">🕐</div>
                <div>
                  <div className="food-card-title">Lunch Delivery</div>
                  <div className="food-card-sub">Ready by 12:30 PM</div>
                </div>
              </div>
              <div className="hero-rating-card">
                <div className="rating-num">4.9</div>
                <div className="rating-stars">★★★★★</div>
                <div className="rating-label">Customer Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
