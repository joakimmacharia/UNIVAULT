import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBooking, cancelBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBooking(id);
        setBooking(response.data.booking || response.data);
      } catch (err) {
        setError('Failed to load booking details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(id);
      setBooking({ ...booking, status: 'cancelled' });
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
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

  if (error && !booking) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>{error}</h3>
            <Link to="/bookings" className="btn btn-primary">Back to Bookings</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <button className="back-link" onClick={() => navigate(-1)} id="back-from-detail">
          ← Back
        </button>

        <div className="detail-grid" id="booking-detail">
          <div className="detail-main">
            <div className="detail-card">
              <div className="detail-header">
                <div>
                  <h1 className="detail-title">Booking #{booking.id}</h1>
                  <span className={`badge badge-lg ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="detail-section">
                <h3 className="detail-section-title">Booking Information</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <span className="detail-info-icon">📅</span>
                    <span className="detail-info-label">Start Date</span>
                    <span className="detail-info-value">
                      {new Date(booking.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-icon">📅</span>
                    <span className="detail-info-label">End Date</span>
                    <span className="detail-info-value">
                      {new Date(booking.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-icon">💰</span>
                    <span className="detail-info-label">Total Price</span>
                    <span className="detail-info-value">KES {booking.total_price || '—'}</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-icon">📊</span>
                    <span className="detail-info-label">Status</span>
                    <span className="detail-info-value">{booking.status}</span>
                  </div>
                </div>
              </div>

              {(booking.status === 'active' || booking.status === 'confirmed') && booking.access_pin && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Locker Access</h3>
                  <div className="locker-pin-display">
                    <p className="pin-instructions">Enter this PIN at the facility terminal to access your storage unit.</p>
                    <div className="pin-code">
                      {booking.access_pin.split('').map((digit, idx) => (
                        <span key={idx} className="pin-digit">{digit}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {booking.notes && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Notes</h3>
                  <p className="detail-text">{booking.notes}</p>
                </div>
              )}

              {(booking.storage_units || booking.storage_unit) && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Storage Unit</h3>
                  <div className="detail-info-grid">
                    <div className="detail-info-item">
                      <span className="detail-info-icon">🏷️</span>
                      <span className="detail-info-label">Unit</span>
                      <span className="detail-info-value">
                        {booking.storage_units?.unit_number || booking.storage_unit?.unit_number || `#${booking.storage_unit_id}`}
                      </span>
                    </div>
                    {(booking.storage_units?.size || booking.storage_unit?.size) && (
                      <div className="detail-info-item">
                        <span className="detail-info-icon">📐</span>
                        <span className="detail-info-label">Size</span>
                        <span className="detail-info-value">{booking.storage_units?.size || booking.storage_unit?.size}</span>
                      </div>
                    )}
                    {(booking.storage_units?.location || booking.storage_unit?.location) && (
                      <div className="detail-info-item">
                        <span className="detail-info-icon">📍</span>
                        <span className="detail-info-label">Location</span>
                        <span className="detail-info-value">{booking.storage_units?.location || booking.storage_unit?.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Actions</h3>
              {(booking.status === 'active' || booking.status === 'confirmed' || booking.status === 'pending') && (
                <>
                  {!showConfirm ? (
                    <button
                      className="btn btn-danger btn-full"
                      id="cancel-booking-btn"
                      onClick={() => setShowConfirm(true)}
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <div className="confirm-cancel" id="cancel-confirm">
                      <p className="confirm-text">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                      <div className="confirm-actions">
                        <button
                          className="btn btn-danger"
                          onClick={handleCancel}
                          disabled={cancelling}
                          id="confirm-cancel-btn"
                        >
                          {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => setShowConfirm(false)}
                          id="keep-booking-btn"
                        >
                          Keep Booking
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              <Link to="/bookings" className="btn btn-outline btn-full" style={{ marginTop: '12px' }} id="back-to-bookings">
                All Bookings
              </Link>
              <Link to="/storage" className="btn btn-outline btn-full" style={{ marginTop: '12px' }} id="browse-units-link">
                Browse Units
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
