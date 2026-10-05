import { useState, useRef, useEffect } from 'react';
import { Search, Send, MoreVertical, MapPin } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import { sendAssistantMessage } from '../services/api';
import { DEMO_CONVERSATIONS } from '../data/assets';

// Canned fallback for the support (David) thread if Gemini is unreachable.
const fallbackReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes('price') || t.includes('pay') || t.includes('cost'))
    return 'Storage near JKUAT ranges from about KSh 850–1,500/month, paid via M-Pesa at checkout.';
  if (t.includes('safe') || t.includes('secur'))
    return 'All our landlords are verified and many units have CCTV and 24/7 access. Your items are in safe hands.';
  return "Happy to help! You can ask me about pricing, booking, drop-offs, or safety — or browse listings to get started.";
};

const Messages = () => {
  const [convs, setConvs] = useState(DEMO_CONVERSATIONS);
  const [activeId, setActiveId] = useState(DEMO_CONVERSATIONS[0].id);
  const [draft, setDraft] = useState('');
  const [tab, setTab] = useState('all');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  const active = convs.find((c) => c.id === activeId);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.messages, typing, activeId]);

  const appendTo = (id, msg) =>
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, messages: [...c.messages, msg] } : c)));

  const send = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;

    const conv = convs.find((c) => c.id === activeId);
    const history = conv.messages.map((m) => ({ role: m.from, content: m.text }));

    setDraft('');
    appendTo(activeId, { from: 'me', text, time: 'Now' });

    // Only the AI-backed "UniVault Support" thread auto-replies; landlord
    // threads are real people, so we just post the outgoing message.
    if (!conv.support) return;

    setTyping(true);
    try {
      const res = await sendAssistantMessage(text, history);
      appendTo(activeId, { from: 'them', text: res.data.reply, time: 'Now' });
    } catch {
      appendTo(activeId, { from: 'them', text: fallbackReply(text), time: 'Now' });
    } finally {
      setTyping(false);
    }
  };

  const shown = convs.filter((c) => (tab === 'all' ? true : tab === 'support' ? c.support : !c.support));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <span className="loc-select"><MapPin /> Juja</span>
      </div>

      <div className="messages-grid">
        {/* Conversation list */}
        <div className="conv-list">
          <div className="conv-search">
            <div className="searchbar"><Search /><input placeholder="Search messages..." /></div>
          </div>
          <div className="conv-tabs">
            {[['all', 'All'], ['landlords', 'Landlords'], ['support', 'UniVault Support']].map(([k, l]) => (
              <button key={k} className={`conv-tab${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <div className="conv-items">
            {shown.map((c) => (
              <div key={c.id} className={`conv-item${c.id === activeId ? ' active' : ''}`} onClick={() => setActiveId(c.id)}>
                <Avatar src={c.avatar} name={c.name} size="md" online={c.online} />
                <div className="ci-body">
                  <div className="ci-top">
                    <span className="ci-name">{c.name}{c.support && <span className="badge badge-purple" style={{ marginLeft: 8, padding: '2px 8px', fontSize: 10 }}>AI</span>}</span>
                    <span className="ci-time">{c.time}</span>
                  </div>
                  <div className="ci-sub">{c.sub}</div>
                </div>
                {c.unread && <span className="side-badge" style={{ alignSelf: 'center' }}>1</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="chat-window">
          {active && (
            <>
              <div className="chat-header">
                <Avatar src={active.avatar} name={active.name} size="md" online={active.online} />
                <div style={{ flex: 1 }}>
                  <h4>{active.name}{active.support && <span className="badge badge-purple" style={{ marginLeft: 8, padding: '2px 8px', fontSize: 10 }}>AI Assistant</span>}</h4>
                  {active.online && <span className="status">● Online</span>}
                </div>
                <button className="nav-icon-btn"><MoreVertical /></button>
              </div>

              <div className="chat-body" ref={bodyRef}>
                {active.messages.map((m, i) => (
                  <div key={i} className={`chat-row${m.from === 'me' ? ' me' : ''}`}>
                    <div className={`chat-bubble ${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
                    <span className="chat-time">{m.time}</span>
                  </div>
                ))}
                {typing && active.support && (
                  <div className="chat-row">
                    <div className="chat-bubble them typing-bubble" aria-label="David is typing">
                      <span className="typing-dots"><i /><i /><i /></span>
                    </div>
                  </div>
                )}
              </div>

              <form className="chat-input-bar" onSubmit={send}>
                <input placeholder={active.support ? 'Ask David anything...' : 'Type a message...'}
                  value={draft} onChange={(e) => setDraft(e.target.value)} disabled={typing} />
                <button className="chat-send" type="submit" aria-label="Send" disabled={typing}><Send /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
