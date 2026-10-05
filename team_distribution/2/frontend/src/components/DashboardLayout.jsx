import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { DAVID } from '../data/assets';
import { getAppNav } from '../data/navigation';
import { useAuth } from '../context/AuthContext';
import Avatar from './ui/Avatar';

/**
 * Two-column app shell with sticky sidebar navigation.
 * On mobile the sidebar collapses (see responsive.css) and the
 * global Navbar hamburger provides navigation.
 */
const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const nav = getAppNav(user?.role);

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
