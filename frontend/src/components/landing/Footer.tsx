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
            <span className="logo-icon">✓</span>
            <span className="logo-text">VeriFact</span>
          </div>
          <p className="footer-tagline">Protecting truth in the digital age.</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">⎇</a>
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
        <p className="footer-bottom-right">Made with ❤️ to fight misinformation</p>
      </div>
    </footer>
  );
}
