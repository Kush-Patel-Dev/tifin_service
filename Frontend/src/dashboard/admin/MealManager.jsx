import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiX } from 'react-icons/fi';

const MealManager = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const mealsRef = collection(db, 'meals');
    const unsubscribe = onSnapshot(mealsRef, (snapshot) => {
      const mealsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeals(mealsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const openModal = (meal = null) => {
    if (meal) {
      setEditingId(meal.id);
      setFormData({
        name: meal.name || '',
        price: meal.price || '',
        description: meal.description || '',
        image: meal.image || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', description: '', image: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const storage = getStorage();
        const imageRef = ref(storage, `meals/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const mealData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        image: imageUrl
      };

      if (editingId) {
        await updateDoc(doc(db, 'meals', editingId), mealData);
      } else {
        await addDoc(collection(db, 'meals'), mealData);
      }

      setIsModalOpen(false);
    } catch(err) {
      console.error(err);
      alert("Error saving meal.");
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this meal?")) {
      await deleteDoc(doc(db, 'meals', id));
    }
  };

  return (
    <div className="admin-dashboard-wrapper" style={{ animation: 'fadeIn 0.4s ease-out', position: 'relative' }}>
      <div className="admin-page-title">
        <h2>Meal Manager</h2>
        <button className="admin-btn" onClick={() => openModal()}><FiPlus /> Add New Meal</button>
      </div>

      <div className="admin-grid-4">
        {loading ? (
          <p style={{color: 'var(--admin-text-muted)'}}>Loading meals...</p>
        ) : meals.length > 0 ? meals.map(meal => (
          <div key={meal.id} className="admin-card" style={{padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
            <div style={{height: 180, backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {meal.image ? (
                <img src={meal.image} alt={meal.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <FiImage size={40} color="var(--admin-text-muted)" />
              )}
            </div>
            <div style={{padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                 <h3 style={{margin: 0, fontSize: '1.1rem'}}>{meal.name}</h3>
                 <span style={{color: 'var(--admin-accent)', fontWeight: 700}}>${meal.price}</span>
              </div>
              <p style={{margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)', flex: 1}}>{meal.description}</p>
              
              <div style={{display: 'flex', gap: '0.5rem'}}>
                 <button className="admin-btn-outline" style={{flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => openModal(meal)}>
                   <FiEdit2 style={{marginRight: '0.25rem'}} /> Edit
                 </button>
                 <button className="admin-btn-outline" style={{padding: '0.5rem', borderRadius: '6px', color: '#ef4444', borderColor: 'currentcolor', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => handleDelete(meal.id)}>
                   <FiTrash2 />
                 </button>
              </div>
            </div>
          </div>
        )) : (
          <p style={{color: 'var(--admin-text-muted)', gridColumn: '1 / -1'}}>No meals found. Add one!</p>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="admin-card" style={{width: '100%', maxWidth: '500px', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
               <h3 style={{margin: 0}}>{editingId ? 'Edit Meal' : 'Add New Meal'}</h3>
               <button onClick={() => setIsModalOpen(false)} style={{background: 'none', border:'none', fontSize:'1.5rem', cursor: 'pointer', color: 'var(--admin-text-main)'}}><FiX/></button>
            </div>
            
            <form onSubmit={handleSubmit}>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Meal Name</label>
               <input className="admin-input" required name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Standard Tiffin" />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Price ($)</label>
               <input className="admin-input" type="number" required name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 150" />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Description</label>
               <textarea className="admin-input" rows="3" required name="description" value={formData.description} onChange={handleInputChange} placeholder="Meal details..." />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Meal Image</label>
               <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem'}}>
                 <input type="file" accept="image/*" onChange={handleFileChange} style={{flex: 1, fontSize:'0.85rem', color: 'var(--admin-text-main)'}} />
                 {(formData.image || imageFile) && <div style={{width: 40, height: 40, borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--admin-bg)'}}>
                    {imageFile ? <span style={{fontSize: '0.7rem', display:'block', padding: '4px'}}>File</span> : <img src={formData.image} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                 </div>}
               </div>

               <button type="submit" className="admin-btn" style={{width: '100%', justifyContent: 'center'}} disabled={uploading}>
                 {uploading ? 'Saving...' : 'Save Meal'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealManager;
