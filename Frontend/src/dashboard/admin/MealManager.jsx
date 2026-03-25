import React, { useState, useEffect } from "react";
// IMPORT FIRESTORE INSTANCE FROM config file
import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage } from "react-icons/fi";


/**
 * DEBUGGING CHECKLIST:
 * 1. Check Firestore rules allow write: allow read, write: if true; (for testing)
 * 2. Check db import path: ensure it points to firebase.js
 * 3. Check async/await usage: ensure all Firestore calls are awaited
 * 4. Check network errors in console: Press F12 to see real-time logs
 */

const MealManager = () => {
  // --- STATES ---
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true); // Data fetching state
  const [uploading, setUploading] = useState(false); // Form submission state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    menuType: "",
    planType: "",
    mealName: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const mealImages = [
    { label: "Poha", value: "/images/meals/poha.jpg" },
    { label: "Thali", value: "/images/meals/thali.jpg" },
    { label: "Chole Bhature", value: "/images/meals/Chloe-Bhature.jpg" },
    { label: "Biryani", value: "/images/meals/biryani.jpg" },
    { label: "Dal Tadka", value: "/images/meals/india-food-dal-tadka.jpg" },
    { label: "Khichdi", value: "/images/meals/khichdi.jpg" },
    { label: "Paneer Butter Masala", value: "/images/meals/aesthetic-paneer-butter-masala_864588-20269.jpg" },
    { label: "Idli Chutney", value: "/images/meals/professional-food-photography-of-idli-with-chutney_1177187-245461.jpg" },
    { label: "Stuffed Paratha", value: "/images/meals/spicy-potato-stuffed-paratha-popular-street-food-aloo-paratha-alu-paratha-picture_1020697-123521.jpg" },
    { label: "Roti Sabzi Combo", value: "/images/meals/roti-sabzi combo.jpg" },
    { label: "Roti Sabzi New", value: "/images/meals/roti-sabzi-new.png" },
    { label: "Upma", value: "/images/meals/o0k32qmg_upma_625x300_10_July_23.jpg" },
    { label: "Soup & Salad", value: "/images/meals/soup-saladbowl.jpg" },
    { label: "Bowl Special", value: "/images/meals/bowl.png" },
    { label: "Healthy Item 1", value: "/images/meals/it1.png" },
    { label: "Misc OIP", value: "/images/meals/OIP.jpg" }
  ];



  // --- FETCH DATA ---
  const fetchMeals = async () => {
    console.log("Fetching meals from Firestore...");
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "meals"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Success: Fetched", data.length, "meals");
      setMeals(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error fetching meals: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image preview helper (Requirement 10)
  const imagePreview = formData.imageUrl;


  const openModal = (meal = null) => {
    if (meal) {
      setEditingId(meal.id);
      setFormData({
        menuType: meal.menuType || "",
        planType: meal.planType || "",
        mealName: meal.mealName || "",
        price: meal.price || "",
        description: meal.description || "",
        imageUrl: meal.imageUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        menuType: "",
        planType: "",
        mealName: "",
        price: "",
        description: "",
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };


  // --- CRUD OPERATIONS ---
  /**
   * NOTE: If you see CORS errors in the console during image upload:
   * 1. Go to Firebase Console > Storage > Rules.
   * 2. Set rules to: allow read, write: if true; (TEMP FOR DEV)
   * 3. Ensure you have restarted your 'npm run dev' after any firebase.js changes.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Requirement 8: prevent page reload
    console.log("LOG: before upload - Form submission started");
    
    // Validation
    if (!formData.mealName || !formData.price || !formData.menuType || !formData.planType) {
      alert("Please fill all required fields.");
      return;
    }

    setUploading(true);

    try {
      let downloadURL = formData.imageUrl || "";


      // 2. Prepare Data for Firestore
      const mealData = {
        menuType: formData.menuType,
        planType: formData.planType,
        mealName: formData.mealName,
        price: Number(formData.price),
        description: formData.description || "",
        imageUrl: downloadURL,
        updatedAt: serverTimestamp(),
        isActive: true
      };

      console.log("LOG: before Firestore save - Data mapped");

      // 3. Firestore CRUD (Requirement 7, 8, 9)
      if (editingId) {
        const mealRef = doc(db, "meals", editingId);
        await updateDoc(mealRef, mealData);
        console.log("LOG: after Firestore save - Update Success");
        alert("Meal Updated!");
      } else {
        await addDoc(collection(db, "meals"), mealData);
        console.log("LOG: after Firestore save - Create Success");
        alert("Meal Added!");
      }

      // Cleanup
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        menuType: "",
        planType: "",
        mealName: "",
        price: "",
        description: "",
        imageUrl: "",
      });

      
      await fetchMeals();

    } catch (error) {
      console.error("LOG: CRITICAL FAIL -", error);
      alert("Error: " + error.message);
    } finally {
      // Requirement 4: Ensure loading state resets
      setUploading(false);
      console.log("LOG: Process ended.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this meal?")) {
      try {
        console.log("Deleting document:", id);
        await deleteDoc(doc(db, "meals", id));
        console.log("Delete successful");
        await fetchMeals();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Delete failed: " + error.message);
      }
    }
  };

  // --- UI JSX ---
  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-page-title">
        <h2>Meal Manager</h2>
        <button className="admin-btn-add" onClick={() => openModal()}>
          <FiPlus /> Add New Meal
        </button>
      </div>

      <div className="admin-grid-4">
        {loading ? (
          <p>Loading meals...</p>
        ) : meals.length > 0 ? (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="admin-card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div
                style={{
                  height: "160px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {meal.imageUrl ? (
                  <img
                    src={meal.imageUrl}
                    alt={meal.mealName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <FiImage size={40} color="#ccc" />
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{meal.mealName}</h3>
                <p style={{ fontSize: "0.85rem", color: "gray" }}>
                  {meal.menuType} — {meal.planType}
                </p>
                <p style={{ fontWeight: "bold" }}>₹{meal.price}</p>
                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <button
                    onClick={() => openModal(meal)}
                    className="admin-btn-outline"
                    style={{ flex: 1 }}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="admin-btn-outline"
                    style={{ borderColor: "red", color: "red" }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No meals found.</p>
        )}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="admin-card"
            style={{
              width: "100%",
              maxWidth: "450px",
              padding: "2rem",
              backgroundColor: "#1f2937", // Solid background to prevent transparency
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              opacity: 1, // Explicitly set opacity to 1
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                alignItems: "center",
              }}
            >
              <h3>{editingId ? "Edit Meal" : "Add New Meal"}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Menu Type</label>
              <select
                name="menuType"
                className="admin-input"
                required
                value={formData.menuType}
                onChange={handleInputChange}
              >
                <option value="">Select Menu</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>

              <label>Plan Type</label>
              <select
                name="planType"
                className="admin-input"
                required
                value={formData.planType}
                onChange={handleInputChange}
              >
                <option value="">Select Plan</option>
                <option value="Daily Plan">Daily Plan</option>
                <option value="Weekly Plan">Weekly Plan</option>
                <option value="Monthly Plan">Monthly Plan</option>
              </select>

              <label>Meal Name</label>
              <input
                type="text"
                name="mealName"
                className="admin-input"
                required
                value={formData.mealName}
                onChange={handleInputChange}
                placeholder="Ex: Panneer Thali"
              />

              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                className="admin-input"
                required
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ex: 120"
              />

              <label>Description</label>
              <textarea
                name="description"
                className="admin-input"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Meal details..."
              />

              <label>Meal Image</label>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <select
                  name="imageUrl"
                  className="admin-input"
                  required
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  style={{ fontSize: "0.8rem", flex: 1 }}
                >
                  <option value="">Select Image</option>
                  {mealImages.map((img) => (
                    <option key={img.value} value={img.value}>
                      {img.label}
                    </option>
                  ))}
                </select>
                {imagePreview && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>


              <button
                type="submit"
                className="admin-btn"
                style={{
                  width: "fit-content",
                  minWidth: "100%",
                  margin: "1.5rem auto 0 auto",
                  display: "flex",
                  justifyContent: "center",
                }}
                disabled={uploading}
              >
                {uploading
                  ? "Saving..."
                  : editingId
                    ? "Update Meal"
                    : "Save Meal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealManager;
