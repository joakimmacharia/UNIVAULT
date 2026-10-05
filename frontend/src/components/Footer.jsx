import { Link } from 'react-router-dom';
import { AtSign, Camera, Hash, Apple, Play } from 'lucide-react';
import Logo from './ui/Logo';

const cols = [
  { title: 'For Students', links: [
    ['Find Storage', '/storage'], ['How It Works', '/#how-it-works'],
    ['Safety Tips', '/help'], ['Help Center', '/help'],
  ] },
  { title: 'For Landlords', links: [
    ['List Your Space', '/become-landlord'], ['Landlord Guide', '/become-landlord'],
    ['FAQs', '/help'], ['Contact Us', '/help'],
  ] },
  { title: 'Company', links: [
    ['About Us', '/about'], ['Careers', '/about'],
    ['Terms & Conditions', '/about'], ['Privacy Policy', '/about'],
  ] },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand-col">
        <Logo />
        <p className="footer-tag">The #1 storage platform for JKUAT students. Store safely. Travel worry-free.</p>
      </div>

      {cols.map((c) => (
        <div className="footer-col" key={c.title}>
          <h4>{c.title}</h4>
          <ul>{c.links.map(([label, to]) => (
            <li key={label}>{to.includes('#') ? <a href={to}>{label}</a> : <Link to={to}>{label}</Link>}</li>
          ))}</ul>
        </div>
      ))}

      <div className="footer-col">
        <h4>Follow Us</h4>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><AtSign /></a>
          <a href="#" aria-label="Instagram"><Camera /></a>
          <a href="#" aria-label="X"><Hash /></a>
        </div>
        <h4 style={{ marginTop: 26 }}>Download App</h4>
        <div className="footer-apps">
          <a href="#" className="app-btn"><Play /><span><small>GET IT ON</small><strong>Google Play</strong></span></a>
          <a href="#" className="app-btn"><Apple /><span><small>Download on the</small><strong>App Store</strong></span></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">© 2025 UniVault. All rights reserved.</div>
  </footer>
);

export default Footer;
