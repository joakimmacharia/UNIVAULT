import { Link } from 'react-router-dom';
import { ShieldCheck, Users, MapPin, Sparkles } from 'lucide-react';
import { DAVID } from '../data/assets';
import Avatar from '../components/ui/Avatar';

const values = [
  { icon: ShieldCheck, title: 'Trust & Safety', desc: 'Every landlord is background-checked and every space is verified before listing.' },
  { icon: Users, title: 'Student First', desc: 'Built around the needs of JKUAT students with affordable, flexible plans.' },
  { icon: MapPin, title: 'Close to Campus', desc: 'Storage within walking distance so drop-off and pick-up are effortless.' },
];

const About = () => (
  <>
    <section className="section">
      <div className="section-center">
        <span className="section-eyebrow">About UniVault</span>
        <h2>Storage that students can actually trust.</h2>
        <p>We connect JKUAT students with trusted landlords near campus for secure and affordable storage during the holidays.</p>
      </div>

      <div className="how-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {values.map(({ icon: Icon, title, desc }) => (
          <div className="how-card" key={title}>
            <div className="how-ic"><Icon /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="section" style={{ paddingTop: 0 }}>
      <div className="david-banner" style={{ maxWidth: 720, margin: '0 auto' }}>
        <Avatar src={DAVID.img} name={DAVID.name} size="lg" online />
        <div className="db-txt">
          <strong>Meet {DAVID.name}, your Personal Storage Advisor</strong>
          <span>Friendly guidance whenever you need it — from booking to pick-up.</span>
        </div>
        <div className="db-actions">
          <Link to="/assistant" className="btn btn-white"><Sparkles size={16} /> Chat now</Link>
        </div>
      </div>
    </section>
  </>
);

export default About;
