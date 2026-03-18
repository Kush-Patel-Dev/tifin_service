import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiCreditCard, FiMail, FiBox, FiDownload, FiLogOut, FiMenu
} from 'react-icons/fi';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
    { name: "Subscriptions", path: "/admin/subscriptions", icon: <FiCreditCard /> },
    { name: "Inquiries", path: "/admin/inquiries", icon: <FiMail /> },
    { name: "Meals", path: "/admin/meals", icon: <FiBox /> },
    { name: "CSV Export", path: "/admin/csv", icon: <FiDownload /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : 'mobile-open'}`}>
      <div className="admin-sidebar-logo">
        <button className="admin-sidebar-toggle-btn desktop-only" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <span className="admin-sidebar-logo-text">
          <span style={{ color: '#ff7a00' }}>Tiffin</span> 
          <span style={{ marginLeft: '5px' }}>Admin</span>
        </span>
      </div>
      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => item.name !== 'Analytics' && isActive ? "admin-menu-item active" : "admin-menu-item"}
            end={item.path === "/admin/dashboard"}
            onClick={handleLinkClick}
          >
            {item.icon}
            <span className="admin-menu-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div style={{ padding: '1rem', borderTop: '1px solid var(--admin-border)' }}>
        <button 
          onClick={() => {
            handleLogout();
            handleLinkClick();
          }}
          className="admin-menu-item" 
          style={{ width: '100%', color: '#ef4444' }}
        >
          <FiLogOut />
          <span className="admin-menu-text">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
