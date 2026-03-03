import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("signin");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
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
        >
          <div className="auth-modal-header">
            <h3>🍱 {mode === "signin" ? "Welcome Back!" : "Join TiffinBox"}</h3>
            <button className="auth-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="auth-modal-body">
            <div className="auth-tabs">
              <button
                className={`auth-tab${mode === "signin" ? " active" : ""}`}
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
              <button
                className={`auth-tab${mode === "signup" ? " active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Priya"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Sharma"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              {mode === "signup" && (
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              )}

              <button type="submit" className="btn-auth-submit">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>

              <div className="auth-divider">or</div>

              <button type="button" className="btn-google">
                <i className="bi bi-google"></i>
                Continue with Google
              </button>

              <p className="auth-footer-text">
                {mode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <a onClick={() => setMode("signup")}>Sign Up</a>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <a onClick={() => setMode("signin")}>Sign In</a>
                  </>
                )}
              </p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
