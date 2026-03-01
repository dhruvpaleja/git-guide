import AboutHero from '@/features/about/components/AboutHero';
import AboutStats from '@/features/about/components/AboutStats';
import VisionMission from '@/features/about/components/VisionMission';
import FoundersSection from '@/features/about/components/FoundersSection';
import ValuesSection from '@/features/about/components/ValuesSection';

export default function AboutPage() {
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
