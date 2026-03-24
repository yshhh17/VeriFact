interface Feature {
  icon: 'video' | 'image' | 'text' | 'security' | 'speed' | 'report';
  title: string;
  description: string;
  tag: string;
}

const features: Feature[] = [
  {
    icon: 'video',
    title: 'Video Analysis',
    description:
      'Detect deepfakes and manipulated videos using state-of-the-art AI frame-by-frame analysis.',
    tag: 'Deepfake',
  },
  {
    icon: 'image',
    title: 'Image Verification',
    description:
      'Identify altered or AI-generated images with pixel-level accuracy and metadata inspection.',
    tag: 'Vision AI',
  },
  {
    icon: 'text',
    title: 'Text Fact-Checking',
    description:
      'Extract and verify claims from text content against thousands of reliable sources in real time.',
    tag: 'NLP',
  },
  {
    icon: 'security',
    title: 'Secure & Private',
    description:
      'End-to-end encryption and enterprise-grade security keep your data fully protected.',
    tag: 'Security',
  },
  {
    icon: 'speed',
    title: 'Lightning Fast',
    description:
      'Get comprehensive results in under 2 seconds — no waiting, no queues.',
    tag: 'Performance',
  },
  {
    icon: 'report',
    title: 'Detailed Reports',
    description:
      'Download structured reports with confidence scores, source citations, and evidence breakdowns.',
    tag: 'Reporting',
  },
];

const FeatureIcon = ({ type }: { type: Feature['icon'] }) => {
  switch (type) {
    case 'video':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <rect x="3" y="5" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m10 9 4 3-4 3V9Z" fill="currentColor" />
          <path d="m17 10 4-2v8l-4-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'image':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="9" cy="10" r="2" fill="currentColor" />
          <path d="m5 17 5-5 4 4 3-3 2 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'text':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M6 6h12M6 10h12M6 14h8M6 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'security':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M12 3 5 6v5c0 4.8 3.1 8.9 7 10 3.9-1.1 7-5.2 7-10V6l-7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m9.4 12.3 1.8 1.8 3.4-3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'speed':
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M4 13a8 8 0 1 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m12 13 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="13" r="1.8" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
};

export default function FeaturesSection() {
  return (
    <section id="features" className="features">
      <div className="section-header">
        <span className="section-eyebrow">What We Offer</span>
        <h2 className="section-title">Powerful Detection Capabilities</h2>
        <p className="section-subtitle">
          Everything you need to verify content authenticity — all in one place.
        </p>
      </div>
      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon-wrapper">
              <span className="feature-icon"><FeatureIcon type={f.icon} /></span>
            </div>
            <span className="feature-tag">{f.tag}</span>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
