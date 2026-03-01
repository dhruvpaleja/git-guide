import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import WorkshopHeroSection from '../features/workshop/components/WorkshopHeroSection';
import WorkshopCardsGrid from '../features/workshop/components/WorkshopCardsGrid';

export default function WorkshopDemoPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure we start at the top of the page when navigating here
        window.scrollTo(0, 0);
    }, []);

    const handleBack = () => {
        navigate('/business');
    };

    return (
        <main className="min-h-screen bg-black w-full overflow-hidden">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="fixed top-[calc(80px+15px)] left-[30px] z-40 p-2 hover:bg-white/10 rounded-full transition-all duration-200 group"
                aria-label="Go back"
            >
                <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Hero Section */}
            <WorkshopHeroSection />

            {/* Cards Grid Section */}
            <WorkshopCardsGrid />
        </main>
    );
}
