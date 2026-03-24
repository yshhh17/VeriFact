interface Stat {
  value: string;
  label: string;
  icon: 'accuracy' | 'analysis' | 'speed' | 'sources';
}

const stats: Stat[] = [
  { value: '99.5%', label: 'Accuracy Rate', icon: 'accuracy' },
  { value: '1M+', label: 'Analyses Performed', icon: 'analysis' },
  { value: '<2s', label: 'Avg. Detection Time', icon: 'speed' },
  { value: '50+', label: 'Trusted Sources', icon: 'sources' },
];

const StatIcon = ({ type }: { type: Stat['icon'] }) => {
  switch (type) {
    case 'accuracy':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'analysis':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M5 18V9M10 18V6M15 18v-4M20 18v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'speed':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M4 13a8 8 0 1 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m12 13 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M7 7h7v7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m17 7-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="4" y="13" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="13" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
  }
};

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
              <div className="stat-icon"><StatIcon type={s.icon} /></div>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
