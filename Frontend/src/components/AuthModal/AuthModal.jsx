import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../firebase/firebase";
import { showToast } from "../../utils/toastService";
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
  const [showpassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      // Clear all form fields when modal opens
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setShowPassword(false);
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
    setShowPassword(false);
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
        // Set displayName to first + last name so the header shows the user's name
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }

        // Save user profile data to Firestore
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn(
            "Could not save to Firestore (likely missing database or permissions), but Auth succeeded.",
            dbErr,
          );
        }

        console.log("Sign Up successful:", userCredential.user);
      } else {
        // Sign In with Email & Password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("Sign In successful:", userCredential.user);
        // Show success toast (login)
        try {
          showToast("success", "Login Successful! Welcome back.");
        } catch (e) {
          // noop - don't break auth flow if toast fails
        }
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
          if (
            err.code === "permission-denied" ||
            (err.message && err.message.includes("permission"))
          ) {
            setError(
              "Firestore error: Missing permissions. Please enable Firestore Database in the Firebase Console and update Security Rules to allow writes.",
            );
          } else {
            setError(err.message);
          }
      }

      // For sign-in failures show a generic invalid credentials toast only
      // for credential-related errors so we don't surface toasts for other
      // flows (e.g., permission issues) or when a user simply isn't logged in.
      if (mode === "signin") {
        const credentialErrors = new Set([
          "auth/wrong-password",
          "auth/user-not-found",
          "auth/invalid-credential",
        ]);
        const code = err && err.code;
        if (credentialErrors.has(code)) {
          try {
            showToast("error", "Invalid email or password. Please try again.");
          } catch (e) {
            // noop
          }
        }
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

      // For Google Sign In, split displayName into firstName and lastName if possible
      const names = user.displayName ? user.displayName.split(" ") : ["", ""];
      const gFirstName = names[0];
      const gLastName = names.slice(1).join(" ");

      // Save user profile data to Firestore (using merge: true so we don't overwrite if they already exist)
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            firstName: gFirstName,
            lastName: gLastName,
            email: user.email,
            phone: user.phoneNumber || "",
            createdAt: new Date().toISOString(), // Or serverTimestamp()
          },
          { merge: true },
        );
      } catch (dbErr) {
        console.warn(
          "Could not save to Firestore (likely missing database or permissions), but Google Auth succeeded.",
          dbErr,
        );
      }

      console.log("Google Sign In successful:", user);

      onClose();
    } catch (err) {
      console.error("Google Auth error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        if (
          err.code === "permission-denied" ||
          (err.message && err.message.includes("permission"))
        ) {
          setError(
            "Firestore error: Missing permissions. Please enable Firestore Database in the Firebase Console and update Security Rules to allow writes.",
          );
        } else {
          setError(
            `Google sign in failed: ${err.message || err.code || "Unknown error"}`,
          );
        }
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
                <div style={{ position: "relative" }}>
                  <input
                    className="form-input"
                    type={showpassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showpassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      color: "#999",
                      userSelect: "none",
                    }}
                  >
                    <i
                      className={`bi ${showpassword ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </span>
                </div>
                {mode === "signin" && (
                  <div style={{ textAlign: "right", marginTop: "6px" }}>
                    <Link
                      to="/forgot-password"
                      onClick={onClose}
                      style={{ color: "var(--saffron)", fontSize: "0.9rem" }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
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
