import { useEffect, useState } from 'react';
import StudentCounsellingCard from './StudentCounsellingCard';

const studentCounsellingCards = [
    {
        title: 'Subsidized Counselling Access',
        imagePath: '/images/student-counselling/counselling-access.jpg',
        gradientOverlayPath: '/images/student-counselling/gradient-overlay.jpg',
    },
    {
        title: 'On Campus or Online Screenings',
        imagePath: '/images/student-counselling/online-screenings.jpg',
        gradientOverlayPath: '/images/student-counselling/gradient-overlay.jpg',
    },
    {
        title: 'Emotional Screenings & Assessment',
        imagePath: '/images/student-counselling/emotional-assessment.jpg',
        gradientOverlayPath: '/images/student-counselling/gradient-overlay.jpg',
    },
    {
        title: 'Certified Student Counsellors',
        imagePath: '/images/student-counselling/certified-counsellors.jpg',
        gradientOverlayPath: '/images/student-counselling/gradient-overlay.jpg',
    },
    {
        title: 'Crisis Support Availability',
        imagePath: '/images/student-counselling/crisis-support.jpg',
        gradientOverlayPath: '/images/student-counselling/gradient-overlay.jpg',
    },
];

export default function StudentCounsellingCardsGrid() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Duplicate cards for infinite scroll effect
    const duplicatedCards = [...studentCounsellingCards, ...studentCounsellingCards, ...studentCounsellingCards];

    return (
        <section className="w-full bg-black py-12 md:py-16 lg:py-20">
            <div className="w-full">
                {/* Section Title with fade-in animation */}
                <div
                    className={`text-center mb-8 md:mb-12 px-4 transition-all duration-700 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    <h2 className="text-white font-semibold text-xl md:text-2xl lg:text-3xl tracking-tight leading-[1.2]">
                        Soul Yatri Student Counselling Services
                    </h2>
                </div>

                {/* Auto-scrolling Carousel Container */}
                <div className="relative overflow-hidden">
                    {/* Gradient Overlays for fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                    {/* Scrolling Cards */}
                    <div
                        className={`flex gap-4 md:gap-6 ${
                            isPaused ? '' : 'animate-scroll'
                        }`}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        style={{
                            width: 'max-content',
                        }}
                    >
                        {duplicatedCards.map((card, index) => (
                            <div
                                key={`${card.title}-${index}`}
                                className={`flex-shrink-0 transition-opacity duration-700 ${
                                    isLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                    transitionDelay: `${Math.min(index, 5) * 100}ms`,
                                }}
                            >
                                <StudentCounsellingCard
                                    title={card.title}
                                    imagePath={card.imagePath}
                                    gradientOverlayPath={card.gradientOverlayPath}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator Text */}
                <div
                    className={`text-center mt-8 md:mt-12 px-4 transition-all duration-700 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0'
                    }`}
                    style={{
                        transitionDelay: '600ms',
                    }}
                >
                    <p className="text-white/40 text-xs md:text-sm">
                        Hover over cards to pause • Auto-scrolling carousel
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
