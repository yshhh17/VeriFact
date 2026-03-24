const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  Support: ['Documentation', 'Help Center', 'Contact Us', 'Status'],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z" fill="currentColor" />
                <path d="m9.4 12.6 1.9 1.9 3.6-4" stroke="#05110B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className="logo-text">VeriFact</span>
          </div>
          <p className="footer-tagline">Protecting truth in the digital age.</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">X</a>
            <a href="#" aria-label="LinkedIn">In</a>
            <a href="#" aria-label="GitHub">GH</a>
          </div>
        </div>

        {Object.entries(footerLinks).map(([category, links]) => (
          <div className="footer-section" key={category}>
            <h4>{category}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} VeriFact. All rights reserved.</p>
        <p className="footer-bottom-right">Built to fight misinformation.</p>
      </div>
    </footer>
  );
}
