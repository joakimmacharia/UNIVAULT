import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getStorageUnit, createBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CheckoutModal from '../components/CheckoutModal';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get('unit');
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    notes: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitId) {
        setError('No storage unit selected. Please select a unit first.');
        setLoading(false);
        return;
      }
      try {
        const response = await getStorageUnit(unitId);
        setUnit(response.data.unit || response.data.storage_unit || response.data);
      } catch (err) {
        setError('Failed to load unit details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  useEffect(() => {
    if (unit && formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = end - start;
      const diffMonths = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)));
      const pricePerMonth = unit.price_per_month || unit.price || 0;
      setCalculatedPrice(diffMonths > 0 ? diffMonths * pricePerMonth : 0);
    } else {
      setCalculatedPrice(0);
    }
  }, [formData.start_date, formData.end_date, unit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.start_date || !formData.end_date) {
      setError('Please select both start and end dates.');
      return;
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('End date must be after start date.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleFinalBookingSubmit = async () => {
    setSubmitting(true);
    setIsModalOpen(false);

    try {
      const response = await createBooking({
        storage_unit_id: unitId,
        start_date: formData.start_date,
        end_date: formData.end_date,
        notes: formData.notes,
      });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create booking. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error && !unit) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>{error}</h3>
            <button className="btn btn-primary" onClick={() => navigate('/storage')}>Browse Storage</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <button className="back-link" onClick={() => navigate(-1)} id="back-from-booking">
          ← Back
        </button>

        <div className="page-header">
          <h1 className="page-title" id="booking-form-title">
            Book <span className="gradient-text">{unit?.unit_number || `Unit #${unitId}`}</span>
          </h1>
          <p className="page-subtitle">Complete the form below to reserve your storage unit</p>
        </div>

        <div className="detail-grid">
          <div className="detail-main">
            <div className="detail-card">
              {error && (
                <div className="alert alert-error" id="booking-error">
                  <span className="alert-icon">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleInitialSubmit} className="booking-form" id="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="start_date" className="form-label">Start Date</label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      className="form-input"
                      value={formData.start_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end_date" className="form-label">End Date</label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      className="form-input"
                      value={formData.end_date}
                      onChange={handleChange}
                      min={formData.start_date || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="form-label">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="form-input form-textarea"
                    placeholder="Any special instructions or notes..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  id="submit-booking"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="btn-loading">Creating Booking...</span>
                  ) : (
                    'Confirm & Pay KES ' + calculatedPrice.toFixed(2)
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Booking Summary</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-label">Unit</span>
                  <span className="summary-value">{unit?.unit_number || `#${unitId}`}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Size</span>
                  <span className="summary-value">{unit?.size || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Location</span>
                  <span className="summary-value">{unit?.location || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Monthly Rate</span>
                  <span className="summary-value">KES {unit?.price_per_month || unit?.price || '—'}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item summary-total">
                  <span className="summary-label">Estimated Total</span>
                  <span className="summary-value">KES {calculatedPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFinalBookingSubmit}
        amount={calculatedPrice}
      />
    </div>
  );
};

export default BookingForm;
