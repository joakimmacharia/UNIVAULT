import { useNavigate } from 'react-router-dom';
import {
  Mail, GraduationCap, Calendar, BadgeCheck, LogOut,
  Bell, CreditCard, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import Avatar from '../components/ui/Avatar';

const preferences = [
  { icon: Bell, title: 'Notification Settings', desc: 'Manage how you receive updates.' },
  { icon: CreditCard, title: 'Payment Methods', desc: 'Manage your saved cards and wallets.' },
  { icon: ShieldCheck, title: 'Security', desc: 'Change password and security settings.' },
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile <span className="gradient-text">Information</span></h1>
          <p className="page-subtitle">Manage your account information and preferences.</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left profile card */}
        <div className="profile-card">
          <Avatar src={user?.avatar} name={user?.full_name} size="xl" ring />
          <h2 className="profile-name">{user?.full_name || 'User'}</h2>
          <span className="badge badge-purple profile-role-badge">JKUAT Student</span>

          <div className="profile-details">
            <div className="profile-detail-item">
              <Mail />
              <div><span className="profile-detail-label">Email</span><span className="profile-detail-value">{user?.email || 'N/A'}</span></div>
            </div>
            <div className="profile-detail-item">
              <GraduationCap />
              <div><span className="profile-detail-label">Registration Number</span><span className="profile-detail-value">{user?.registration_number || 'N/A'}</span></div>
            </div>
            <div className="profile-detail-item">
              <Calendar />
              <div><span className="profile-detail-label">Member Since</span><span className="profile-detail-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'May 2024'}
              </span></div>
            </div>
            <div className="profile-detail-item">
              <BadgeCheck />
              <div><span className="profile-detail-label">Verified</span><span className="profile-detail-value" style={{ color: 'var(--green)' }}>Yes</span></div>
            </div>
          </div>

          <button className="btn btn-outline btn-full" onClick={handleLogout}><LogOut size={17} /> Sign Out</button>
        </div>

        {/* Right: preferences */}
        <div>
          <div className="detail-card" style={{ marginBottom: 20 }}>
            <h3 className="detail-section-title">Account</h3>
            <div className="detail-info-grid">
              <div className="detail-info-item"><span className="detail-info-label">Account type</span><span className="detail-info-value">Student</span></div>
              <div className="detail-info-item"><span className="detail-info-label">Status</span><span className="detail-info-value" style={{ color: 'var(--green)' }}>Active</span></div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-section-title" style={{ marginBottom: 16 }}>Preferences</h3>
            <div className="settings-list">
              {preferences.map(({ icon: Icon, title, desc }) => (
                <button className="setting-row" key={title}>
                  <span className="setting-ic"><Icon /></span>
                  <div className="st-body">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                  <ChevronRight className="chev" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
