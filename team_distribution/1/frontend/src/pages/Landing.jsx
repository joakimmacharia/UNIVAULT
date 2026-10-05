import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Star, ShieldCheck, Video, MapPin, Heart, ArrowRight,
  Wallet, Lock, Umbrella, PackageSearch, CreditCard, Package, Truck,
  GraduationCap, Building2, Users, Home, Clock, Sparkles, Apple, Play,
} from 'lucide-react';
import {
  HERO_ROOM_IMG, DEMO_UNITS, roomImage, REVIEWS, DAVID,
} from '../data/assets';
import Avatar from '../components/ui/Avatar';

/* Scroll-reveal helper */
const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] } }),
};
const Reveal = ({ children, i = 0, className = '' }) => (
  <motion.div className={`lp-fade ${className}`} variants={reveal} custom={i}
    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
    {children}
  </motion.div>
);

const Stars = ({ n = 5 }) => (
  <span className="lp-stars">{Array.from({ length: n }).map((_, i) => <Star key={i} />)}</span>
);

const trusted = [
  { icon: GraduationCap, label: 'JKUAT' },
  { icon: Building2, label: 'UniHostels' },
  { icon: ShieldCheck, label: 'Verified Landlords' },
  { icon: Users, label: 'Campus Students' },
  { icon: Home, label: '1000+ Rooms' },
  { icon: Clock, label: '24/7 Support' },
];

const why = [
  { icon: ShieldCheck, title: 'Verified Landlords', text: 'Every landlord is background-checked and every space is inspected before listing.' },
  { icon: Wallet, title: 'Student Friendly', text: 'Transparent, affordable monthly pricing — pay only for the months you need.' },
  { icon: Lock, title: 'Safe Storage', text: 'CCTV-monitored spaces with secure access, so your belongings stay protected.' },
  { icon: Umbrella, title: 'Insurance', text: 'Optional protection cover for complete peace of mind while you travel.' },
];

