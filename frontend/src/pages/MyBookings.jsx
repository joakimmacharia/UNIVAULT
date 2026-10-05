import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings();
        const fetched = response.data.bookings || response.data;
        setBookings(Array.isArray(fetched) ? fetched : []);
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

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return booking.status === 'active' || booking.status === 'confirmed';
    return booking.status === activeFilter;
  });

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title" id="bookings-title">
              My <span className="gradient-text">Bookings</span>
            </h1>
            <p className="page-subtitle">Manage all your storage reservations</p>
          </div>
          <Link to="/storage" className="btn btn-primary" id="new-booking-btn">
            New Booking
            <span className="btn-icon">+</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" id="booking-filters">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
              id={`filter-${tab.key}`}
            >
              {tab.label}
              <span className="filter-count">
                {tab.key === 'all'
                  ? bookings.length
                  : tab.key === 'active'
                  ? bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length
                  : bookings.filter(b => b.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="empty-state" id="no-filtered-bookings">
            <div className="empty-icon">📋</div>
            <h3>No {activeFilter !== 'all' ? activeFilter : ''} bookings found</h3>
            <p>Your bookings will appear here once you make a reservation</p>
            <Link to="/storage" className="btn btn-primary">Browse Storage</Link>
          </div>
        ) : (
          <div className="bookings-card-grid" id="bookings-grid">
            {filteredBookings.map((booking) => (
              <Link
                to={`/bookings/${booking.id}`}
                key={booking.id}
                className="booking-card"
                id={`booking-card-${booking.id}`}
              >
                <div className="booking-card-header">
                  <span className="booking-card-unit">
                    {booking.storage_units?.unit_number || booking.storage_unit?.unit_number || `Unit #${booking.storage_unit_id}`}
                  </span>
                  <span className={`badge ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-card-body">
                  <div className="booking-card-detail">
                    <span className="booking-card-detail-icon">📅</span>
                    <span>{new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}</span>
                  </div>
                  {(booking.storage_units?.location || booking.storage_unit?.location) && (
                    <div className="booking-card-detail">
                      <span className="booking-card-detail-icon">📍</span>
                      <span>{booking.storage_units?.location || booking.storage_unit?.location}</span>
                    </div>
                  )}
                </div>
                <div className="booking-card-footer">
                  <span className="booking-card-price">${booking.total_price || '—'}</span>
                  <span className="booking-card-link">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
