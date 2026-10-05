import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span className="logo-icon">◈</span>
          UNIVAULT
        </Link>

        <button
          className={`hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          id="hamburger-btn"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" id="nav-dashboard" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <Link to="/storage" className="nav-link" id="nav-browse" onClick={() => setMobileOpen(false)}>
                Browse Storage
              </Link>
              <Link to="/bookings" className="nav-link" id="nav-bookings" onClick={() => setMobileOpen(false)}>
                My Bookings
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link nav-admin" id="nav-admin" onClick={() => setMobileOpen(false)}>
                  🛡️ Admin
                </Link>
              )}
              <div className="nav-divider"></div>
              <Link to="/profile" className="nav-link nav-profile" id="nav-profile" onClick={() => setMobileOpen(false)}>
                <span className="profile-avatar">{user?.full_name?.charAt(0) || 'U'}</span>
                {user?.full_name || 'Profile'}
              </Link>
              <button className="btn btn-outline btn-sm" id="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
