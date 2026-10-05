import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const ComingSoon = ({ title = 'Coming Soon' }) => (
  <DashboardLayout>
    <div className="empty-state" style={{ marginTop: 40 }}>
      <div className="empty-icon"><Sparkles /></div>
      <h3>{title}</h3>
      <p>This section is on its way. Check back shortly.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>
  </DashboardLayout>
);

export default ComingSoon;
