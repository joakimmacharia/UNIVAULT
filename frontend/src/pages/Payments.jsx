import { useState } from 'react';
import { Wallet, Smartphone, ShieldCheck, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../services/api';

const Payments = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || isNaN(amount) || amount < 10) {
      setError('Please enter a valid amount (minimum KSh 10).');
      return;
    }

    if (!phone || phone.length < 9) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      // Ensure phone is formatted correctly (e.g., 2547XXXXXXXX)
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      await initiatePayment({
        phoneNumber: formattedPhone,
        amount: parseInt(amount, 10),
      });

      setSuccess('M-Pesa payment prompt sent to your phone. Please check and enter your PIN to complete the transaction.');
      setAmount('');
      setPhone('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to initiate payment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Wallet & <span className="gradient-text">Payments</span></h1>
          <p className="page-subtitle">Manage your funds and add money to your UniVault wallet.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px' }}>
        {/* Left Column: Wallet Balance & Top Up Form */}
        <div>
          <div className="detail-card" style={{ marginBottom: '24px', background: 'var(--grad-purple)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={28} />
              </div>
              <div>
                <div style={{ opacity: 0.9, fontSize: '14px', fontWeight: 500 }}>Current Balance</div>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>
                  KSh {user?.wallet_balance?.toLocaleString() || '0'}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={20} className="ic-green" /> Top up with M-Pesa
            </h3>
            <p className="detail-text" style={{ marginBottom: '24px' }}>
              Add funds directly from your M-Pesa account. The amount will reflect in your wallet automatically.
            </p>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success"><CheckCircle2 size={18} /> {success}</div>}

            <form onSubmit={handlePayment}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 0712 345 678" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Amount (KSh)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Enter amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Sending Prompt...' : 'Pay with M-Pesa'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Information & History */}
        <div>
          <div className="detail-card" style={{ marginBottom: '24px' }}>
            <h3 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} className="ic-blue" /> Secure Transactions
            </h3>
            <p className="detail-text">
              All payments are processed securely via Daraja API. Your funds are safely held in your UniVault wallet and can be used for booking any storage unit on the platform.
            </p>
          </div>

          <div className="detail-card">
            <h3 className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} className="ic-orange" /> Recent Activity
            </h3>
            
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              <p>No recent transactions to show.</p>
            </div>
            
            {/* Example list format for future use:
            <div className="settings-list">
              <div className="setting-row">
                <div style={{ background: 'var(--green-light)', color: 'var(--green)', padding: '10px', borderRadius: '12px' }}>
                  <ArrowRight size={18} />
                </div>
                <div className="st-body">
                  <h4 style={{ fontSize: '14px' }}>Wallet Top Up</h4>
                  <p style={{ fontSize: '12px' }}>Yesterday, 14:30</p>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--green)' }}>+ KSh 2,500</div>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
