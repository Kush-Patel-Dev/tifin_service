import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { FaUserCircle } from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user's profile information from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.warn("No user data found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Fallback if not logged in
  if (!auth.currentUser && !userData) {
    return (
      <div className="text-center mt-5">
        <h4>Please sign in to view your profile.</h4>
      </div>
    );
  }

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="profile-wrapper">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUserCircle />
            </div>
            <h2 className="profile-name">
              {isEditing
                ? `${firstName || userData?.firstName}`
                : userData?.firstName}{" "}
              {isEditing
                ? `${lastName || userData?.lastName}`
                : userData?.lastName}
            </h2>
            <p className="profile-subtitle">Manage your account information</p>
          </div>

          <div className="profile-details">
            {statusMessage.text && (
              <div className={`status-message ${statusMessage.type}`}>
                {statusMessage.text}
              </div>
            )}

            <div className="detail-item">
              <label>Email Address</label>
              <span>{userData?.email || auth.currentUser?.email || "N/A"}</span>
            </div>

            {!isEditing && (
              <>
                <div className="detail-item">
                  <label>Phone Number</label>
                  <span>{userData?.phone || "Not provided"}</span>
                </div>
              </>
            )}

            {isEditing && (
              <>
                <div className="detail-item form-group">
                  <label>First Name</label>
                  <input
                    className="edit-input form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="detail-item form-group">
                  <label>Last Name</label>
                  <input
                    className="edit-input form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="detail-item form-group">
                  <label>Phone</label>
                  <input
                    className="edit-input form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="profile-actions actions">
            {!isEditing ? (
              <button
                className="btn-edit-profile"
                onClick={() => {
                  // Populate edit fields and enter edit mode
                  setFirstName(userData?.firstName || "");
                  setLastName(userData?.lastName || "");
                  setPhone(userData?.phone || "");
                  setStatusMessage({ type: "", text: "" });
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn-save-profile btn-edit-profile"
                  onClick={async () => {
                    setStatusMessage({ type: "", text: "" });
                    if (!auth.currentUser) {
                      setStatusMessage({
                        type: "error",
                        text: "You must be signed in to update your profile.",
                      });
                      return;
                    }

                    const uid = auth.currentUser.uid;
                    const userRef = doc(db, "users", uid);
                    const updated = {
                      firstName: firstName || "",
                      lastName: lastName || "",
                      phone: phone || "",
                    };

                    try {
                      await updateDoc(userRef, updated);
                      // Update local state to reflect changes immediately
                      setUserData((prev) => ({ ...(prev || {}), ...updated }));
                      setStatusMessage({
                        type: "success",
                        text: "Profile updated successfully.",
                      });
                      setIsEditing(false);
                    } catch (err) {
                      console.error("Error updating profile:", err);
                      setStatusMessage({
                        type: "error",
                        text: "Failed to update profile. Check console for details.",
                      });
                    }
                  }}
                >
                  Save Changes
                </button>

                <button
                  className="btn-cancel-profile btn-edit-profile"
                  onClick={() => {
                    setIsEditing(false);
                    setStatusMessage({ type: "", text: "" });
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
