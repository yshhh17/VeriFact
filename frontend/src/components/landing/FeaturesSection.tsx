interface Feature {
  icon: string;
  title: string;
  description: string;
  tag: string;
}

const features: Feature[] = [
  {
    icon: '🎥',
    title: 'Video Analysis',
    description:
      'Detect deepfakes and manipulated videos using state-of-the-art AI frame-by-frame analysis.',
    tag: 'Deepfake',
  },
  {
    icon: '📸',
    title: 'Image Verification',
    description:
      'Identify altered or AI-generated images with pixel-level accuracy and metadata inspection.',
    tag: 'Vision AI',
  },
  {
    icon: '📝',
    title: 'Text Fact-Checking',
    description:
      'Extract and verify claims from text content against thousands of reliable sources in real time.',
    tag: 'NLP',
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    description:
      'End-to-end encryption and enterprise-grade security keep your data fully protected.',
    tag: 'Security',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description:
      'Get comprehensive results in under 2 seconds — no waiting, no queues.',
    tag: 'Performance',
  },
  {
    icon: '📊',
    title: 'Detailed Reports',
    description:
      'Download structured reports with confidence scores, source citations, and evidence breakdowns.',
    tag: 'Reporting',
  },
];

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
              <span className="feature-icon">{f.icon}</span>
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
