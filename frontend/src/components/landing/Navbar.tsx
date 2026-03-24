interface NavbarProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export default function Navbar({ onLogin, onGetStarted }: NavbarProps) {
  return (
    <header className="nav-shell">
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo" aria-label="VeriFact home">
            <span className="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z" fill="currentColor" />
                <path d="m9.4 12.6 1.9 1.9 3.6-4" stroke="#05110B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
          <span className="logo-text">VeriFact</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#cta">Pricing</a>
            <button className="btn-outline" onClick={onLogin}>
              Log In
            </button>
            <button className="btn-primary" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
          <button className="nav-mobile-menu" onClick={onGetStarted} aria-label="Open auth">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
