import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useEffect } from 'react';
import CorporateHero from '@/features/business/components/corporate/CorporateHero';
import CorporateOfferings from '@/features/business/components/corporate/CorporateOfferings';
import CorporateCTA from '@/features/business/components/corporate/CorporateCTA';

export default function CorporatePage() {
  useDocumentTitle('Corporate Wellness');
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="min-h-screen bg-black w-full">
            <CorporateHero />
            <CorporateOfferings />
            <CorporateCTA />
        </main>
    );
}
