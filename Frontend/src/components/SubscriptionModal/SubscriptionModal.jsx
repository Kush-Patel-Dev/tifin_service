import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toastService";
import "./SubscriptionModal.css";

const SubscriptionModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Weekly Plan — ₹799/week");
  const [mealPreference, setMealPreference] = useState("Vegetarian");
  const [deliveryTime, setDeliveryTime] = useState("Lunch (12–2 PM)");
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow.toISOString().split("T")[0]);

      // Auto-fill user email if logged in
      if (user && user.email) {
        setEmail(user.email);
        setFullName(user.displayName || "");
      }

      // Reset other fields
      setPhone("");
      setAddress("");
      setSpecialInstructions("");
      setError("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Ensure user is authenticated at the time of submitting
    if (!auth.currentUser) {
      showToast("error", "Please login first to subscribe.");
      return;
    }

    // Check required fields
    if (
      !fullName ||
      !phone ||
      !email ||
      !plan ||
      !mealPreference ||
      !deliveryTime ||
      !startDate ||
      !address
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        fullName,
        phone,
        email,
        plan,
        mealPreference,
        deliveryTime,
        startDate,
        address,
        specialInstructions,
        createdAt: new Date().toISOString(),
      };

      // Add order to users/{uid}/orders collection
      const ordersRef = collection(db, "users", user.uid, "orders");
      await addDoc(ordersRef, orderData);

      onClose();
      showToast("success", "Subscription successful!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error creating subscription:", err);
      setError("Failed to process subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          style={{ maxWidth: "700px" }}
        >
          <div className="sub-modal-header">
            <h3>🍱 Start Your Subscription</h3>
            <button className="sub-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="sub-modal-body">
            {error && (
              <div
                className="auth-error"
                style={{
                  color: "#ff6b6b",
                  background: "rgba(255, 107, 107, 0.1)",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
            <form className="sub-form" onSubmit={handleSubmit}>
              <div className="sub-form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="sub-form-row">
                <div className="form-group">
                  <label className="form-label">Select Plan *</label>
                  <select
                    className="form-select"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    required
                  >
                    <option value="Daily Plan — ₹120/meal">
                      Daily Plan — ₹120/meal
                    </option>
                    <option value="Weekly Plan — ₹799/week">
                      Weekly Plan — ₹799/week
                    </option>
                    <option value="Monthly Plan — ₹2,499/month">
                      Monthly Plan — ₹2,499/month
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Meal Preference *</label>
                  <select
                    className="form-select"
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value)}
                    required
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Low-Carb / Keto">Low-Carb / Keto</option>
                    <option value="High Protein">High Protein</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </div>
              </div>

              <div className="sub-form-row">
                <div className="form-group">
                  <label className="form-label">Delivery Time *</label>
                  <select
                    className="form-select"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    required
                  >
                    <option value="Breakfast (7–9 AM)">
                      Breakfast (7–9 AM)
                    </option>
                    <option value="Lunch (12–2 PM)">Lunch (12–2 PM)</option>
                    <option value="Dinner (7–9 PM)">Dinner (7–9 PM)</option>
                    <option value="Lunch + Dinner">Lunch + Dinner</option>
                    <option value="All 3 Meals">All 3 Meals</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // updated min logic so it doesn't break if startDate changes
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="House/Flat No., Street, Area, City, PIN"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Special Instructions (Optional)
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. No onion, less spicy, extra roti..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-submit-order"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? "Processing..." : "Confirm Subscription →"}
              </button>

              {!user && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontSize: "0.85rem",
                    color: "#ff6b6b",
                  }}
                >
                  Please sign in to subscribe.
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;
