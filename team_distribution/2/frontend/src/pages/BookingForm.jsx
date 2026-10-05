import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, MapPin } from 'lucide-react';
import { getStorageUnit, createBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CheckoutModal from '../components/CheckoutModal';
import { roomImage, DEMO_UNITS } from '../data/assets';

const STEPS = ['Select Dates', 'Confirm Details', 'Payment'];

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get('unit');
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ start_date: '', end_date: '', notes: '' });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [months, setMonths] = useState(0);

  const isDemo = String(unitId).startsWith('demo');

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitId) { setError('No storage unit selected. Please select a unit first.'); setLoading(false); return; }
      if (isDemo) {
        const found = DEMO_UNITS.find((u) => u.id === unitId);
        setUnit(found || null);
        setLoading(false);
        return;
      }
      try {
        const response = await getStorageUnit(unitId);
        setUnit(response.data.unit || response.data.storage_unit || response.data);
      } catch (err) {
        setError('Failed to load unit details.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchUnit();
  }, [unitId, isDemo]);

  useEffect(() => {
    if (unit && formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffMonths = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)));
      const rate = unit.price_per_month || unit.price || 0;
      setMonths(diffMonths);
      setCalculatedPrice(diffMonths * rate);
    } else { setMonths(0); setCalculatedPrice(0); }
  }, [formData.start_date, formData.end_date, unit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const currentStep = !formData.start_date || !formData.end_date ? 0 : 1;
  const serviceFee = calculatedPrice ? 180 : 0;
  const total = calculatedPrice + serviceFee;

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.start_date || !formData.end_date) { setError('Please select both drop-off and pick-up dates.'); return; }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) { setError('Pick-up date must be after drop-off date.'); return; }
    setIsModalOpen(true);
  };

  const handleFinalBookingSubmit = async () => {
    setSubmitting(true);
    setIsModalOpen(false);
    if (isDemo) { setTimeout(() => navigate('/bookings'), 300); return; }
    try {
      await createBooking({ storage_unit_id: unitId, start_date: formData.start_date, end_date: formData.end_date, notes: formData.notes });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create booking. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><LoadingSpinner fullScreen /></div>;

  if (error && !unit) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon"><AlertTriangle /></div>
          <h3>{error}</h3>
          <button className="btn btn-primary" onClick={() => navigate('/storage')}>Browse Storage</button>
        </div>
      </div>
    );
  }

  const name = unit?.unit_number || `Unit #${unitId}`;
  const rate = unit?.price_per_month || unit?.price || '—';

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft /> Back</button>

      <div className="booking-head">
        <div className="page-header" style={{ marginBottom: 22 }}>
          <div>
            <h1 className="page-title">Book Storage</h1>
            <p className="page-subtitle">Reserve <strong>{name}</strong> in a few steps.</p>
          </div>
          <div className="stepper">
            {STEPS.map((label, i) => (
              <div className="step" key={label} style={{ display: 'flex' }}>
                <div className={`step ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
                  <span className="step-dot">{i + 1}</span>
                  <span className="step-label">{label}</span>
                </div>
                {i < STEPS.length - 1 && <span className={`step-line ${i < currentStep ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left: your booking + dates */}
        <div>
          <div className="detail-card">
            <h3 className="detail-section-title" style={{ marginBottom: 14 }}>Your Booking</h3>
            <div className="selected-property">
              <img src={roomImage(unit?.id || 0)} alt={name} />
              <div>
                <h4>{name}</h4>
                <span>{unit?.location || 'Juja'}</span>
                <span className="amt">KSh {rate} /month</span>
              </div>
            </div>

            {error && <div className="alert alert-error"><AlertTriangle /> {error}</div>}

            <form onSubmit={handleInitialSubmit}>
              <h3 className="detail-section-title" style={{ marginBottom: 14 }}>Select Dates</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Drop off date</label>
                  <input type="date" name="start_date" className="form-input" value={formData.start_date}
                    onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Pick up date</label>
                  <input type="date" name="end_date" className="form-input" value={formData.end_date}
                    onChange={handleChange} min={formData.start_date || new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
              <p className="date-note">You can cancel for free up to 24 hours before drop-off.</p>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Notes (optional)</label>
                <textarea name="notes" className="form-textarea" placeholder="Any special instructions..."
                  value={formData.notes} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
                {submitting ? 'Processing...' : 'Continue to payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: price summary */}
        <div>
          <div className="book-card">
            <h3 className="sidebar-title">Price Summary</h3>
            <div className="summary-items" style={{ marginTop: 12 }}>
              <div className="summary-item">
                <span className="summary-label">{months ? `${months} month${months > 1 ? 's' : ''}` : 'Monthly rate'}</span>
                <span className="summary-value">KSh {calculatedPrice ? calculatedPrice.toLocaleString() : rate}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Service fee</span>
                <span className="summary-value">KSh {serviceFee}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-item summary-total">
                <span className="summary-label">Total</span>
                <span className="summary-value">KSh {total ? total.toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSuccess={handleFinalBookingSubmit} amount={total} />
    </div>
  );
};

export default BookingForm;
