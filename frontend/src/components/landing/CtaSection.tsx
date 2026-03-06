interface CtaSectionProps {
  onGetStarted: () => void;
}

export default function CtaSection({ onGetStarted }: CtaSectionProps) {
  return (
    <section id="cta" className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Fight Misinformation?</h2>
        <p className="cta-subtitle">
          Join thousands of journalists, educators, and researchers using VeriFact every day.
          Start for free — no credit card required.
        </p>
        <div className="cta-actions">
          <button className="btn-large btn-primary-cta" onClick={onGetStarted}>
            Get Started for Free
          </button>
          <div className="cta-disclaimer">
            ✓ Free plan available &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Cancel anytime
          </div>
        </div>
      </div>
      <div className="cta-decoration" aria-hidden="true">
        <span>🛡️</span>
      </div>
    </section>
  );
}
