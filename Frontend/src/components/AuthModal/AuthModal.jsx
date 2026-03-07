import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose, initialMode = "signin" }) => {
  const [mode, setMode] = useState(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
    }
  }, [isOpen, initialMode]);

  // Reset form fields when switching tabs
  useEffect(() => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setError("");
  }, [mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Sign Up with Email & Password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("Sign Up successful:", userCredential.user);
      } else {
        // Sign In with Email & Password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("Sign In successful:", userCredential.user);
      }
      onClose();
    } catch (err) {
      console.error("Auth error:", err.message);
      // User-friendly error messages
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Try signing in.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Sign In successful:", user);

      // Store Google user information
      setGoogleUser({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      onClose();
    } catch (err) {
      console.error("Google Auth error:", err.message);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
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

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Priya"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </button>

              <div className="auth-divider">or</div>

              <button
                type="button"
                className="btn-google"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <i className="bi bi-google"></i>
                Continue with Google
              </button>

              {googleUser && (
                <div
                  className="google-user-info"
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "rgba(66, 133, 244, 0.1)",
                    border: "1px solid rgba(66, 133, 244, 0.3)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                    }}
                  >
                    {googleUser.photoURL && (
                      <img
                        src={googleUser.photoURL}
                        alt="Profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: "bold", color: "#4285f4" }}>
                        {googleUser.displayName}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>
                        {googleUser.email}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#999",
                          marginTop: "4px",
                        }}
                      >
                        Google ID: {googleUser.uid}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
