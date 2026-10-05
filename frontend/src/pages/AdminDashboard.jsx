import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAdminBookings, getAdminUsers, getAdminUnits, updateBookingStatus } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, usersRes, unitsRes] = await Promise.all([
        getAdminStats(),
        getAdminBookings(),
        getAdminUsers(),
        getAdminUnits(),
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings || []);
      setUsers(usersRes.data.users || []);
      setUnits(unitsRes.data.units || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      await fetchData();
    } catch (err) {
      console.error('Status update error:', err);
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

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

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'bookings', label: '📋 Bookings' },
    { key: 'users', label: '👥 Users' },
    { key: 'units', label: '🏪 Units' },
  ];

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <div className="admin-header-top">
            <div>
              <h1 className="page-title">
                Admin <span className="gradient-text">Control Panel</span>
              </h1>
              <p className="page-subtitle">Welcome back, {user?.full_name}. Here's your UNIVAULT overview.</p>
            </div>
            <span className="admin-role-badge">🛡️ Administrator</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs" id="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              id={`admin-tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="admin-section">
            <div className="admin-stats-grid">
              <div className="admin-stat-card admin-stat-revenue" id="stat-revenue">
                <div className="admin-stat-icon">💰</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Total Revenue</span>
                  <span className="admin-stat-value">KES {parseFloat(stats.totalRevenue).toLocaleString()}</span>
                </div>
              </div>
              <div className="admin-stat-card admin-stat-bookings" id="stat-bookings">
                <div className="admin-stat-icon">📦</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Total Bookings</span>
                  <span className="admin-stat-value">{stats.totalBookings}</span>
                </div>
              </div>
              <div className="admin-stat-card admin-stat-active" id="stat-active">
                <div className="admin-stat-icon">✅</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Active Bookings</span>
                  <span className="admin-stat-value">{stats.activeBookings}</span>
                </div>
              </div>
              <div className="admin-stat-card admin-stat-users" id="stat-users">
                <div className="admin-stat-icon">👥</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Registered Users</span>
                  <span className="admin-stat-value">{stats.totalUsers}</span>
                </div>
              </div>
              <div className="admin-stat-card admin-stat-units" id="stat-units">
                <div className="admin-stat-icon">🏪</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Total Units</span>
                  <span className="admin-stat-value">{stats.totalUnits}</span>
                </div>
              </div>
              <div className="admin-stat-card admin-stat-occupancy" id="stat-occupancy">
                <div className="admin-stat-icon">📈</div>
                <div className="admin-stat-info">
                  <span className="admin-stat-label">Occupancy Rate</span>
                  <span className="admin-stat-value">{stats.occupancyRate}%</span>
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="admin-summary-grid">
              <div className="admin-summary-card">
                <h3 className="admin-summary-title">Unit Status</h3>
                <div className="admin-summary-row">
                  <span>Available</span>
                  <span className="badge badge-active">{stats.availableUnits}</span>
                </div>
                <div className="admin-summary-row">
                  <span>Occupied</span>
                  <span className="badge badge-pending">{stats.occupiedUnits}</span>
                </div>
              </div>
              <div className="admin-summary-card">
                <h3 className="admin-summary-title">Booking Status</h3>
                <div className="admin-summary-row">
                  <span>Active / Confirmed</span>
                  <span className="badge badge-active">{stats.activeBookings}</span>
                </div>
                <div className="admin-summary-row">
                  <span>Completed</span>
                  <span className="badge badge-completed">{stats.completedBookings}</span>
                </div>
                <div className="admin-summary-row">
                  <span>Cancelled</span>
                  <span className="badge badge-cancelled">{stats.cancelledBookings}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="admin-section">
            <div className="admin-table-card">
              <h3 className="admin-table-title">All Bookings ({bookings.length})</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table" id="admin-bookings-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Unit</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>PIN</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div className="admin-cell-name">
                            {b.profiles?.full_name || 'Unknown'}
                          </div>
                          <div className="admin-cell-sub">{b.profiles?.email || ''}</div>
                        </td>
                        <td>{b.storage_units?.unit_number || '—'}</td>
                        <td>
                          <div className="admin-cell-sub">
                            {new Date(b.start_date).toLocaleDateString()} — {new Date(b.end_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td>KES {b.total_price}</td>
                        <td><code className="pin-mini">{b.access_pin || '—'}</code></td>
                        <td>
                          <span className={`badge ${getStatusClass(b.status)}`}>{b.status}</span>
                        </td>
                        <td>
                          <select
                            className="admin-status-select"
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            disabled={updating === b.id}
                            id={`status-select-${b.id}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {bookings.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No bookings yet</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-table-card">
              <h3 className="admin-table-title">Registered Users ({users.length})</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table" id="admin-users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Reg. Number</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.full_name || 'N/A'}</td>
                        <td>{u.email}</td>
                        <td><code>{u.registration_number || '—'}</code></td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-active' : 'badge-completed'}`}>
                            {u.role || 'student'}
                          </span>
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Units Tab */}
        {activeTab === 'units' && (
          <div className="admin-section">
            <div className="admin-table-card">
              <h3 className="admin-table-title">Storage Units ({units.length})</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table" id="admin-units-table">
                  <thead>
                    <tr>
                      <th>Unit #</th>
                      <th>Size</th>
                      <th>Location</th>
                      <th>Building</th>
                      <th>Price/Month</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((u) => (
                      <tr key={u.id}>
                        <td><strong>{u.unit_number}</strong></td>
                        <td><span className={`badge badge-size-${u.size}`}>{u.size}</span></td>
                        <td>{u.location}</td>
                        <td>{u.building || '—'}</td>
                        <td>KES {u.price_per_month}</td>
                        <td>
                          <span className={`badge ${u.is_available ? 'badge-active' : 'badge-pending'}`}>
                            {u.is_available ? 'Available' : 'Occupied'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
