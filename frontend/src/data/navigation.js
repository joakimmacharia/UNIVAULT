import {
  LayoutDashboard, Search, CalendarCheck, MessageSquare,
  Heart, Wallet, User, Home, Building2, PlusSquare,
} from 'lucide-react';

/**
 * Single source of truth for app navigation.
 * Used by the desktop sidebar (DashboardLayout) and the mobile drawer (Navbar),
 * so the phone never ends up with fewer destinations than the desktop shell.
 */
export const studentNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/storage', label: 'Find Storage', icon: Search },
  { to: '/bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/payments', label: 'Payments', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/become-landlord', label: 'Become a Landlord', icon: Home },
];

export const landlordNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-listings', label: 'My Listings', icon: Building2 },
  { to: '/list-space', label: 'List a Space', icon: PlusSquare },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  { to: '/payments', label: 'Payments', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

export const getAppNav = (role) => (role === 'landlord' ? landlordNav : studentNav);
