import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";
import "./DashboardLayout.css";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        if (!user || !user.email) return;
        const adminRef = doc(db, "admin", "main_admin");
        const snap = await getDoc(adminRef);
        if (!mounted) return;
        const adminEmail =
          snap && snap.exists()
            ? String(snap.data().email).toLowerCase().trim()
            : null;
        const userEmail = String(user.email).toLowerCase().trim();
        setIsAdmin(!!(adminEmail && userEmail === adminEmail));
      } catch (e) {
        console.warn("Could not determine admin status", e);
      }
    };
    checkAdmin();
    return () => (mounted = false);
  }, [user]);

  const sidebarItems = [
    { path: "/dashboard/profile", label: "Profile", icon: FaUser },
    ...(!isAdmin
      ? [
          {
            path: "/dashboard/my-applications",
            label: "My Applications",
            icon: FaClipboardList,
          },
        ]
      : []),
  ];

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            Tiffin<span>Box</span>
          </Link>
          <div className="sidebar-controls">
            <button className="sidebar-collapse-btn" onClick={toggleCollapse}>
              <FaBars />
            </button>
            <button className="sidebar-close" onClick={closeSidebar}>
              <FaTimes />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <Icon className="sidebar-icon" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-home" onClick={closeSidebar}>
            <FaHome className="sidebar-icon" />

            {!sidebarCollapsed && <span>Home</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`dashboard-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        {/* Mobile Header */}
        <header className="dashboard-header">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1 className="dashboard-title">
            {location.pathname === "/dashboard/profile"
              ? "Profile"
              : location.pathname === "/dashboard/my-applications"
                ? "My Applications"
                : "Dashboard"}
          </h1>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default DashboardLayout;
