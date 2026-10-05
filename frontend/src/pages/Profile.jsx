import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My <span className="gradient-text">Profile</span></h1>
          <p className="page-subtitle">Manage your account information</p>
        </div>

        <div className="profile-grid">
          <div className="profile-card" id="profile-info-card">
            <div className="profile-avatar-large">
              <span>{user?.full_name?.charAt(0) || 'U'}</span>
            </div>
            <h2 className="profile-name">{user?.full_name || 'User'}</h2>
            <span className="profile-role-badge">Student</span>

            <div className="profile-details">
              <div className="profile-detail-item">
                <span className="profile-detail-icon">📧</span>
                <div>
                  <span className="profile-detail-label">Email</span>
                  <span className="profile-detail-value">{user?.email || 'N/A'}</span>
                </div>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-icon">🎓</span>
                <div>
                  <span className="profile-detail-label">Registration Number</span>
                  <span className="profile-detail-value">{user?.registration_number || 'N/A'}</span>
                </div>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-icon">📅</span>
                <div>
                  <span className="profile-detail-label">Member Since</span>
                  <span className="profile-detail-value">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <button className="btn btn-outline btn-full" id="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
