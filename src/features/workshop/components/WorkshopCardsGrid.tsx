import { useEffect, useState } from 'react';
import WorkshopCard from './WorkshopCard';

const workshopCards = [
    {
        title: 'Stress & Anxiety Management',
        imagePath: '/images/workshops/stress-anxiety.jpg',
        gradientOverlayPath: '/images/workshops/gradient-overlay.jpg',
    },
    {
        title: 'Emotional Intelligence Training',
        imagePath: '/images/workshops/emotional-intelligence.jpg',
        gradientOverlayPath: '/images/workshops/gradient-overlay.jpg',
    },
    {
        title: 'Burnout Prevention',
        imagePath: '/images/workshops/burnout-prevention.jpg',
        gradientOverlayPath: '/images/workshops/gradient-overlay.jpg',
    },
    {
        title: 'Leadership Mindfulness',
        imagePath: '/images/workshops/leadership-mindfulness.jpg',
        gradientOverlayPath: '/images/workshops/gradient-overlay.jpg',
    },
    {
        title: 'Team Emotional Wellness',
        imagePath: '/images/workshops/team-wellness.jpg',
        gradientOverlayPath: '/images/workshops/gradient-overlay.jpg',
    },
];

export default function WorkshopCardsGrid() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Duplicate cards for infinite scroll effect
    const duplicatedCards = [...workshopCards, ...workshopCards, ...workshopCards];

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
                        Soul Yatri Offers For Corporate Wellness
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
                                <WorkshopCard
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
                    <p className="text-white/50 text-xs md:text-sm">
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
