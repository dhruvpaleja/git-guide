import Navigation from '@/pages/sections/landing_page/Navigation';
import HeroSection from '@/pages/sections/landing_page/HeroSection';
import StatsSection from '@/pages/sections/landing_page/StatsSection';
import WellnessSection from '@/pages/sections/landing_page/WellnessSection';
import ServicesSection from '@/pages/sections/landing_page/ServicesSection';
import HowItWorksSection from '@/pages/sections/landing_page/HowItWorksSection';
import SoulBotSection from '@/pages/sections/landing_page/SoulBotSection';
import CorporateSection from '@/pages/sections/landing_page/CorporateSection';
import FAQSection from '@/pages/sections/landing_page/FAQSection';
import Footer from '@/pages/sections/landing_page/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <WellnessSection />
        <ServicesSection />
        <HowItWorksSection />
        <SoulBotSection />
        <CorporateSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
