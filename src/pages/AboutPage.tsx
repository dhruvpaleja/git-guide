import AboutHero from '@/features/about/components/AboutHero';
import AboutStats from '@/features/about/components/AboutStats';
import VisionMission from '@/features/about/components/VisionMission';
import FoundersSection from '@/features/about/components/FoundersSection';
import ValuesSection from '@/features/about/components/ValuesSection';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function AboutPage() {
  useDocumentTitle('About Us');
    return (
        <main className="bg-white min-h-screen">
            <AboutHero />
            <AboutStats />
            <VisionMission />
            <FoundersSection />
            <ValuesSection />
        </main>
    );
}
