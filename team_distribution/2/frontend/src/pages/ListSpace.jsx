import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2, Home } from 'lucide-react';
import { createStorageUnit } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const empty = { unit_number: '', size: 'medium', location: '', building: '', price_per_month: '', description: '', is_available: true };

const ListSpace = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.location.trim() || !form.price_per_month) {
      setError('Location and monthly price are required.');
      return;
    }
    setSaving(true);
    try {
      await createStorageUnit({
        ...form,
        price_per_month: parseFloat(form.price_per_month),
      });
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing. Please try again.');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft /> Back</button>

      <div className="page-header">
        <div>
          <h1 className="page-title">List Your <span className="gradient-text">Space</span></h1>
          <p className="page-subtitle">Add a storage space for JKUAT students to book.</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          {error && <div className="alert alert-error"><AlertTriangle /> {error}</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Listing name (optional)</label>
                <input name="unit_number" className="form-input" placeholder="e.g., Spacious Room in Gachororo"
                  value={form.unit_number} onChange={change} />
              </div>
              <div className="form-group">
                <label className="form-label">Size</label>
                <select name="size" className="form-select" value={form.size} onChange={change}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location / Area</label>
                <input name="location" className="form-input" placeholder="e.g., Gachororo, Juja"
                  value={form.location} onChange={change} required />
              </div>
              <div className="form-group">
                <label className="form-label">Building (optional)</label>
                <input name="building" className="form-input" placeholder="e.g., Juja Square Mall"
                  value={form.building} onChange={change} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Price per month (KSh)</label>
              <input name="price_per_month" type="number" min="1" className="form-input" placeholder="e.g., 1200"
                value={form.price_per_month} onChange={change} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea"
                placeholder="Describe the space, security, access hours, what can be stored..."
                value={form.description} onChange={change} />
            </div>

            <label className="avail-toggle">
              <input type="checkbox" name="is_available" checked={form.is_available} onChange={change} />
              <span>Available for booking now</span>
            </label>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={saving} style={{ marginTop: 20 }}>
              {saving ? 'Publishing...' : 'Publish Listing'}
            </button>
          </form>
        </div>

        {/* Tips sidebar */}
        <div className="book-card">
          <div className="dash-card-ic ic-purple" style={{ marginBottom: 14 }}><Home /></div>
          <h3 className="sidebar-title">Listing tips</h3>
          <div className="settings-list" style={{ marginTop: 12 }}>
            {['Use a clear, descriptive name', 'Mention security (CCTV, 24/7)', 'Price competitively for students', 'Add your nearest landmark'].map((t) => (
              <div key={t} className="lb" style={{ fontSize: 14 }}><CheckCircle2 /> {t}</div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListSpace;
