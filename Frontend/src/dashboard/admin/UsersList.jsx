import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FiEdit2, FiTrash2, FiShieldOff, FiX } from 'react-icons/fi';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', plan: '' });

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRestrict = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await updateDoc(userRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user.id);
    const currentName = user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
    setFormData({
      name: currentName,
      email: user.email || '',
      plan: user.plan || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split name for consistency across system
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');

      await updateDoc(doc(db, 'users', editingUser), {
        name: formData.name,
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        plan: formData.plan
      });
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="admin-dashboard-wrapper" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="admin-page-title">
        <h2>Users Management</h2>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)'}}>Loading users...</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <div style={{width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--admin-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                          {(user.name || user.firstName || user.email || 'U')[0].toUpperCase()}
                        </div>
                        <span style={{fontWeight: 500}}>
                          {user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || user.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <span className={`badge ${user.plan ? 'badge-active' : 'badge-pending'}`}>
                        {user.plan || 'Free'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'blocked' ? 'badge-red' : 'badge-green'}`}>
                        {user.status === 'blocked' ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="admin-action-btn edit" onClick={() => openEditModal(user)} title="Edit"><FiEdit2 /></button>
                      <button className="admin-action-btn delete" onClick={() => handleDelete(user.id)} title="Delete"><FiTrash2 /></button>
                      <button className="admin-action-btn restrict" onClick={() => handleRestrict(user.id, user.status)} title={user.status === 'blocked' ? 'Unblock' : 'Restrict'}><FiShieldOff /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)'}}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="admin-card" style={{width: '100%', maxWidth: '400px', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
               <h3 style={{margin: 0}}>Edit User Data</h3>
               <button onClick={() => setIsEditModalOpen(false)} style={{background: 'none', border:'none', fontSize:'1.5rem', cursor: 'pointer', color: 'var(--admin-text-main)'}}><FiX/></button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Full Name</label>
               <input className="admin-input" required name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Email Address</label>
               <input className="admin-input" required type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Subscription Plan</label>
               <select className="admin-input" name="plan" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}>
                 <option value="">No Plan (Free)</option>
                 <option value="Basic Plan">Basic Plan</option>
                 <option value="Standard Plan">Standard Plan</option>
                 <option value="Premium Plan">Premium Plan</option>
               </select>

               <button type="submit" className="admin-btn" style={{width: '100%', justifyContent: 'center'}}>
                 Save Changes
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
