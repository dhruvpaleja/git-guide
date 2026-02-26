import HeroSection from '@/features/landing/components/HeroSection';
import StatsSection from '@/features/landing/components/StatsSection';
import WellnessSection from '@/features/landing/components/WellnessSection';
import ServicesSection from '@/features/landing/components/ServicesSection';
import HowItWorksSection from '@/features/landing/components/HowItWorksSection';
import SoulBotSection from '@/features/landing/components/SoulBotSection';
import CorporateSection from '@/features/landing/components/CorporateSection';
import FAQSection from '@/features/landing/components/FAQSection';
import CTASection from '@/features/landing/components/CTASection';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <WellnessSection />
      <ServicesSection />
      <HowItWorksSection />
      <SoulBotSection />
      <CorporateSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
