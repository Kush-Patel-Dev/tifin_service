import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "./admin.css";

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem('adminTheme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminRef = doc(db, "admin", "main_admin");
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists() && adminSnap.data().email === user.email) {
            setIsAdmin(true);
            setAdminData(adminSnap.data());
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h2>Loading Admin Panel...</h2>
      </div>
    );
  }

  if (!isAdmin) {
    // If we've finished loading and aren't an admin
    // If user is actually logged out (null), go to landing page
    if (!auth.currentUser) {
      return <Navigate to="/" replace />;
    }
    // If logged in but not admin, go to their regular dashboard
    return <Navigate to="/dashboard/profile" replace />;
  }

  return (
    <div className={`admin-container theme-${theme}`}>
      {/* Overlay for mobile */}
      <div 
        className={`admin-sidebar-overlay ${!sidebarCollapsed ? 'active' : ''}`} 
        onClick={() => setSidebarCollapsed(true)}
      ></div>

      <AdminSidebar collapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="admin-main-wrapper">
        <AdminNavbar 
          theme={theme} 
          setTheme={setTheme} 
          adminData={adminData}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
