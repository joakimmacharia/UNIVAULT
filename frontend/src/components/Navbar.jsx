import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, MapPin, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './ui/Logo';
import Avatar from './ui/Avatar';

const menu = [
  { to: '/storage', label: 'Find Storage' },
  { to: '/#how-it-works', label: 'How it Works' },
  { to: '/become-landlord', label: 'For Landlords' },
  { to: '/#featured', label: 'Pricing' },
  { to: '/help', label: 'Support' },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/login');
  };

  const renderLink = (m) =>
    m.to.includes('#') ? (
      <a key={m.label} href={m.to} className="nav-link" onClick={() => setOpen(false)}>{m.label}</a>
    ) : (
      <NavLink key={m.label} to={m.to} end={m.end}
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        onClick={() => setOpen(false)}>
        {m.label}
      </NavLink>
    );

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Logo />
        <div className="nav-links">{menu.map(renderLink)}</div>

        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span className="loc-select"><MapPin /> Juja</span>
              <Link to="/messages" className="nav-icon-btn" aria-label="Notifications">
                <Bell />
                <span className="nav-badge">2</span>
              </Link>
              <Link to="/profile" className="nav-profile">
                <Avatar src={user?.avatar} name={user?.full_name} size="sm" />
                <span className="nav-profile-name">{user?.full_name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/storage" className="nav-icon-btn" aria-label="Search storage"><Search /></Link>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        {menu.map(renderLink)}
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</NavLink>
            <button className="btn btn-outline btn-full" style={{ marginTop: 16 }} onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link to="/login" className="btn btn-outline btn-full" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-full" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
