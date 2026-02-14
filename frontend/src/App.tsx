import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">✓</span>
            <span className="logo-text">VeriFact</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button className="btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Verify Truth in the Age of Misinformation
          </h1>
          <p className="hero-subtitle">
            Advanced AI-powered fact-checking and deepfake detection to help you distinguish truth from fiction
          </p>
          <div className="hero-buttons">
            <button className="btn-large btn-primary">Start Verifying</button>
            <button className="btn-large btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <div className="icon-large">🔍</div>
            <h3>Analyze Content</h3>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="section-title">Powerful Detection Capabilities</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎥</div>
            <h3>Video Analysis</h3>
            <p>Detect deepfakes and manipulated videos using advanced AI algorithms</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Image Verification</h3>
            <p>Identify altered or AI-generated images with high accuracy</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Text Fact-Checking</h3>
            <p>Extract and verify claims from text content against reliable sources</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2 className="section-title">Why VeriFact?</h2>
          <p className="about-text">
            In an era where misinformation spreads faster than truth, VeriFact empowers individuals 
            and organizations to verify content authenticity. Our cutting-edge AI technology combines 
            multiple detection methods including OCR, image captioning, and advanced machine learning 
            models to provide comprehensive analysis.
          </p>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">99.5%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Analyses Performed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">&lt;2s</div>
              <div className="stat-label">Average Detection Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>VeriFact</h4>
            <p>Protecting truth in the digital age</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@verifact.com</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <p>Twitter | LinkedIn | GitHub</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 VeriFact. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
