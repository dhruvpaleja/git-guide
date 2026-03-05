import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import StudentCounsellingHeroSection from '../features/student-counselling/components/StudentCounsellingHeroSection';
import StudentCounsellingCardsGrid from '../features/student-counselling/components/StudentCounsellingCardsGrid';

export default function StudentCounsellingDemoPage() {
    useDocumentTitle('Student Counselling Demo');
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
            <StudentCounsellingHeroSection />

            {/* Cards Grid Section */}
            <StudentCounsellingCardsGrid />
        </main>
    );
}
