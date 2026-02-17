import HeroSection from '@/sections/HeroSection';
import StatsSection from '@/sections/StatsSection';
import WellnessSection from '@/sections/WellnessSection';
import ServicesSection from '@/sections/ServicesSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import SoulBotSection from '@/sections/SoulBotSection';
import CorporateSection from '@/sections/CorporateSection';
import FAQSection from '@/sections/FAQSection';

export default function HomePage() {
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
    </>
  );
}
