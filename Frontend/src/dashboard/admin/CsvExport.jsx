import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Papa from 'papaparse';
import { FiDownload } from 'react-icons/fi';

const CsvExport = () => {
  const [exportingUsers, setExportingUsers] = useState(false);
  const [exportingSubs, setExportingSubs] = useState(false);

  const downloadCsv = (csvData, filename) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportUsers = async () => {
    setExportingUsers(true);
    try {
       const snapshot = await getDocs(collection(db, 'users'));
       const users = snapshot.docs.map(doc => ({
           id: doc.id,
           name: doc.data().name || '',
           email: doc.data().email || '',
           plan: doc.data().plan || 'Free',
           status: doc.data().status || 'active',
           createdAt: doc.data().createdAt?.seconds ? new Date(doc.data().createdAt.seconds * 1000).toLocaleString() : ''
       }));
       const csv = Papa.unparse(users);
       downloadCsv(csv, "users_export.csv");
    } catch(e) {
       console.error(e);
       alert("Export failed.");
    }
    setExportingUsers(false);
  };

  const handleExportSubscriptions = async () => {
    setExportingSubs(true);
    try {
       const snapshot = await getDocs(collection(db, 'users'));
       const subs = [];
       
       const fetchPromises = snapshot.docs.map(async (userDoc) => {
           const uid = userDoc.id;
           const userData = userDoc.data();
           const userName = userData.name || userData.email || 'Unknown';
           const userEmail = userData.email || 'N/A';
           
           const ordersSnap = await getDocs(collection(db, 'users', uid, 'orders'));
           ordersSnap.forEach(orderDoc => {
               const data = orderDoc.data();
               subs.push({
                   "User Name": userName,
                   "Email": userEmail,
                   "Plan Name": data.planName || 'N/A',
                   "Meal Type": data.mealType || 'N/A',
                   "Price ($)": data.price || 0,
                   "Status": data.status || 'active',
                   "Start Date": data.startDate || '',
                   "End Date": data.endDate || ''
               });
           });
       });
       
       await Promise.all(fetchPromises);
       
       const csv = Papa.unparse(subs);
       downloadCsv(csv, "subscriptions_export.csv");
    } catch(e) {
       console.error(e);
       alert("Export failed.");
    }
    setExportingSubs(false);
  };

  return (
    <div className="admin-dashboard-wrapper" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="admin-page-title">
        <h2>CSV Export Center</h2>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{fontSize: '3rem', color: 'var(--admin-accent)', marginBottom: '1rem'}}><FiDownload /></div>
          <h3 style={{marginBottom: '0.5rem'}}>Users Database</h3>
          <p style={{color: 'var(--admin-text-muted)', marginBottom: '2rem'}}>Export all registered users, their basic information and status into a CSV format.</p>
          <button className="admin-btn" onClick={handleExportUsers} disabled={exportingUsers}>
             {exportingUsers ? 'Exporting...' : 'Export Users CSV'}
          </button>
        </div>

        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{fontSize: '3rem', color: '#22c55e', marginBottom: '1rem'}}><FiDownload /></div>
          <h3 style={{marginBottom: '0.5rem'}}>Active Subscriptions</h3>
          <p style={{color: 'var(--admin-text-muted)', marginBottom: '2rem'}}>Export data for all users who have an active or expired meal plan subscription.</p>
          <button className="admin-btn" style={{backgroundColor: '#22c55e'}} onClick={handleExportSubscriptions} disabled={exportingSubs}>
             {exportingSubs ? 'Exporting...' : 'Export Subscriptions CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvExport;
