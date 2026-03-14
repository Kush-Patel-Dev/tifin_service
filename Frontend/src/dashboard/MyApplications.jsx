import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import {
  FaClipboardList,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUtensils,
} from "react-icons/fa";
import "./MyApplications.css";

const MyApplications = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user's orders from Firestore
          const ordersQuery = query(
            collection(db, "users", user.uid, "orders"),
          );
          const ordersSnapshot = await getDocs(ordersQuery);

          const ordersData = [];
          ordersSnapshot.forEach((doc) => {
            ordersData.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "status-active",
      pending: "status-pending",
      completed: "status-completed",
    };

    return (
      <span
        className={`status-badge ${statusClasses[status] || "status-pending"}`}
      >
        {status || "Pending"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="applications-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="applications-header">
        <h2>My Applications</h2>
        <p>Track your meal subscription orders and delivery details</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FaClipboardList className="empty-icon" />
          <h3>No applications yet</h3>
          <p>You have not subscribed to any meal plans yet.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="application-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <div className="card-title">
                  <FaUtensils className="card-icon" />
                  <h3>{order.plan || "Meal Plan"}</h3>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="card-content">
                <div className="detail-row">
                  <FaUtensils className="detail-icon" />
                  <div>
                    <label>Meal Preference</label>
                    <span>{order.mealPreference || "Not specified"}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaClock className="detail-icon" />
                  <div>
                    <label>Delivery Time</label>
                    <span>{order.deliveryTime || "Not specified"}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaCalendarAlt className="detail-icon" />
                  <div>
                    <label>Start Date</label>
                    <span>{order.startDate || "Not specified"}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div>
                    <label>Delivery Address</label>
                    <span>{order.address || "Not provided"}</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="detail-row">
                    <div className="special-instructions">
                      <label>Special Instructions</label>
                      <span>{order.specialInstructions}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyApplications;
