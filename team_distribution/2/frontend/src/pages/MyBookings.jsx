import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, ClipboardList } from 'lucide-react';
import { getMyBookings } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { roomImage } from '../data/assets';

const statusClass = (s) => ({ active: 'badge-active', confirmed: 'badge-active', pending: 'badge-pending', cancelled: 'badge-cancelled', completed: 'badge-completed' }[s] || 'badge-pending');

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const response = await getMyBookings();
        const fetched = response.data.bookings || response.data;
        setBookings(Array.isArray(fetched) ? fetched : []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = bookings.filter((b) => {
    if (active === 'all') return true;
    if (active === 'active') return b.status === 'active' || b.status === 'confirmed';
    return b.status === active;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];
  const countFor = (k) => k === 'all' ? bookings.length : k === 'active'
    ? bookings.filter((b) => b.status === 'active' || b.status === 'confirmed').length
    : bookings.filter((b) => b.status === k).length;

  if (loading) return <DashboardLayout><LoadingSpinner fullScreen /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My <span className="gradient-text">Bookings</span></h1>
          <p className="page-subtitle">Manage all your storage reservations.</p>
        </div>
        <Link to="/storage" className="btn btn-primary"><Plus size={18} /> New Booking</Link>
      </div>

      <div className="tabs" style={{ marginBottom: 22 }}>
        {tabs.map((t) => (
          <button key={t.key} className={`tab${active === t.key ? ' active' : ''}`} onClick={() => setActive(t.key)}>
            {t.label} <span className="tab-count">{countFor(t.key)}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><ClipboardList /></div>
          <h3>No {active !== 'all' ? active : ''} bookings found</h3>
          <p>Your bookings will appear here once you make a reservation.</p>
          <Link to="/storage" className="btn btn-primary">Browse Storage</Link>
        </div>
      ) : (
        <div className="storage-list">
          {filtered.map((b) => {
            const unitName = b.storage_units?.unit_number || b.storage_unit?.unit_number || `Unit #${b.storage_unit_id}`;
            const loc = b.storage_units?.location || b.storage_unit?.location;
            return (
              <Link to={`/bookings/${b.id}`} key={b.id} className="storage-card" style={{ display: 'grid' }}>
                <div className="storage-thumb"><img src={roomImage(b.storage_unit_id || b.id)} alt={unitName} /></div>
                <div className="storage-body">
                  <div className="storage-body-top">
                    <div>
                      <h3 className="storage-name">{unitName}</h3>
                      <div className="storage-meta"><Calendar /> {new Date(b.start_date).toLocaleDateString()} — {new Date(b.end_date).toLocaleDateString()}</div>
                      {loc && <div className="storage-meta"><MapPin /> {loc}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${statusClass(b.status)}`}>{b.status}</span>
                      <div className="storage-price" style={{ marginTop: 12 }}>
                        <div className="amt">KSh {b.total_price || '—'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="storage-amenities"><span className="dash-card-link">View details →</span></div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyBookings;
