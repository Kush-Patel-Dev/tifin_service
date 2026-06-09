import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import DarkMode from "../DarkMode/DarkMode";
import { useAuth } from "../../context/AuthContext";
import { getNameFromEmail } from "../../utils/nameHelper";
import "./Navbar.css";

const navItems = [
  { label: "Why Us", href: "#features" },
  { label: "Meal Plans", href: "#plans" },
  { label: "Menu", href: "#menu" },
  { label: "How It Works", href: "#how" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Help", href: "#help" },
];

const Navbar = ({ onSignIn, onOrderNow }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await logout();
      } catch (err) {
        console.error("Logout failed:", err.message);
      }
    }
  };

  // Check if we're on the home page for smooth scrolling
  const isHomePage = location.pathname === "/";

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="mainNav">
      <div className="container navbar-inner">
        <Link
          className="brand-logo"
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setMenuOpen(false);
          }}
        >
          {/* Light Mode Logo (Dark Text) */}
          <img src="/food-box-logo-white-team.svg" alt="Food Box Logo" className="brand-logo-img logo-light" />
          {/* Dark Mode Logo (White Text) */}
          <img src="/food-box-logo.svg" alt="Food Box Logo" className="brand-logo-img logo-dark" />
        </Link>

        <div className={`nav-center${menuOpen ? " open" : ""}`}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                {isHomePage ? (
                  <a
                    className="nav-link"
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link className="nav-link" to={`/${item.href.slice(1)}`}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            {user ? (
              <>
                <span className="user-greeting">
                  Hi, {user.displayName || getNameFromEmail(user.email)}
                </span>
                <Link to="/dashboard/profile" className="btn-profile-card" title="Profile">
                  <FiUser />
                </Link>
                <button 
                  className="btn-logout-card" 
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <button className="btn-sign-in" onClick={onSignIn}>
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <DarkMode />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
