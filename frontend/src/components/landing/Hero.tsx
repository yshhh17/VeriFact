interface HeroProps {
  onStartVerifying: () => void;
  onLearnMore: () => void;
}

export default function Hero({ onStartVerifying, onLearnMore }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">🛡️ AI-Powered Fact Detection</div>
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
            Start Verifying Free →
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
        <div className="visual-card">
          <div className="visual-badge visual-badge--analyzing">● Analyzing…</div>
          <div className="icon-large">🔍</div>
          <h3>Analyze Content</h3>
          <p className="visual-desc">Upload a video, image, or paste text to get started</p>
          <div className="visual-chips">
            <span className="chip chip--green">✓ Authentic</span>
            <span className="chip chip--red">⚠ Deepfake</span>
            <span className="chip chip--yellow">? Unverified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