const steps = [
  { n: '1', icon: PackageSearch, title: 'Search', text: 'Browse verified storage near JKUAT and compare prices.' },
  { n: '2', icon: CreditCard, title: 'Book', text: 'Reserve your space and pay securely with M-Pesa.' },
  { n: '3', icon: Package, title: 'Drop Off', text: 'Bring your items to the landlord at a time that suits you.' },
  { n: '4', icon: Truck, title: 'Pick Up', text: 'Collect everything, clean and safe, when you return.' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [where, setWhere] = useState('');
  const featured = DEMO_UNITS.slice(0, 3);

  const go = (e) => { e.preventDefault(); navigate('/storage'); };

  return (
    <div className="lp">
      {/* 1 · HERO */}
      <section className="lp-hero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="lp-hero-badge"><Sparkles size={15} /> Trusted student storage near JKUAT</span>
          <h1>Store your belongings <span className="accent">safely</span> while you're away.</h1>
          <p className="lp-hero-tag">Book secure, verified storage near campus in minutes — and travel worry-free.</p>

          <form className="lp-search" onSubmit={go}>
            <label className="lp-search-field">
              <span style={{ fontSize: 11, fontWeight: 700 }}>Where</span>
              <input placeholder="Near JKUAT, Juja" value={where} onChange={(e) => setWhere(e.target.value)} />
            </label>
            <label className="lp-search-field">
              <span style={{ fontSize: 11, fontWeight: 700 }}>Move in</span>
              <input type="date" />
            </label>
            <label className="lp-search-field">
              <span style={{ fontSize: 11, fontWeight: 700 }}>Move out</span>
              <input type="date" />
            </label>
            <button className="lp-search-btn" type="submit" aria-label="Find storage"><Search /></button>
          </form>

          <div className="lp-trust-inline">
            <Stars />
            <span className="t">Trusted by <strong>2,300+ students</strong></span>
          </div>
        </motion.div>

        <motion.div className="lp-hero-media" initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="lp-hero-img"><img src={HERO_ROOM_IMG} alt="A clean, secure storage room" /></div>

          <motion.div className="lp-float lp-float-verified"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <span className="vic"><ShieldCheck /></span>
            <div><strong>Verified</strong><span>Inspected landlord</span></div>
          </motion.div>

          <motion.div className="lp-float lp-float-cctv"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <Video /> CCTV secured
          </motion.div>

          <motion.div className="lp-float lp-float-price"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="p">KSh 900</div><div className="u">per month</div>
          </motion.div>

          <motion.div className="lp-float lp-float-loc"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <MapPin /> 2 mins from Gate A
          </motion.div>
        </motion.div>
      </section>

      {/* 2 · TRUSTED STRIP */}
      <div className="lp-trusted">
        <div className="lp-trusted-inner">
          {trusted.map(({ icon: Icon, label }) => (
            <span className="lp-trusted-item" key={label}><Icon /> {label}</span>
          ))}
        </div>
      </div>

      {/* 4 · FEATURED */}
      <section className="lp-section" id="featured">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-head">
              <span className="lp-eyebrow">Featured storage</span>
              <h2 className="lp-h2">Beautiful spaces near campus</h2>
              <p className="lp-sub">Hand-picked, verified rooms students actually love — book in a couple of taps.</p>
            </div>
          </Reveal>

          <div className="lp-cards">
            {featured.map((u, i) => (
              <Reveal i={i} key={u.id}>
                <article className="lp-card" onClick={() => navigate(`/storage/${u.id}`)}>
                  <div className="lp-card-media">
                    <span className="lp-card-tag"><ShieldCheck /> Verified</span>
                    <span className="lp-card-fav"><Heart /></span>
                    <img src={roomImage(u.id)} alt={u.unit_number} />
                  </div>
                  <div className="lp-card-body">
                    <div className="lp-card-row">
                      <div>
                        <h3 className="lp-card-title">{u.unit_number}</h3>
                        <div className="lp-card-loc"><MapPin /> {u.location}</div>
                      </div>
                      <span className="lp-card-rate"><Star /> {u.rating}</span>
                    </div>
                    <div className="lp-card-chips">
                      {u.amenities.slice(0, 3).map((a) => <span className="chip" key={a}><ShieldCheck /> {a}</span>)}
                    </div>
                    <div className="lp-card-foot">
                      <div className="lp-card-price"><strong>KSh {u.price_per_month}</strong> <span>/month</span></div>
                      <span className="lp-card-link">View details <ArrowRight /></span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · MAP */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-head">
              <span className="lp-eyebrow">On the map</span>
              <h2 className="lp-h2">Storage near JKUAT</h2>
              <p className="lp-sub">See verified spaces around campus, Gachororo, Theta and Juja town.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="lp-map-wrap">
              <iframe title="Storage near JKUAT" loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.985%2C-1.115%2C37.045%2C-1.075&layer=mapnik&marker=-1.0947%2C37.0144" />
              <span className="lp-map-pin active" style={{ top: '30%', left: '42%' }}>KSh 900</span>
              <span className="lp-map-pin" style={{ top: '52%', left: '60%' }}>KSh 1,200</span>
              <span className="lp-map-pin" style={{ top: '64%', left: '34%' }}>KSh 850</span>
              <span className="lp-map-pin" style={{ top: '40%', left: '72%' }}>KSh 1,000</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 · WHY (glass cards) */}
      <section className="lp-section lp-why">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-head center">
              <span className="lp-eyebrow">Why UniVault</span>
              <h2 className="lp-h2">Storage students can trust</h2>
              <p className="lp-sub">Everything is built around safety, transparency and convenience.</p>
            </div>
          </Reveal>
          <div className="lp-why-grid">
            {why.map(({ icon: Icon, title, text }, i) => (
              <Reveal i={i} key={title}>
                <div className="lp-glass">
                  <div className="lp-glass-ic"><Icon /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · HOW IT WORKS (timeline) */}
      <section className="lp-section" id="how-it-works">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-head center">
              <span className="lp-eyebrow">How it works</span>
              <h2 className="lp-h2">Four simple steps</h2>
            </div>
          </Reveal>
          <div className="lp-timeline">
            {steps.map(({ n, icon: Icon, title, text }, i) => (
              <Reveal i={i} key={title}>
                <div className="lp-tl-item">
                  <div className="lp-tl-node">{n}</div>
                  <div className="lp-tl-body">
                    <h3><Icon /> {title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · REVIEWS */}
      <section className="lp-section" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-head center">
              <span className="lp-eyebrow">Loved by students</span>
              <h2 className="lp-h2">4.9 average from 2,300+ students</h2>
            </div>
          </Reveal>
          <div className="lp-reviews">
            {REVIEWS.map((r, i) => (
              <Reveal i={i} key={r.name}>
                <div className="lp-review">
                  <Stars n={r.rating} />
                  <p className="lp-review-text">“{r.text}”</p>
                  <div className="lp-review-by">
                    <Avatar src={r.avatar} name={r.name} size="md" />
                    <div><strong>{r.name}</strong><span>{r.school}</span></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 · BECOME A LANDLORD */}
      <section className="lp-section">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-landlord">
              <div className="lp-landlord-txt">
                <span className="lp-eyebrow">For landlords</span>
                <h2>Earn passive income from your empty room.</h2>
                <p>List your space on UniVault and start earning from verified JKUAT students. We handle discovery, payments and security.</p>
                <Link to="/become-landlord" className="btn btn-gradient btn-lg">Become a Landlord <ArrowRight size={18} /></Link>
              </div>
              <div className="lp-landlord-media"><img src={roomImage(2)} alt="A room available to list" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11 · MOBILE APP */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <div className="lp-app">
            <Reveal>
              <div>
                <span className="lp-eyebrow">UniVault mobile</span>
                <h2 className="lp-h2">Your storage, in your pocket.</h2>
                <p className="lp-sub">Search, book, pay and chat with David — all from the app. Track your storage and access your locker PIN anytime.</p>
                <div className="lp-app-badges">
                  <a href="#" className="app-btn"><Play /><span><small>GET IT ON</small><strong>Google Play</strong></span></a>
                  <a href="#" className="app-btn"><Apple /><span><small>Download on the</small><strong>App Store</strong></span></a>
                </div>
              </div>
            </Reveal>
            <Reveal i={1}>
              <div className="lp-phones">
                <div className="lp-phone back">
                  <div className="lp-phone-screen">
                    <span className="lp-phone-notch" />
                    <img src={roomImage(4)} alt="app preview" />
                    <div className="lp-phone-ui"><div className="bar w70" /><div className="bar w45" /><div className="pill" /></div>
                  </div>
                </div>
                <div className="lp-phone front">
                  <div className="lp-phone-screen">
                    <span className="lp-phone-notch" />
                    <img src={roomImage(1)} alt="app preview" />
                    <div className="lp-phone-ui"><div className="bar w70" /><div className="bar w45" /><div className="pill" /></div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
