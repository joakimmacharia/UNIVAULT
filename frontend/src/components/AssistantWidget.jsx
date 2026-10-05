import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { DAVID } from '../data/assets';
import Avatar from './ui/Avatar';

/** Floating "Chat with David" helper, used across the app. */
const AssistantWidget = () => {
  const navigate = useNavigate();
  return (
    <button className="assistant-fab" onClick={() => navigate('/assistant')} aria-label="Chat with David">
      <Avatar src={DAVID.img} name={DAVID.name} size="md" online />
      <span className="txt">
        <strong>Need help?</strong>
        <span><MessageCircle /> Chat with {DAVID.name}</span>
      </span>
    </button>
  );
};

export default AssistantWidget;
