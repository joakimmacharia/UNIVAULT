import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Bookmark, ShieldCheck, Video,
  Wind, DoorOpen, Building, CheckCircle2,
} from 'lucide-react';
import { getStorageUnit } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Avatar from '../components/ui/Avatar';
import { roomImage, DEMO_UNITS, avatarFor } from '../data/assets';

const FEATURE_ICONS = { '24/7 Security': ShieldCheck, 'CCTV': Video, 'CCTV Surveillance': Video, 'Dry Space': Wind, 'Dry & clean space': Wind, 'Easy Access': DoorOpen, 'Ground Floor': Building, 'Lockable': ShieldCheck, 'Secure': ShieldCheck, 'Clean': CheckCircle2 };

const StorageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchUnit = async () => {
      // demo listings live client-side only
      if (String(id).startsWith('demo')) {
        const found = DEMO_UNITS.find((u) => u.id === id);
        if (found) { setUnit(found); setLoading(false); return; }
      }
      try {
        const response = await getStorageUnit(id);
        setUnit(response.data.unit || response.data.storage_unit || response.data);
      } catch (err) {
        setError('Failed to load storage unit details.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchUnit();
  }, [id]);

  if (loading) return <div className="page"><LoadingSpinner fullScreen /></div>;

  if (error || !unit) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon"><MapPin /></div>
          <h3>{error || 'Unit not found'}</h3>
          <Link to="/storage" className="btn btn-primary">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const name = unit.unit_number || `Unit #${unit.id}`;
  const price = unit.price_per_month || unit.price || '—';
  const rating = unit.rating || 4.6;
  const reviews = unit.reviews ?? 28;
  const features = unit.amenities || ['24/7 Security', 'CCTV Surveillance', 'Dry & clean space', 'Easy Access', 'Ground Floor'];
  const gallery = [roomImage(unit.id || 0), roomImage((Number(String(unit.id).replace(/\D/g, '')) || 1) + 1), roomImage(2), roomImage(3), roomImage(4)];

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft /> Back to results</button>

      <div className="detail-grid">
        {/* Left: gallery + book bar */}
        <div>
          <div className="gallery">
            <div className="gallery-main"><img src={gallery[active]} alt={name} /></div>
            <div className="gallery-thumbs">
              {gallery.slice(0, 4).map((g, i) => (
                <div key={i} className={`gallery-thumb${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
                  <img src={g} alt={`${name} ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 20, background: 'var(--grad-purple)', color: '#fff', borderRadius: 'var(--r-card)',
            padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-purple)',
          }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>KSh {price}</div>
              <div style={{ opacity: .85, fontSize: 13 }}>per month</div>
            </div>
            <Link to={`/bookings/new?unit=${unit.id}`} className="btn btn-white" style={{ marginLeft: 'auto' }}>
              Book this space
            </Link>
            <button className="btn-icon-only" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }} aria-label="Save">
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div className="detail-card">
            <h1 className="detail-title" style={{ marginBottom: 8 }}>{name}</h1>
            <div className="storage-meta" style={{ marginTop: 0 }}><MapPin /> {unit.location || 'Juja'} · {unit.distance || 'Near JKUAT'}</div>
            <div className="storage-rating" style={{ marginTop: 10 }}><Star /> {rating} <span>({reviews} reviews)</span></div>

            <div className="detail-section">
              <h3 className="detail-section-title">About this space</h3>
              <p className="detail-text">{unit.description || 'Large, clean and secure room ideal for storing items during the holidays.'}</p>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">Features</h3>
              <div className="amenity-grid">
                {features.map((f) => {
                  const Icon = FEATURE_ICONS[f] || CheckCircle2;
                  return <div className="amenity" key={f}><Icon /> {f}</div>;
                })}
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">Landlord</h3>
              <div className="landlord">
                <Avatar src={avatarFor(1)} name="John Mwangi" size="lg" />
                <div className="landlord-info">
                  <h4>{unit.landlord_name || 'John Mwangi'}</h4>
                  <span>Member since Jan 2023</span>
                  <div className="landlord-rating"><Star /> 4.4 (33 reviews) · Response rate 96%</div>
                </div>
                <Link to="/messages" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>View profile</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageDetails;
