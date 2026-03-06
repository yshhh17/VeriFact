interface Stat {
  value: string;
  label: string;
  icon: string;
}

const stats: Stat[] = [
  { value: '99.5%', label: 'Accuracy Rate', icon: '🎯' },
  { value: '1M+', label: 'Analyses Performed', icon: '📈' },
  { value: '<2s', label: 'Avg. Detection Time', icon: '⚡' },
  { value: '50+', label: 'Trusted Sources', icon: '🔗' },
];

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <div className="section-header">
          <span className="section-eyebrow">Our Mission</span>
          <h2 className="section-title">Why VeriFact?</h2>
        </div>
        <p className="about-text">
          In an era where misinformation spreads faster than truth, VeriFact empowers
          individuals and organizations to verify content authenticity. Our cutting-edge AI
          technology combines multiple detection methods — OCR, image captioning, and advanced
          machine learning — to provide comprehensive, explainable analysis you can trust.
        </p>
        <div className="stats">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
