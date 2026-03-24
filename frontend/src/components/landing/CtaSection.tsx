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
            Free plan available &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Cancel anytime
          </div>
        </div>
      </div>
      <div className="cta-decoration" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img" focusable="false">
          <defs>
            <linearGradient id="shield" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#84FFD1" />
              <stop offset="100%" stopColor="#29C78F" />
            </linearGradient>
          </defs>
          <path d="M32 6 12 13v14c0 14 9 27 20 31 11-4 20-17 20-31V13L32 6Z" fill="url(#shield)" />
          <path d="m25.5 31.7 4.6 4.6 9-10" fill="none" stroke="#082017" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
