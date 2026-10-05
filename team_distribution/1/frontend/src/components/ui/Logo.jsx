import { Link } from 'react-router-dom';
import { Vault } from 'lucide-react';

const Logo = ({ to = '/', light = false }) => (
  <Link to={to} className="brand" style={light ? { color: '#fff' } : undefined}>
    <span className="brand-logo"><Vault /></span>
    UniVault
  </Link>
);

export default Logo;
