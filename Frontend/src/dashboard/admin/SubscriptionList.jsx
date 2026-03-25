import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FiEdit2, FiX, FiSearch, FiTrash2 } from 'react-icons/fi';
import './SubscriptionList.css';

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [formData, setFormData] = useState({ 
    userName: '', 
    planName: '', 
    mealType: '', 
    endDate: '' 
  });

  // Filter & Search
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const subsMap = useRef(new Map());

  useEffect(() => {
    const usersRef = collection(db, 'users');
    let orderUnsubs = [];
    
    const mainUnsub = onSnapshot(usersRef, (snapshot) => {
      // Clear all active order listeners and reset state if top-level users change
      orderUnsubs.forEach(unsub => unsub());
      orderUnsubs = [];
      subsMap.current.clear();
      
      if (snapshot.empty) {
        setSubscriptions([]);
        setLoading(false);
        return;
      }

      let pendingUsers = snapshot.docs.length;

        snapshot.forEach(userDoc => {
          const uid = userDoc.id;
          const userData = userDoc.data();
          
          // Construct Full Name: Try 'name' field first, then firstName + lastName
          let userName = userData.name;
          if (!userName) {
            const first = userData.firstName || '';
            const last = userData.lastName || '';
            userName = `${first} ${last}`.trim();
          }
          if (!userName) userName = userData.email || 'Unknown User';
          
          const userEmail = userData.email || 'N/A';

        const ordersRef = collection(db, 'users', uid, 'orders');
        
        const orderUnsub = onSnapshot(ordersRef, (orderSnap) => {
          const userOrders = [];
          orderSnap.forEach(orderDoc => {
            const orderData = orderDoc.data();
            
            const subToken = {
              id: orderDoc.id,
              uid: uid, // Needed to route updates back to the correct subcollection
              userName,
              userEmail,
              planName: orderData.planName || 'N/A',
              mealType: orderData.mealType || 'N/A',
              price: orderData.price || 0,
              startDate: orderData.startDate || null,
              endDate: orderData.endDate || null,
              status: orderData.status || 'active',
              address: orderData.address || 'N/A'
            };
            
            // Automatic Expiry Evaluation Logging
            if (subToken.endDate) {
              const end = new Date(subToken.endDate);
              const today = new Date();
              today.setHours(0,0,0,0);
              
              if (today > end && subToken.status !== 'expired') {
                updateDoc(doc(db, 'users', uid, 'orders', orderDoc.id), { status: 'expired' }).catch(console.error);
                subToken.status = 'expired';
              } else if (today <= end && subToken.status === 'expired') {
                updateDoc(doc(db, 'users', uid, 'orders', orderDoc.id), { status: 'active' }).catch(console.error);
                subToken.status = 'active';
              }
            }
            
            userOrders.push(subToken);
          });
          
          // Update the global map for this user
          subsMap.current.set(uid, userOrders);
          
          // Flatten all users' orders into a single list
          const allSubs = [];
          subsMap.current.forEach(orders => allSubs.push(...orders));
          
          setSubscriptions([...allSubs].sort((a,b) => {
            if (!a.startDate || !b.startDate) return 0;
            return new Date(b.startDate) - new Date(a.startDate); // Sort newest first
          }));

          pendingUsers--;
          if (pendingUsers <= 0) setLoading(false);
        });
        
        orderUnsubs.push(orderUnsub);
      });
      
      // Fallback timeout in case subcollections are deeply empty triggering no ready events
      setTimeout(() => setLoading(false), 2000);
    });

    return () => {
      mainUnsub();
      orderUnsubs.forEach(unsub => unsub());
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    if (dateStr.seconds) {
      return new Date(dateStr.seconds * 1000).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
    }
    return new Date(dateStr).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
  };

  const openEditModal = (sub) => {
    setEditingSub(sub);
    setFormData({
      userName: sub.userName || '',
      planName: sub.planName || '',
      mealType: sub.mealType || '',
      endDate: sub.endDate || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editingSub) return;
      
      // Split name for firstName/lastName sync
      const nameParts = formData.userName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');

      // Update User Name and parts in Parent Document
      await updateDoc(doc(db, 'users', editingSub.uid), {
        name: formData.userName,
        firstName: firstName,
        lastName: lastName
      });

      // Update Order Details in Subcollection
      await updateDoc(doc(db, 'users', editingSub.uid, 'orders', editingSub.id), {
        planName: formData.planName,
        mealType: formData.mealType,
        endDate: formData.endDate
      });
      setIsEditModalOpen(false);
      setEditingSub(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription order.");
    }
  };

  const handleDelete = async (sub) => {
    if (window.confirm(`Are you certain you want to delete ${sub.userName}'s subscription?`)) {
      try {
        await deleteDoc(doc(db, 'users', sub.uid, 'orders', sub.id));
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  // Derived Stats
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length;
  const monthlyRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((total, s) => {
      const p = Number(s.price);
      // Temporary: Only add actual direct prices (which are currently 0)
      if (!isNaN(p) && p > 0) return total + p;
      return total + 0;
    }, 0);

  // Apply Search and Filters
  const filteredSubs = subscriptions.filter(sub => {
    // Basic filter match
    if (filterStatus !== 'All' && sub.status !== filterStatus.toLowerCase()) return false;
    
    // Search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!sub.userName.toLowerCase().includes(q) && 
          !sub.userEmail.toLowerCase().includes(q) &&
          !sub.planName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="admin-dashboard-wrapper" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="admin-page-title">
        <h2>Subscriptions Management</h2>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-card-title">Total Subscriptions</span>
          <span className="stat-card-value">{subscriptions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">Active Plans</span>
          <span className="stat-card-value" style={{color: '#22c55e'}}>{activeCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">Expired Plans</span>
          <span className="stat-card-value" style={{color: '#ef4444'}}>{expiredCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-title">Est. Monthly Revenue</span>
          <span className="stat-card-value" style={{color: '#3b82f6'}}>${monthlyRevenue}</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="subscription-header-actions">
           <div className="subscription-search">
             <FiSearch />
             <input 
               type="text" 
               placeholder="Search Name, Email or Plan..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="subscription-filters">
             {['All', 'Active', 'Expired'].map(f => (
               <button 
                 key={f}
                 className={`filter-btn ${filterStatus === f ? 'active' : ''}`}
                 onClick={() => setFilterStatus(f)}
               >{f}</button>
             ))}
           </div>
        </div>

        {loading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)'}}>Scanning User Orders...</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Plan Name</th>
                  <th>Meal Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.length > 0 ? filteredSubs.map((sub) => {
                  return (
                    <tr key={sub.id}>
                      <td style={{fontWeight: 500}}>{sub.userName}</td>
                      <td style={{color: 'var(--admin-text-muted)'}}>{sub.userEmail}</td>
                      <td>{sub.planName}</td>
                      <td><span style={{textTransform: 'capitalize'}}>{sub.mealType}</span></td>
                      <td>{formatDate(sub.startDate)}</td>
                      <td>{formatDate(sub.endDate)}</td>
                      <td>
                        {sub.status === 'expired' ? (
                          <span className="badge badge-red">Expired</span>
                        ) : (
                          <span className="badge badge-green">Active</span>
                        )}
                      </td>
                      <td>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button className="admin-action-btn edit" onClick={() => openEditModal(sub)} title="Edit Plan"><FiEdit2 /></button>
                          <button className="admin-action-btn delete" onClick={() => handleDelete(sub)} title="Delete Plan"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="8" style={{textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)'}}>
                      No subscriptions found matching criteria.
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
               <h3 style={{margin: 0}}>Edit Order Details</h3>
               <button onClick={() => setIsEditModalOpen(false)} style={{background: 'none', border:'none', fontSize:'1.5rem', cursor: 'pointer', color: 'var(--admin-text-main)'}}><FiX/></button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>User Name</label>
               <input className="admin-input" required name="userName" value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Plan Name</label>
               <input className="admin-input" required name="planName" value={formData.planName} onChange={(e) => setFormData({...formData, planName: e.target.value})} />

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>Meal Type</label>
               <select className="admin-input" required name="mealType" value={formData.mealType} onChange={(e) => setFormData({...formData, mealType: e.target.value})}>
                 <option value="veg">Veg</option>
                 <option value="mix">Mix</option>
               </select>

               <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem'}}>End Date (Expiration)</label>
               <input className="admin-input" required type="date" name="endDate" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />

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

export default SubscriptionList;
