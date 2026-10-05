import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings();
        const fetched = response.data.bookings || response.data;
        const data = Array.isArray(fetched) ? fetched : [];
        setBookings(data);
        setStats({
          total: data.length,
          active: data.filter(b => b.status === 'active' || b.status === 'confirmed').length,
          completed: data.filter(b => b.status === 'completed').length,
          cancelled: data.filter(b => b.status === 'cancelled').length,
        });
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusClass = (status) => {
    const classes = {
      active: 'badge-active',
      confirmed: 'badge-active',
      pending: 'badge-pending',
      cancelled: 'badge-cancelled',
      completed: 'badge-completed',
    };
    return classes[status] || 'badge-pending';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title" id="dashboard-title">
              Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="page-subtitle">Here&apos;s an overview of your storage activity</p>
          </div>
          <Link to="/storage" className="btn btn-primary" id="browse-storage-btn">
            Browse Storage
            <span className="btn-icon">→</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" id="stats-grid">
          <div className="stat-card" id="stat-total">
            <div className="stat-icon stat-icon-total">📦</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>
          <div className="stat-card" id="stat-active">
            <div className="stat-icon stat-icon-active">✅</div>
            <div className="stat-info">
              <span className="stat-number">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
          <div className="stat-card" id="stat-completed">
            <div className="stat-icon stat-icon-completed">🏁</div>
            <div className="stat-info">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card" id="stat-cancelled">
            <div className="stat-icon stat-icon-cancelled">❌</div>
            <div className="stat-info">
              <span className="stat-number">{stats.cancelled}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="dashboard-section">
          <div className="section-row">
            <h2 className="section-heading">Recent Bookings</h2>
            <Link to="/bookings" className="view-all-link" id="view-all-bookings">
              View All →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state" id="no-bookings">
              <div className="empty-icon">📦</div>
              <h3>No bookings yet</h3>
              <p>Browse available storage units to get started</p>
              <Link to="/storage" className="btn btn-primary">
                Find Storage
              </Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.slice(0, 5).map((booking) => (
                <Link
                  to={`/bookings/${booking.id}`}
                  key={booking.id}
                  className="booking-list-item"
                  id={`booking-${booking.id}`}
                >
                  <div className="booking-list-info">
                    <span className="booking-list-unit">
                      {booking.storage_units?.unit_number || booking.storage_unit?.unit_number || `Unit #${booking.storage_unit_id}`}
                    </span>
                    <span className="booking-list-date">
                      {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="booking-list-right">
                    <span className={`badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="booking-list-price">${booking.total_price || '—'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2 className="section-heading">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/storage" className="action-card" id="action-browse">
              <span className="action-icon">🔍</span>
              <span className="action-title">Browse Units</span>
              <span className="action-desc">Find available storage</span>
            </Link>
            <Link to="/bookings" className="action-card" id="action-bookings">
              <span className="action-icon">📋</span>
              <span className="action-title">My Bookings</span>
              <span className="action-desc">View all reservations</span>
            </Link>
            <Link to="/profile" className="action-card" id="action-profile">
              <span className="action-icon">👤</span>
              <span className="action-title">Profile</span>
              <span className="action-desc">Account settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
