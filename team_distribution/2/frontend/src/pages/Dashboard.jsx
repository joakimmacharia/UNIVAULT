import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarClock, PackageCheck, ClipboardList, Wallet,
  Search, MessageSquare, Plus, ArrowRight, MapPin, Sparkles, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import Avatar from '../components/ui/Avatar';
import { DAVID, roomImage, DEMO_UNITS } from '../data/assets';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, upcoming: 0 });

  useEffect(() => {
    (async () => {
      try {
        const response = await getMyBookings();
        const fetched = response.data.bookings || response.data;
        const data = Array.isArray(fetched) ? fetched : [];
        setBookings(data);
        setStats({
          total: data.length,
          active: data.filter((b) => b.status === 'active' || b.status === 'confirmed').length,
          upcoming: data.filter((b) => b.status === 'pending' || b.status === 'confirmed').length,
        });
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <DashboardLayout><LoadingSpinner fullScreen /></DashboardLayout>;

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const next = bookings[0];
  const rec = DEMO_UNITS[1];

  const cards = [
    { ic: CalendarClock, cls: 'ic-purple', label: 'Upcoming Booking', value: stats.upcoming || 1, link: '/bookings', linkLabel: 'View booking' },
    { ic: PackageCheck, cls: 'ic-green', label: 'Active Storage', value: stats.active || 1, link: '/bookings', linkLabel: 'View details' },
    { ic: ClipboardList, cls: 'ic-blue', label: 'Total Bookings', value: stats.total || 2, link: '/bookings', linkLabel: 'View all' },
    { ic: Wallet, cls: 'ic-orange', label: 'Wallet Balance', value: 'KSh 1,200', link: '/payments', linkLabel: 'Add funds' },
  ];

  const quick = [
    { ic: Search, label: 'Find Storage', to: '/storage' },
    { ic: ClipboardList, label: 'My Bookings', to: '/bookings' },
    { ic: MessageSquare, label: 'Messages', to: '/messages' },
    { ic: Plus, label: 'Add Funds', to: '/payments' },
  ];

  return (
    <DashboardLayout>
      <div className="dash-hello">
        <h1>Welcome back, {firstName}</h1>
        <p>Here's what's happening with your storage.</p>
      </div>

      {/* Stat cards */}
      <div className="dash-grid-4">
        {cards.map(({ ic: Ic, cls, label, value, link, linkLabel }, i) => (
          <motion.div className="dash-card" key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`dash-card-ic ${cls}`}><Ic /></div>
            <div className="dash-card-label">{label}</div>
            <div className="dash-card-value">{value}</div>
            <Link to={link} className="dash-card-link">{linkLabel} <ArrowRight size={14} /></Link>
          </motion.div>
        ))}
      </div>

      {/* Next booking + recommended */}
      <div className="dash-cols">
        <div className="panel">
          <h3 className="panel-title">Next Booking</h3>
          {next ? (
            <div className="mini-booking">
              <img src={roomImage(next.storage_unit_id || 0)} alt="booking" />
              <div style={{ flex: 1 }}>
                <h4>{next.storage_units?.unit_number || next.storage_unit?.unit_number || `Unit #${next.storage_unit_id}`}</h4>
                <div className="loc"><MapPin /> {next.storage_units?.location || 'Juja'}</div>
                <div className="mini-dates">
                  <div className="mini-date"><span>Drop off</span><strong>{new Date(next.start_date).toLocaleDateString()}</strong></div>
                  <div className="mini-date"><span>Pick up</span><strong>{new Date(next.end_date).toLocaleDateString()}</strong></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mini-booking">
              <img src={roomImage(0)} alt="booking" />
              <div style={{ flex: 1 }}>
                <h4>Spacious Room in Gachororo</h4>
                <div className="loc"><MapPin /> Gachororo, Juja</div>
                <div className="mini-dates">
                  <div className="mini-date"><span>Drop off</span><strong>15th Dec 2025</strong></div>
                  <div className="mini-date"><span>Pick up</span><strong>15th Mar 2026</strong></div>
                </div>
              </div>
            </div>
          )}
          <Link to="/bookings" className="btn btn-outline btn-full" style={{ marginTop: 18 }}>View booking</Link>
        </div>

        <div className="panel">
          <h3 className="panel-title">Recommended for you</h3>
          <div className="rec-card">
            <img src={roomImage(rec.id)} alt={rec.unit_number} />
            <div style={{ flex: 1 }}>
              <h4>{rec.unit_number}</h4>
              <div className="loc">{rec.location}</div>
              <div className="amt" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>KSh {rec.price_per_month}
                <span style={{ color: 'var(--text-3)', fontWeight: 400, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  /mo · <Star size={13} style={{ color: 'var(--orange)', fill: 'var(--orange)' }} /> {rec.rating}
                </span>
              </div>
            </div>
            <Link to={`/storage/${rec.id}`} className="btn btn-primary btn-sm">View</Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="panel" style={{ marginBottom: 18 }}>
        <h3 className="panel-title">Quick Actions</h3>
        <div className="quick-actions">
          {quick.map(({ ic: Ic, label, to }) => (
            <Link to={to} className="qa-card" key={label}><Ic /><span>{label}</span></Link>
          ))}
        </div>
      </div>

      {/* David banner */}
      <div className="david-banner">
        <Avatar src={DAVID.img} name={DAVID.name} size="lg" online />
        <div className="db-txt">
          <strong>Hi, I'm {DAVID.name}</strong>
          <span>Your personal storage assistant</span>
        </div>
        <div className="db-actions">
          <Link to="/assistant" className="btn btn-white"><Sparkles size={16} /> Chat now</Link>
          <ArrowRight />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
