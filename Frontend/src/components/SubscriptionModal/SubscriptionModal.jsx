import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SubscriptionModal.css';

const SubscriptionModal = ({ isOpen, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '700px' }}
        >
          <div className="sub-modal-header">
            <h3>🍱 Start Your Subscription</h3>
            <button className="sub-close" onClick={onClose}>×</button>
          </div>
          <div className="sub-modal-body">
            <form className="sub-form" onSubmit={handleSubmit}>
              <div className="sub-form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="e.g. Priya Sharma" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com" />
              </div>

              <div className="sub-form-row">
                <div className="form-group">
                  <label className="form-label">Select Plan</label>
                  <select className="form-select">
                    <option>Daily Plan — ₹120/meal</option>
                    <option defaultValue>Weekly Plan — ₹799/week</option>
                    <option>Monthly Plan — ₹2,499/month</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Meal Preference</label>
                  <select className="form-select">
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Low-Carb / Keto</option>
                    <option>High Protein</option>
                    <option>No Preference</option>
                  </select>
                </div>
              </div>

              <div className="sub-form-row">
                <div className="form-group">
                  <label className="form-label">Delivery Time</label>
                  <select className="form-select">
                    <option>Breakfast (7–9 AM)</option>
                    <option>Lunch (12–2 PM)</option>
                    <option>Dinner (7–9 PM)</option>
                    <option>Lunch + Dinner</option>
                    <option>All 3 Meals</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="House/Flat No., Street, Area, City, PIN"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions (Optional)</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. No onion, less spicy, extra roti..."
                />
              </div>

              <button type="submit" className="btn-submit-order">
                Confirm Subscription →
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;
