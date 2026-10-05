import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStorageUnit } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const StorageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await getStorageUnit(id);
        setUnit(response.data.unit || response.data.storage_unit || response.data);
      } catch (err) {
        setError('Failed to load storage unit details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !unit) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>{error || 'Unit not found'}</h3>
            <Link to="/storage" className="btn btn-primary">Back to Browse</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <button className="back-link" onClick={() => navigate(-1)} id="back-to-browse">
          ← Back
        </button>

        <div className="detail-grid" id="unit-detail">
          <div className="detail-main">
            <div className="detail-card">
              <div className="detail-header">
                <div>
                  <h1 className="detail-title">{unit.unit_number || `Unit #${unit.id}`}</h1>
                  <span className={`badge ${unit.is_available ? 'badge-active' : 'badge-cancelled'}`}>
                    {unit.is_available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="detail-price">
                  <span className="price-amount">KES {unit.price_per_month || unit.price || '—'}</span>
                  <span className="price-period">/month</span>
                </div>
              </div>

              {unit.description && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Description</h3>
                  <p className="detail-text">{unit.description}</p>
                </div>
              )}

              <div className="detail-section">
                <h3 className="detail-section-title">Unit Information</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <span className="detail-info-icon">📐</span>
                    <span className="detail-info-label">Size</span>
                    <span className="detail-info-value">{unit.size || 'N/A'}</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-icon">📍</span>
                    <span className="detail-info-label">Location</span>
                    <span className="detail-info-value">{unit.location || 'N/A'}</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-icon">💰</span>
                    <span className="detail-info-label">Price</span>
                    <span className="detail-info-value">KES {unit.price_per_month || unit.price || '—'}/month</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-icon">📊</span>
                    <span className="detail-info-label">Status</span>
                    <span className="detail-info-value">{unit.is_available ? 'Available' : 'Occupied'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Book This Unit</h3>
              <p className="sidebar-text">
                {unit.is_available
                  ? 'This unit is available for booking. Reserve it now to secure your space.'
                  : 'This unit is currently occupied. Check back later or browse other units.'}
              </p>
              {unit.is_available ? (
                <Link
                  to={`/bookings/new?unit=${unit.id}`}
                  className="btn btn-primary btn-full"
                  id="book-unit-btn"
                >
                  Book This Unit
                  <span className="btn-icon">→</span>
                </Link>
              ) : (
                <Link to="/storage" className="btn btn-outline btn-full" id="browse-other-btn">
                  Browse Other Units
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageDetails;
