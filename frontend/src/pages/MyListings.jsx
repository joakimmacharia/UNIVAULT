import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, MapPin, Home, AlertTriangle } from 'lucide-react';
import { getMyStorageUnits, deleteStorageUnit } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { roomImage } from '../data/assets';

const MyListings = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyStorageUnits();
      setUnits(res.data.units || []);
      setMigrationNeeded(!!res.data.migrationNeeded);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteStorageUnit(id);
      setUnits((u) => u.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete listing.');
    } finally { setDeleting(null); }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My <span className="gradient-text">Listings</span></h1>
          <p className="page-subtitle">Manage the spaces you rent out on UniVault.</p>
        </div>
        <Link to="/list-space" className="btn btn-primary"><Plus size={18} /> List a Space</Link>
      </div>

      {migrationNeeded && (
        <div className="alert alert-error" style={{ background: 'var(--orange-light)', color: '#B45309' }}>
          <AlertTriangle /> Ownership tracking is off. Run <code>migrations/001_landlord_id.sql</code> in Supabase to see only your own listings here.
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : units.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Home /></div>
          <h3>No listings yet</h3>
          <p>List your first space and start earning from JKUAT students.</p>
          <Link to="/list-space" className="btn btn-primary"><Plus size={18} /> List a Space</Link>
        </div>
      ) : (
        <div className="storage-list">
          {units.map((u, i) => (
            <div key={u.id} className="storage-card" style={{ display: 'grid' }}>
              <div className="storage-thumb"><img src={roomImage(u.id || i)} alt={u.unit_number} /></div>
              <div className="storage-body">
                <div className="storage-body-top">
                  <div>
                    <h3 className="storage-name">{u.unit_number || `Unit #${u.id}`}</h3>
                    <div className="storage-meta"><MapPin /> {u.location || 'Juja'}{u.building ? ` · ${u.building}` : ''}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <span className={`badge badge-size-${u.size}`}>{u.size}</span>
                      <span className={`badge ${u.is_available ? 'badge-active' : 'badge-pending'}`}>
                        {u.is_available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="storage-price"><div className="amt">KSh {u.price_per_month}</div><div className="per">/month</div></div>
                  </div>
                </div>
                <div className="storage-amenities" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/storage/${u.id}`} className="dash-card-link">Preview listing →</Link>
                  <button className="btn btn-outline btn-sm" onClick={() => remove(u.id)} disabled={deleting === u.id}
                    style={{ color: 'var(--red)', borderColor: 'var(--border)' }}>
                    <Trash2 size={15} /> {deleting === u.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyListings;
