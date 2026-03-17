import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collectionGroup, onSnapshot } from 'firebase/firestore';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inquiriesQuery = collectionGroup(db, 'contact_us');
    const unsubscribe = onSnapshot(inquiriesQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.ref.parent.parent ? doc.ref.parent.parent.id : 'unknown',
        ...doc.data()
      }));
      list.sort((a, b) => {
        let dateA = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        let dateB = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return dateB - dateA;
      });
      setInquiries(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    if (dateObj.seconds) {
      return new Date(dateObj.seconds * 1000).toLocaleDateString();
    }
    return new Date(dateObj).toLocaleDateString();
  };

  return (
    <div className="admin-dashboard-wrapper" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="admin-page-title">
        <h2>Customer Inquiries</h2>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)'}}>Loading inquiries...</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length > 0 ? inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td style={{fontWeight: 500}}>{inq.name || 'N/A'}</td>
                    <td>{inq.email || 'N/A'}</td>
                    <td><span style={{fontWeight: 600}}>{inq.subject || 'N/A'}</span></td>
                    <td style={{maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={inq.message}>
                      {inq.message || 'N/A'}
                    </td>
                    <td style={{color: 'var(--admin-text-muted)', fontSize: '0.85rem'}}>
                      {formatDate(inq.createdAt)}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)'}}>
                      No inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryList;
