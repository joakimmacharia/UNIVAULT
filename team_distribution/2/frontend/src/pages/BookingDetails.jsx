import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Wallet, BarChart3, Tag, Ruler, MapPin, AlertTriangle, KeyRound } from 'lucide-react';
import { getBooking, cancelBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statusClass = (s) => ({ active: 'badge-active', confirmed: 'badge-active', pending: 'badge-pending', cancelled: 'badge-cancelled', completed: 'badge-completed' }[s] || 'badge-pending');

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await getBooking(id);
        setBooking(response.data.booking || response.data);
      } catch (err) {
        setError('Failed to load booking details.');
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(id);
      setBooking({ ...booking, status: 'cancelled' });
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to cancel booking.');
    } finally { setCancelling(false); }
  };

  if (loading) return <div className="page"><LoadingSpinner fullScreen /></div>;

  if (error && !booking) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon"><AlertTriangle /></div>
          <h3>{error}</h3>
          <Link to="/bookings" className="btn btn-primary">Back to Bookings</Link>
        </div>
      </div>
    );
  }

  const su = booking.storage_units || booking.storage_unit;
  const canCancel = ['active', 'confirmed', 'pending'].includes(booking.status);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft /> Back</button>

      <div className="detail-grid">
        <div>
          <div className="detail-card">
            <div className="detail-header">
              <div>
                <h1 className="detail-title">Booking #{booking.id}</h1>
                <span className={`badge badge-lg ${statusClass(booking.status)}`} style={{ marginTop: 8 }}>{booking.status}</span>
              </div>
            </div>

            {error && <div className="alert alert-error"><AlertTriangle /> {error}</div>}

            <div className="detail-section" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
              <h3 className="detail-section-title">Booking Information</h3>
              <div className="detail-info-grid">
                <div className="detail-info-item"><Calendar /><span className="detail-info-label">Drop off</span><span className="detail-info-value">{fmt(booking.start_date)}</span></div>
                <div className="detail-info-item"><Calendar /><span className="detail-info-label">Pick up</span><span className="detail-info-value">{fmt(booking.end_date)}</span></div>
                <div className="detail-info-item"><Wallet /><span className="detail-info-label">Total Price</span><span className="detail-info-value">KSh {booking.total_price || '—'}</span></div>
                <div className="detail-info-item"><BarChart3 /><span className="detail-info-label">Status</span><span className="detail-info-value" style={{ textTransform: 'capitalize' }}>{booking.status}</span></div>
              </div>
            </div>

            {canCancel && booking.access_pin && (
              <div className="detail-section">
                <h3 className="detail-section-title"><KeyRound size={16} style={{ verticalAlign: -3, color: 'var(--primary)' }} /> Locker Access</h3>
                <div className="locker-pin-display">
                  <p className="pin-instructions">Enter this PIN at the facility terminal to access your storage unit.</p>
                  <div className="pin-code">{booking.access_pin.split('').map((d, i) => <span key={i} className="pin-digit">{d}</span>)}</div>
                </div>
              </div>
            )}

            {booking.notes && (
              <div className="detail-section">
                <h3 className="detail-section-title">Notes</h3>
                <p className="detail-text">{booking.notes}</p>
              </div>
            )}

            {su && (
              <div className="detail-section">
                <h3 className="detail-section-title">Storage Unit</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item"><Tag /><span className="detail-info-label">Unit</span><span className="detail-info-value">{su.unit_number || `#${booking.storage_unit_id}`}</span></div>
                  {su.size && <div className="detail-info-item"><Ruler /><span className="detail-info-label">Size</span><span className="detail-info-value">{su.size}</span></div>}
                  {su.location && <div className="detail-info-item"><MapPin /><span className="detail-info-label">Location</span><span className="detail-info-value">{su.location}</span></div>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="book-card">
            <h3 className="sidebar-title">Actions</h3>
            {canCancel && (
              !showConfirm ? (
                <button className="btn btn-danger btn-full" onClick={() => setShowConfirm(true)}>Cancel Booking</button>
              ) : (
                <div className="confirm-cancel">
                  <p className="confirm-text">Are you sure? This action cannot be undone.</p>
                  <div className="confirm-actions">
                    <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>{cancelling ? 'Cancelling...' : 'Yes, Cancel'}</button>
                    <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>Keep</button>
                  </div>
                </div>
              )
            )}
            <Link to="/bookings" className="btn btn-outline btn-full" style={{ marginTop: 12 }}>All Bookings</Link>
            <Link to="/storage" className="btn btn-outline btn-full" style={{ marginTop: 12 }}>Browse Units</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
