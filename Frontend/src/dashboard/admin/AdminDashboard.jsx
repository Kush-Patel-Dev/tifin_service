import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { FiUsers, FiCreditCard, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// Static data filters or other constants can go here
const COLORS = ['#ff7a00', '#22c55e', '#3b82f6', '#ef4444', '#a855f7'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    expiredPlans: 0,
    revenue: 0
  });

  const [dynamicChartData, setDynamicChartData] = useState({
    lineData: [],
    barData: [],
    pieData: []
  });

  useEffect(() => {
    const usersRef = collection(db, 'users');
    let orderUnsubs = [];
    
    const statsMap = new Map();
    let totalUsersCount = 0;

    const updateDashboardData = () => {
       let active = 0, expired = 0, rev = 0;
       const planCounts = {};
       const monthlyRevenue = {};
       const registerDays = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };

       statsMap.forEach((u, uid) => {
          active += u.active;
          expired += u.expired;
          rev += u.revenue;

          // Register Days for Bar Chart
          if (u.createdAt) {
            const date = u.createdAt.seconds ? new Date(u.createdAt.seconds * 1000) : new Date(u.createdAt);
            const day = date.toLocaleString('default', { weekday: 'short' });
            if (registerDays[day] !== undefined) registerDays[day]++;
          }

          // Process plan counts for Pie Chart
          u.orders.forEach(o => {
            const pName = o.planName || 'Other';
            planCounts[pName] = (planCounts[pName] || 0) + 1;

            // Process monthly revenue for Line Chart
            if (o.startDate) {
              const date = o.startDate.seconds ? new Date(o.startDate.seconds * 1000) : new Date(o.startDate);
              const month = date.toLocaleString('default', { month: 'short' });
              if (o.status !== 'expired') {
                // Temporary: Set to 0 until Phase 2 payments are implemented
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + 0;
              }
            }
          });
       });

       // Create dynamic chart data
       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
       const currentLineData = months.map(m => ({
         name: m,
         revenue: monthlyRevenue[m] || 0
       })).filter(m => m.revenue > 0 || months.indexOf(m.name) <= new Date().getMonth());

       const currentBarData = Object.entries(registerDays).map(([name, users]) => ({ name, users }));
       const currentPieData = Object.entries(planCounts).map(([name, value]) => ({ name, value }));
       
       setStats({
          totalUsers: totalUsersCount,
          activePlans: active,
          expiredPlans: expired,
          revenue: rev
       });

       setDynamicChartData({
         lineData: currentLineData,
         pieData: currentPieData,
         barData: currentBarData
       });
    };

    const mainUnsub = onSnapshot(usersRef, (snapshot) => {
      orderUnsubs.forEach(unsub => unsub());
      orderUnsubs = [];
      statsMap.clear();
      
      totalUsersCount = snapshot.size;

      if (snapshot.empty) {
         updateDashboardData();
         return;
      }

      snapshot.forEach(userDoc => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        const ordersRef = collection(db, 'users', uid, 'orders');
        
        const orderUnsub = onSnapshot(ordersRef, (orderSnap) => {
           let uActive = 0, uExpired = 0, uRev = 0;
           const userOrdersData = [];
           
           orderSnap.forEach(orderDoc => {
              const data = orderDoc.data();
              const orderInfo = { ...data, id: orderDoc.id };
              userOrdersData.push(orderInfo);

              if (data.status === 'expired') {
                 uExpired++;
              } else {
                 uActive++;
                 const p = Number(data.price);
                 if (!isNaN(p) && p > 0) {
                     uRev += p;
                 } else {
                     // Temporary: Set to 0 until Phase 2 payments are implemented
                     uRev += 0;
                 }
              }
           });
           
           statsMap.set(uid, { active: uActive, expired: uExpired, revenue: uRev, orders: userOrdersData, createdAt: userData.createdAt });
           updateDashboardData();
        });
        
        orderUnsubs.push(orderUnsub);
      });
    });

    return () => {
      mainUnsub();
      orderUnsubs.forEach(unsub => unsub());
    };
  }, []);

  return (
    <div className="admin-dashboard-wrapper" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div className="admin-page-title">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Dashboard</h2>

        </div>
      </div>

      {/* STATS CARDS */}
      <div className="admin-grid-4">
        <div className="admin-card admin-stat-card">
          <div className="admin-stat-icon"><FiUsers /></div>
          <div className="admin-stat-info">
            <h4>{stats.totalUsers}</h4>
            <p>Total Users</p>
            <span className="admin-stat-indicator positive">Live Data</span>
          </div>
        </div>
        <div className="admin-card admin-stat-card">
          <div className="admin-stat-icon" style={{color: '#22c55e', background: 'rgba(34,197,94,0.1)'}}><FiCreditCard /></div>
          <div className="admin-stat-info">
            <h4>{stats.activePlans}</h4>
            <p>Active Plans</p>
            <span className="admin-stat-indicator positive">Live Data</span>
          </div>
        </div>
        <div className="admin-card admin-stat-card">
          <div className="admin-stat-icon" style={{color: '#ef4444', background: 'rgba(239,68,68,0.1)'}}><FiAlertCircle /></div>
          <div className="admin-stat-info">
            <h4>{stats.expiredPlans}</h4>
            <p>Expired Plans</p>
            <span className="admin-stat-indicator negative">Live Data</span>
          </div>
        </div>
        <div className="admin-card admin-stat-card">
          <div className="admin-stat-icon" style={{color: '#3b82f6', background: 'rgba(59,130,246,0.1)'}}><FiDollarSign /></div>
          <div className="admin-stat-info">
            <h4>₹{stats.revenue}</h4>
            <p>Est. Monthly Revenue</p>
            <span className="admin-stat-indicator positive">Live Data</span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="admin-grid-2">
        <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem'}}>Total Revenue</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={dynamicChartData.lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="var(--admin-border)" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--admin-text-muted)" axisLine={false} tickLine={false} />
                <YAxis stroke="var(--admin-text-muted)" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{stroke: 'var(--admin-border)', strokeWidth: 1, strokeDasharray: '5 5'}} contentStyle={{backgroundColor: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', borderRadius: '8px'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
            <h3 style={{marginTop: 0, marginBottom: 0, fontSize: '1.1rem'}}>Customer Map</h3>
            <select className="admin-input" style={{width: 'auto', marginBottom: 0, padding: '0.3rem 0.8rem'}}>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={dynamicChartData.barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barCategoryGap="30%">
                <CartesianGrid stroke="var(--admin-border)" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--admin-text-muted)" axisLine={false} tickLine={false} />
                <YAxis stroke="var(--admin-text-muted)" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--admin-bg)', opacity: 0.5}} contentStyle={{backgroundColor: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', borderRadius: '8px'}} />
                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                  {dynamicChartData.barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff7a00' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-grid-1">
        <div className="admin-card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
            <h3 style={{marginTop: 0, marginBottom: 0, fontSize: '1.1rem'}}>Subscription Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dynamicChartData.pieData.length > 0 ? dynamicChartData.pieData : [
                    { name: 'Active Plans', value: stats.activePlans > 0 ? stats.activePlans : 1 },
                    { name: 'Expired Plans', value: stats.expiredPlans },
                    { name: 'No Plan', value: stats.totalUsers - stats.activePlans - stats.expiredPlans }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {dynamicChartData.pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1.5rem'}}>
            <div style={{textAlign: 'center'}}>
               <h4 style={{margin: '0 0 0.25rem 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem'}}>Active Subscriptions</h4>
               <p style={{margin: 0, fontWeight: 700, fontSize: '1.25rem'}}>{stats.activePlans}</p>
            </div>
            <div style={{textAlign: 'center'}}>
               <h4 style={{margin: '0 0 0.25rem 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem'}}>Expired Plans</h4>
               <p style={{margin: 0, fontWeight: 700, fontSize: '1.25rem'}}>{stats.expiredPlans}</p>
            </div>
            <div style={{textAlign: 'center'}}>
               <h4 style={{margin: '0 0 0.25rem 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem'}}>Total Scale</h4>
               <p style={{margin: 0, fontWeight: 700, fontSize: '1.25rem'}}>{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
