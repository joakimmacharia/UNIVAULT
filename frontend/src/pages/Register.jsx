import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Vault, AlertTriangle, GraduationCap, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [params] = useSearchParams();
  const [formData, setFormData] = useState({ fullName: '', email: '', registrationNumber: '', password: '', confirmPassword: '' });
  const [role, setRole] = useState(params.get('role') === 'landlord' ? 'landlord' : 'student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isLandlord = role === 'landlord';
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register({ ...registerData, role });
      navigate(isLandlord ? '/my-listings' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-header">
          <div className="auth-logo"><Vault /></div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join UniVault — storage for JKUAT students & Juja residents</p>
        </div>

        {/* Role selector */}
        <div className="role-toggle" role="tablist" aria-label="Account type">
          <button type="button" role="tab" aria-selected={!isLandlord}
            className={`role-option${!isLandlord ? ' active' : ''}`} onClick={() => setRole('student')}>
            <GraduationCap />
            <span><strong>Student</strong><small>Find & book storage</small></span>
          </button>
          <button type="button" role="tab" aria-selected={isLandlord}
            className={`role-option${isLandlord ? ' active' : ''}`} onClick={() => setRole('landlord')}>
            <Home />
            <span><strong>Landlord</strong><small>List your space</small></span>
          </button>
        </div>

        {error && <div className="alert alert-error"><AlertTriangle /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input type="text" id="fullName" name="fullName" className="form-input" placeholder="e.g., John Kamau"
              value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <input type="email" id="reg-email" name="email" className="form-input" placeholder="you@example.com"
              value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="registrationNumber" className="form-label">
              {isLandlord ? 'National ID / Phone' : 'Registration Number'}
            </label>
            <input type="text" id="registrationNumber" name="registrationNumber" className="form-input"
              placeholder={isLandlord ? 'e.g., 12345678 or 0712 345 678' : 'e.g., SCT211-0001/2023'}
              value={formData.registrationNumber} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <input type="password" id="reg-password" name="password" className="form-input" placeholder="Min 6 characters"
                value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" className="form-input" placeholder="Re-enter password"
                value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : isLandlord ? 'Create Landlord Account' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
