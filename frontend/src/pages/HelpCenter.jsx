import { Link } from 'react-router-dom';
import {
  Search, HelpCircle, CreditCard, ShieldCheck, CalendarCheck,
  Package, Home, Phone, Mail, Clock, Sparkles,
} from 'lucide-react';
import { HELP_TOPICS } from '../data/assets';
import Avatar from '../components/ui/Avatar';
import { DAVID } from '../data/assets';

const ICONS = { HelpCircle, CreditCard, ShieldCheck, CalendarCheck, Package, Home };

const HelpCenter = () => (
  <div className="page">
    <div className="help-hero">
      <h1>How can we <span className="gradient-text">help you?</span></h1>
      <div className="searchbar"><Search /><input placeholder="Search for help articles..." /></div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }} className="help-layout">
      <div>
        <h3 className="section-heading" style={{ marginBottom: 18 }}>Popular Topics</h3>
        <div className="faq-grid">
          {HELP_TOPICS.map((t) => {
            const Icon = ICONS[t.icon] || HelpCircle;
            return (
              <Link to="/assistant" className="faq-card" key={t.title}>
                <div className="fic"><Icon /></div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="help-support">
          <Avatar src={DAVID.img} name={DAVID.name} size="lg" ring online />
          <h3 style={{ marginTop: 14 }}>Still need help?</h3>
          <p>Talk to David — our support team is here for you.</p>
          <Link to="/assistant" className="btn btn-white"><Sparkles size={16} /> Chat now</Link>
        </div>

        <div className="contact-card">
          <h3 className="sidebar-title" style={{ marginBottom: 6 }}>Contact Us</h3>
          <div className="contact-row"><Phone /><div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Phone</div><strong>+254 700 000 000</strong></div></div>
          <div className="contact-row"><Mail /><div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Email</div><strong>support@univault.co.ke</strong></div></div>
          <div className="contact-row"><Clock /><div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Hours</div><strong>Mon – Sun, 8AM – 8PM</strong></div></div>
        </div>
      </aside>
    </div>
  </div>
);

export default HelpCenter;
