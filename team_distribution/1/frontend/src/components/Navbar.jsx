import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, MapPin, Search, HelpCircle, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAppNav } from '../data/navigation';
import { DAVID } from '../data/assets';
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
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const appNav = getAppNav(user?.role);

  // Close the drawer on any navigation, including hardware-back on Android.
  useEffect(() => setOpen(false), [pathname]);

  // Don't let the page behind the drawer scroll while it's open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
    /* The drawer is a SIBLING of .navbar, never a child: .navbar uses
       backdrop-filter, which makes it the containing block for fixed-position
       descendants, and would collapse the drawer to the height of the bar. */
    <>
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
    </nav>

      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        {isAuthenticated ? (
          <>
            <div className="drawer-user">
              <Avatar src={user?.avatar} name={user?.full_name} size="md" />
              <div>
                <strong>{user?.full_name || 'Your account'}</strong>
                <span>{user?.email}</span>
              </div>
            </div>

            <div className="drawer-label">Menu</div>
            {appNav.map(({ to, label, icon: Icon, badge }) => (
              <NavLink key={to} to={to} end={to === '/dashboard'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}>
                <Icon />
                <span>{label}</span>
                {badge ? <span className="nav-link-badge">{badge}</span> : null}
              </NavLink>
            ))}

            <div className="drawer-label">More</div>
            <NavLink to="/assistant" className="nav-link" onClick={() => setOpen(false)}>
              <Sparkles />
              <span>Chat with {DAVID.name}</span>
            </NavLink>
            <NavLink to="/help" className="nav-link" onClick={() => setOpen(false)}>
              <HelpCircle />
              <span>Support</span>
            </NavLink>

            <button className="btn btn-outline btn-full" style={{ marginTop: 16 }} onClick={handleLogout}>
              <LogOut size={16} /> Log out
            </button>
          </>
        ) : (
          <>
            {menu.map(renderLink)}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link to="/login" className="btn btn-outline btn-full" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setOpen(false)}>Get Started</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
