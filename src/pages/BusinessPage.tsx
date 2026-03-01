import { useEffect } from 'react';
import BusinessHero from '../features/business/components/BusinessHero';
import SolutionsIntro from '../features/business/components/SolutionsIntro';
import BusinessSolutions from '../features/business/components/BusinessSolutions';

export default function BusinessPage() {
    useEffect(() => {
        // Ensure we start at the top of the page when navigating here
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="min-h-screen bg-[#F8F9FA] w-full pt-[20px] pb-20">
            <BusinessHero />
            <SolutionsIntro />
            <BusinessSolutions />
        </main>
    );
}
