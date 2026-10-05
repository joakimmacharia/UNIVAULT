import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, UserPlus, ListPlus, CalendarCheck, Coins, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANDLORD_HERO_IMG } from '../data/assets';

const benefits = [
  'Reach thousands of JKUAT students',
  'We handle the marketing and security',
  'Get paid on time, every time',
  '24/7 support from our team',
];

const steps = [
  { n: '1', icon: UserPlus, title: 'Sign Up', desc: 'Create your landlord account.' },
  { n: '2', icon: ListPlus, title: 'List Your Space', desc: 'Add details & photos of your space.' },
  { n: '3', icon: CalendarCheck, title: 'Get Bookings', desc: 'Students book & pay securely.' },
  { n: '4', icon: Coins, title: 'Earn Money', desc: 'Receive payments monthly.' },
];

const stats = [
  { num: '2,500+', lbl: 'Active students' },
  { num: 'KSh 1.2M', lbl: 'Paid to landlords' },
  { num: '98%', lbl: 'On-time payments' },
  { num: '4.8/5', lbl: 'Average rating' },
];

const BecomeLandlord = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const startListing = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'landlord' ? '/list-space' : '/my-listings');
    } else {
      navigate('/register?role=landlord');
    }
  };

  return (
  <>
    <section className="section">
      <div className="landlord-hero">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <span className="section-eyebrow">Become a Landlord</span>
          <h1>Earn extra income by listing your space on UniVault.</h1>
          <p>Turn your spare room into steady income. We connect you with verified JKUAT students looking for safe, nearby storage.</p>

          <div className="landlord-benefits">
            {benefits.map((b) => (
              <div className="lb" key={b}><CheckCircle2 /> {b}</div>
            ))}
          </div>

          <button onClick={startListing} className="btn btn-primary btn-lg">Start Listing <ArrowRight size={18} /></button>
        </motion.div>

        <motion.div className="landlord-hero-img" initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <img src={LANDLORD_HERO_IMG} alt="A room available for storage" />
        </motion.div>
      </div>
    </section>

    <section className="section" style={{ paddingTop: 0 }}>
      <h2 style={{ fontSize: 26, marginBottom: 30 }}>How it works</h2>
      <div className="how-grid">
        {steps.map(({ n, icon: Icon, title, desc }, i) => (
          <motion.div className="how-card" key={title}
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { delay: i * 0.06 } } }}>
            <div className="how-ic"><Icon /></div>
            <span className="how-step-n">Step {n}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="section" style={{ paddingTop: 0 }}>
      <div className="card card-pad" style={{ padding: '40px' }}>
        <div className="stats-band">
          {stats.map((s) => (
            <div className="stat-big" key={s.lbl}>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
  );
};

export default BecomeLandlord;
