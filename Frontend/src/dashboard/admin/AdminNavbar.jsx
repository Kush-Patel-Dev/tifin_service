import React from 'react';
import { FiSearch, FiMenu } from 'react-icons/fi';

const AdminNavbar = ({ theme, setTheme, toggleSidebar, adminData }) => {
  return (
    <header className="admin-navbar">
      <div className="admin-nav-left">
        <button className="admin-mobile-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <div className="admin-search">
          <FiSearch />
          <input type="text" placeholder="Search here" />
        </div>
      </div>
      
      <div className="admin-nav-right">
        <label className="theme-switch" title="Toggle Dark/Light Mode">
          <input 
            type="checkbox" 
            checked={theme === 'dark'} 
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <span className="slider round"></span>
        </label>
        
        <div className="admin-profile">
          <div className="admin-profile-info">
            <span className="name">Hi, <b>{adminData?.name || adminData?.email?.split('@')[0] || 'Admin'}</b></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
