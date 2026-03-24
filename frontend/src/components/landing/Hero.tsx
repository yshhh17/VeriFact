interface HeroProps {
  onStartVerifying: () => void;
  onLearnMore: () => void;
}

export default function Hero({ onStartVerifying, onLearnMore }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-glow hero-glow--left" aria-hidden="true" />
      <div className="hero-glow hero-glow--right" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-badge">AI-Powered Verification Platform</div>
        <h1 className="hero-title">
          Verify Truth in the Age of{' '}
          <span className="hero-highlight">Misinformation</span>
        </h1>
        <p className="hero-subtitle">
          Advanced AI-powered fact-checking and deepfake detection to help you
          distinguish truth from fiction — in seconds.
        </p>
        <div className="hero-buttons">
          <button className="btn-large btn-primary-hero" onClick={onStartVerifying}>
            Start Verifying Free
          </button>
          <button className="btn-large btn-ghost" onClick={onLearnMore}>
            See How It Works
          </button>
        </div>
        <div className="hero-social-proof">
          <span>Trusted by</span>
          <strong>10,000+</strong>
          <span>journalists, researchers & educators</span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-card" aria-hidden="true">
          <div className="visual-badge visual-badge--analyzing">Analyzing Live Stream</div>
          <div className="visual-graphic">
            <svg viewBox="0 0 420 260" role="img" focusable="false">
              <defs>
                <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1D392F" />
                  <stop offset="100%" stopColor="#0A1511" />
                </linearGradient>
                <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2FCB93" />
                  <stop offset="100%" stopColor="#75F5C4" />
                </linearGradient>
              </defs>
              <rect x="12" y="16" width="396" height="228" rx="24" fill="url(#frame)" stroke="#2A4F42" />
              <rect x="36" y="46" width="348" height="56" rx="14" fill="#0C1814" stroke="#1F3B31" />
              <rect x="36" y="120" width="250" height="14" rx="7" fill="#153227" />
              <rect x="36" y="145" width="312" height="14" rx="7" fill="#17382C" />
              <rect x="36" y="170" width="180" height="14" rx="7" fill="#153227" />
              <path d="M48 216C104 180 146 194 192 176c38-14 82-70 160-54" stroke="url(#line)" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="352" cy="162" r="34" fill="#0E2019" stroke="#2FCB93" />
              <path d="M338 162h28M352 148v28" stroke="#75F5C4" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h3>Analyze Content</h3>
          <p className="visual-desc">Upload a video, image, or text for instant credibility scoring.</p>
          <div className="visual-chips">
            <span className="chip chip--green">Authentic</span>
            <span className="chip chip--red">Deepfake</span>
            <span className="chip chip--yellow">Unverified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
