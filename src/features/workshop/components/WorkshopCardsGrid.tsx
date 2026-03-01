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

    useEffect(() => {
        // Trigger animations on mount
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="w-full bg-black py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                {/* Section Title with fade-in animation */}
                <div
                    className={`text-center mb-16 md:mb-24 transition-all duration-700 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    <h2 className="text-white font-semibold text-[32px] md:text-[40px] tracking-[-0.32px] leading-[1.2]">
                        Soul Yatri Offers For Corporate Wellness
                    </h2>
                </div>

                {/* Cards Grid - Responsive layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
                    {workshopCards.map((card, index) => (
                        <div
                            key={index}
                            className={`transition-all duration-700 ${
                                isLoaded
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                                transitionDelay: `${(index + 1) * 100}ms`,
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

                {/* Navigation Dots with fade-in animation */}
                <div
                    className={`flex justify-center gap-2 mt-16 md:mt-24 transition-all duration-700 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0'
                    }`}
                    style={{
                        transitionDelay: `${(workshopCards.length + 1) * 100}ms`,
                    }}
                >
                    {[...Array(5)].map((_, i) => (
                        <button
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === 0
                                    ? 'w-8 bg-white hover:bg-white/80'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to card ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
