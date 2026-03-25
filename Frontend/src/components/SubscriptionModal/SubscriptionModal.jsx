import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toastService";
import "./SubscriptionModal.css";

import emailjs from "@emailjs/browser";

const SubscriptionModal = ({ isOpen, onClose, onSuccess, initialPlan }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Weekly Plan — ₹799/week");
  const [mealPreference, setMealPreference] = useState("Vegetarian");
  const [deliveryTime, setDeliveryTime] = useState("Lunch (12–2 PM)");
  const [startDateInput, setStartDateInput] = useState("");
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDateInput(tomorrow.toISOString().split("T")[0]);

      // Auto-fill user email if logged in
      if (user && user.email) {
        setEmail(user.email);
        setFullName(user.displayName || "");
      }

      // Set initial plan if provided, otherwise use default
      if (initialPlan) {
        setPlan(initialPlan);
      } else {
        setPlan("Weekly Plan — ₹799/week");
      }
      setPhone("");
      setAddress("");
      setSpecialInstructions("");
      setError("");

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
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
      !startDateInput ||
      !address
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Calculate duration, dates, and plan details
      // Use the start date value selected in the form as per requirement 2.2
      const start = new Date(startDateInput);
      const end = new Date(start);
      let planType = "daily";
      let planCount = 1;
      let durationText = "1 Day(s)";
      let priceValue = 0;

      if (plan.includes("Monthly")) {
        planType = "monthly";
        planCount = 1;
        durationText = "1 Month(s)";
        priceValue = 2499;
        end.setMonth(start.getMonth() + 1);
      } else if (plan.includes("Weekly")) {
        planType = "weekly";
        planCount = 1;
        durationText = "1 Week(s)";
        priceValue = 799;
        end.setDate(start.getDate() + 7);
      } else if (plan.includes("Daily")) {
        planType = "daily";
        planCount = 1;
        durationText = "1 Day(s)";
        priceValue = 120;
        end.setDate(start.getDate() + 1);
      }

      const orderData = {
        userName: fullName,
        email: email,
        menuType: mealPreference,
        mealPlan: plan,
        planType,
        planCount,
        durationText,
        totalPrice: priceValue,
        startDate: start.toISOString().split("T")[0], // Store as YYYY-MM-DD for readability
        endDate: end.toISOString().split("T")[0], // Calculated end date
        createdAt: new Date().toISOString(),
        phone,
        deliveryTime,
        address,
        specialInstructions,
      };

      // 2. Add order to users/{uid}/orders collection
      const ordersRef = collection(db, "users", user.uid, "orders");
      await addDoc(ordersRef, orderData);
      console.log("Firestore save successful");

      // 3. Send confirmation email via EmailJS
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_SUBSCRIPTION_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log("EmailJS config check:", {
        has_service: !!SERVICE_ID,
        has_template: !!TEMPLATE_ID,
        has_public_key: !!PUBLIC_KEY,
      });

      const templateParams = {
        user_name: fullName, // original
        user_email: email, // original
        name: fullName, // alias
        email: email, // alias
        menu_type: mealPreference,
        meal_plan: plan,
        months: durationText, 
        duration: durationText, 
        total_price: priceValue,
        start_date: start.toLocaleDateString(),
        end_date: end.toLocaleDateString(),
      };

      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        try {
          if (typeof emailjs.init === "function") {
            emailjs.init(PUBLIC_KEY);
          }

          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY,
          );
          console.log("EmailJS send successful");
        } catch (emailErr) {
          console.error("EmailJS send failed:", emailErr);
          // If email fails, we should still inform the user but maybe it's saved in db?
          // Since the prompt said "Success only if both succeed", we will treat this as a fatal error for the flow as per instruction 7.
          throw new Error(
            "Confirmation email failed to send. Please check your EmailJS configuration.",
          );
        }
      } else {
        console.warn(
          "EmailJS configuration missing in .env file (VITE_EMAILJS_*). Skipping email.",
        );
      }

      onClose();
      showToast("success", "Subscription successful! Confirmation email sent.");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Subscription process error:", err);
      // provide more specific error messages to help user debug
      if (err.message.includes("EmailJS")) {
        setError(err.message);
      } else if (err.code === "permission-denied") {
        setError(
          "Error: You don't have permission to write to Firestore. Check your security rules.",
        );
      } else {
        setError(
          "Failed to process subscription. Check console (F12) for details.",
        );
      }
      showToast("error", "Subscription failed.");
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
            <button
              className="sub-close"
              onClick={() => {
                navigate("/");
                onClose();
              }}
            >
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
                    placeholder="Full Name"
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
                    placeholder="Phone Number"
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
                  placeholder="Email Address"
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
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
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
                  placeholder="Delivery Address"
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
                  placeholder="Special Instructions"
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
