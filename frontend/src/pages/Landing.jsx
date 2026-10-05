import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🎓 Built for JKUAT Students & Juja Community</div>
          <h1 className="hero-title" id="hero-title">
            Secure <span className="gradient-text">Storage in Juja</span> Made Simple
          </h1>
          <p className="hero-description" id="hero-description">
            The #1 storage solution for JKUAT students and Juja residents. 
            Store your belongings safely during semester breaks, hostel transitions, 
            or whenever you need extra space — right here in Juja.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-cta-dashboard">
                  Go to Dashboard
                  <span className="btn-icon">→</span>
                </Link>
                <Link to="/storage" className="btn btn-outline btn-lg" id="hero-cta-browse">
                  Browse Storage
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta-register">
                  Get Started Free
                  <span className="btn-icon">→</span>
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" id="hero-cta-login">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-label">JKUAT Students</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">200+</span>
              <span className="hero-stat-label">Units in Juja</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">99.9%</span>
              <span className="hero-stat-label">Security Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">Built for <span className="gradient-text">JKUAT & Juja</span></h2>
            <p className="section-subtitle">The most reliable storage solution designed specifically for JKUAT students and the Juja community.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card" id="feature-secure">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🛡️</span>
              </div>
              <h3 className="feature-title">24/7 Secured Units</h3>
              <p className="feature-description">
                Round-the-clock CCTV surveillance and individual unit locks 
                located within Juja town. Your items are safe whether you&apos;re 
                on campus or back home.
              </p>
              <div className="feature-tag">Juja Town</div>
            </div>
            <div className="feature-card featured" id="feature-affordable">
              <div className="feature-badge">Most Popular</div>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💰</span>
              </div>
              <h3 className="feature-title">Student-Friendly Pricing</h3>
              <p className="feature-description">
                Affordable plans designed for students on a budget. 
                No hidden fees, no long-term commitments. 
                Perfect for semester breaks and hostel transitions.
              </p>
              <div className="feature-tag">From KES 1,500/month</div>
            </div>
            <div className="feature-card" id="feature-convenient">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">⚡</span>
              </div>
              <h3 className="feature-title">Minutes from JKUAT</h3>
              <p className="feature-description">
                All storage units are located within Juja, just minutes 
                from JKUAT main campus. Book online and access your unit 
                with your student ID.
              </p>
              <div className="feature-tag">Near JKUAT Gate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">Get Started in <span className="gradient-text">3 Easy Steps</span></h2>
            <p className="section-subtitle">From sign up to storage in under 5 minutes.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card" id="step-1">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Create Account</h3>
                <p className="step-description">
                  Sign up with your JKUAT email or personal email and your registration number. Verification is instant.
                </p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="step-card" id="step-2">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Browse & Book</h3>
                <p className="step-description">
                  Find the perfect unit near JKUAT. Filter by size, location within Juja, and price.
                </p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="step-card" id="step-3">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Store & Relax</h3>
                <p className="step-description">
                  Drop off your items at our Juja location and enjoy peace of mind. Access anytime, 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta" id="footer-cta">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to Secure Your <span className="gradient-text">Belongings</span>?</h2>
            <p className="cta-description">Join hundreds of JKUAT students and Juja residents who trust UNIVAULT for their storage needs.</p>
            <Link to="/register" className="btn btn-primary btn-lg" id="footer-cta-btn">
              Start Storing Today
              <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="navbar-logo"><span className="logo-icon">◈</span> UNIVAULT</span>
              <p className="footer-tagline">Secure storage for JKUAT students & Juja community.</p>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Contact Us</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 UNIVAULT &mdash; Juja, Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
