import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const goToAuth = () => navigate('/auth');

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <Navbar onLogin={goToAuth} onGetStarted={goToAuth} />
      <Hero onStartVerifying={goToAuth} onLearnMore={scrollToFeatures} />
      <FeaturesSection />
      <AboutSection />
      <CtaSection onGetStarted={goToAuth} />
      <Footer />
    </div>
  );
}
