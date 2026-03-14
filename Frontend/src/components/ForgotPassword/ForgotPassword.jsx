import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  const validateEmail = (value) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(
        "Password reset email has been sent. Please check your inbox.",
      );
      setEmail("");
    } catch (err) {
      console.error("Reset email error:", err);
      // Friendly error messages
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("The email address is not valid.");
      } else {
        setError("Failed to send reset email. Please try again later.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Your Password?</h2>
        <p className="forgot-subtitle">
          Enter your registered email address and we will send you a password
          reset link.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-input"
            aria-label="Email Address"
          />

          {error && <div className="forgot-error">{error}</div>}
          {success && <div className="forgot-success">{success}</div>}

          <button
            type="submit"
            className="forgot-submit"
            disabled={sending}
            aria-busy={sending}
          >
            {sending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="forgot-footer">
          <Link to="/" className="forgot-back">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
