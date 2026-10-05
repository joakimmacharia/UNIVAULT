import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send, Star, Sparkles, Clock, ChevronRight,
  Wallet, CalendarCheck, ShieldCheck, HelpCircle,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import { sendAssistantMessage } from '../services/api';
import { DAVID, DEMO_UNITS, roomImage } from '../data/assets';

const TOPICS = [
  { icon: Wallet, label: 'Pricing and payments' },
  { icon: CalendarCheck, label: 'Booking and drop-offs' },
  { icon: ShieldCheck, label: 'Safety and security' },
  { icon: HelpCircle, label: 'General questions' },
];

// Local canned fallback used only if the Gemini backend is unreachable.
const fallbackReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes('price') || t.includes('pay') || t.includes('cost'))
    return 'Storage near JKUAT starts from KSh 850/month. You only pay for the months you book, plus a small service fee, via M-Pesa at checkout.';
  if (t.includes('safe') || t.includes('secur'))
    return 'Every space is verified and most offer 24/7 security and CCTV. Your items are looked after while stored with a UniVault landlord.';
  if (t.includes('book') || t.includes('drop'))
    return 'You can book in minutes: pick a space, choose your drop-off and pick-up dates, and pay securely. Free cancellation up to 24h before drop-off.';
  return 'Here are some great options for you near JKUAT — take a look below and let me know if you’d like to book one.';
};

const wantsRecommendation = (text) => /storage|space|room|find|book|near|option/i.test(text);

const ChatDavid = () => {
  const [messages, setMessages] = useState([
    { from: 'them', text: 'Hi Patrick! I’m David, your personal storage advisor. How can I help you today?', time: '10:24 AM' },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [showRec, setShowRec] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, showRec, typing]);

  const push = async (text) => {
    const history = messages.map((m) => ({ role: m.from, content: m.text }));
    setMessages((m) => [...m, { from: 'me', text, time: 'Now' }]);
    setTyping(true);
    const rec = wantsRecommendation(text);
    try {
      const res = await sendAssistantMessage(text, history);
      setMessages((m) => [...m, { from: 'them', text: res.data.reply, time: 'Now' }]);
    } catch {
      setMessages((m) => [...m, { from: 'them', text: fallbackReply(text), time: 'Now' }]);
    } finally {
      setTyping(false);
      if (rec) setShowRec(true);
    }
  };

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim() || typing) return;
    push(draft.trim());
    setDraft('');
  };

  const rec = DEMO_UNITS[0];

  return (
    <div className="page">
      <div className="david-page">
        {/* Left concierge panel */}
        <aside className="david-left">
          <div className="david-id">
            <Avatar src={DAVID.img} name={DAVID.name} size="xl" className="avatar-xl" />
            <div>
              <h2>{DAVID.name}</h2>
              <div className="role">{DAVID.role}</div>
              <span className="david-online"><span className="dot" /> Online now</span>
            </div>
          </div>

          <p className="david-intro">
            Your personal concierge for finding safe, affordable storage near JKUAT.
            Ask me anything — I’m here to help you book with confidence.
          </p>

          <div className="david-prompts-label">Popular questions</div>
          {TOPICS.map(({ icon: Icon, label }) => (
            <button key={label} className="david-prompt" onClick={() => !typing && push(label)}>
              <span className="pic"><Icon /></span>
              <span>{label}</span>
              <span className="arw"><ChevronRight /></span>
            </button>
          ))}

          <div className="david-foot"><Sparkles /> Powered by AI · Replies in seconds</div>
        </aside>

        {/* Right chat */}
        <section className="david-right">
          <header className="dc-header">
            <Avatar src={DAVID.img} name={DAVID.name} size="md" online />
            <div className="hh">
              <h4>{DAVID.name}</h4>
              <div className="sub"><span className="dot" /> Online · typically replies instantly</div>
            </div>
            <span className="dc-ai"><Sparkles /> AI Assistant</span>
          </header>

          <div className="dc-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`dc-line ${m.from === 'me' ? 'me' : 'them'}`}>
                <div className="dc-msg">
                  {m.from === 'them' && <Avatar src={DAVID.img} name={DAVID.name} size="sm" />}
                  <div className="dc-bubble">{m.text}</div>
                </div>
                <span className="dc-time">{m.time}</span>
              </div>
            ))}

            {typing && (
              <div className="dc-line them">
                <div className="dc-msg">
                  <Avatar src={DAVID.img} name={DAVID.name} size="sm" />
                  <div className="dc-bubble typing-bubble" aria-label="David is typing">
                    <span className="typing-dots"><i /><i /><i /></span>
                  </div>
                </div>
              </div>
            )}

            {showRec && (
              <div className="dc-line them">
                <div className="dc-msg">
                  <Avatar src={DAVID.img} name={DAVID.name} size="sm" />
                  <div className="rec-card card-flat" style={{ padding: 12, maxWidth: 320, boxShadow: 'var(--shadow-xs)' }}>
                    <img src={roomImage(rec.id)} alt={rec.unit_number} />
                    <div style={{ flex: 1 }}>
                      <h4>{rec.unit_number}</h4>
                      <div className="loc">{rec.distance}</div>
                      <div className="amt" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>KSh {rec.price_per_month}
                        <span style={{ color: 'var(--text-3)', fontWeight: 400, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          · <Star size={12} style={{ color: 'var(--orange)', fill: 'var(--orange)' }} /> {rec.rating}
                        </span>
                      </div>
                    </div>
                    <Link to={`/storage/${rec.id}`} className="btn btn-primary btn-sm">View details</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="dc-input" onSubmit={send}>
            <div className="dc-input-wrap">
              <Sparkles />
              <input placeholder="Ask David anything about storage..." value={draft}
                onChange={(e) => setDraft(e.target.value)} disabled={typing} />
            </div>
            <button className="dc-send" type="submit" aria-label="Send" disabled={typing || !draft.trim()}><Send /></button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ChatDavid;
