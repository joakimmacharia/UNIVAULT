import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Search, CalendarCheck, MessageSquare,
  Heart, Wallet, User, Home, ChevronRight, Building2, PlusSquare,
} from 'lucide-react';
import { DAVID } from '../data/assets';
import { useAuth } from '../context/AuthContext';
import Avatar from './ui/Avatar';

const studentNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/storage', label: 'Find Storage', icon: Search },
  { to: '/bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/payments', label: 'Payments', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/become-landlord', label: 'Become a Landlord', icon: Home },
];

const landlordNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-listings', label: 'My Listings', icon: Building2 },
  { to: '/list-space', label: 'List a Space', icon: PlusSquare },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  { to: '/payments', label: 'Payments', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

/**
 * Two-column app shell with sticky sidebar navigation.
 * On mobile the sidebar collapses (see responsive.css) and the
 * global Navbar hamburger provides navigation.
 */
const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const nav = user?.role === 'landlord' ? landlordNav : studentNav;

  return (
  <div className="shell">
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {nav.map(({ to, label, icon: Icon, badge }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            <Icon />
            <span>{label}</span>
            {badge ? <span className="side-badge">{badge}</span> : null}
          </NavLink>
        ))}
      </nav>

      <NavLink to="/assistant" className="side-assistant">
        <Avatar src={DAVID.img} name={DAVID.name} size="md" online />
        <span className="txt">
          <strong>Need help?</strong>
          <span>Chat with {DAVID.name} <ChevronRight size={13} /></span>
        </span>
      </NavLink>
    </aside>

    <main className="shell-main">{children}</main>
  </div>
  );
};

export default DashboardLayout;
