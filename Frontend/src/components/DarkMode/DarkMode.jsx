import { useEffect, useState } from 'react';
import './DarkMode.css';

const DarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Read saved theme from localStorage on initial render
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // Apply theme to <html> element and save to localStorage
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={`toggle-icon sun ${isDark ? 'active' : ''}`}>☀️</span>
      <span className={`toggle-icon moon ${!isDark ? 'active' : ''}`}>🌙</span>
      <span className={`toggle-slider ${isDark ? 'dark' : ''}`}></span>
    </button>
  );
};

export default DarkMode;
