import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import StatsSection from '@/sections/StatsSection';
import WellnessSection from '@/sections/WellnessSection';
import ServicesSection from '@/sections/ServicesSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import SoulBotSection from '@/sections/SoulBotSection';
import CorporateSection from '@/sections/CorporateSection';
import FAQSection from '@/sections/FAQSection';
import CTASection from '@/sections/CTASection';
import Footer from '@/sections/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
