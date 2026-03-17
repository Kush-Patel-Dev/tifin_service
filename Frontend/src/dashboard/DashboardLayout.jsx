import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const sidebarItems = [
    { path: "/dashboard/profile", label: "Profile", icon: FaUser },
    {
      path: "/dashboard/my-applications",
      label: "My Applications",
      icon: FaClipboardList,
    },
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
