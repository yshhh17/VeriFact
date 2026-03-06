interface NavbarProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export default function Navbar({ onLogin, onGetStarted }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <span className="logo-icon">✓</span>
          <span className="logo-text">VeriFact</span>
        </div>
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
        {/* Mobile hamburger placeholder */}
        <button className="nav-mobile-menu" onClick={onGetStarted}>
          ☰
        </button>
      </div>
    </nav>
  );
}
