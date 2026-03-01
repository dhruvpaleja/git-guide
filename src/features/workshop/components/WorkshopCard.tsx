import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface WorkshopCardProps {
    title: string;
    imagePath: string;
    gradientOverlayPath: string;
    index?: number;
}

export default function WorkshopCard({
    title,
    imagePath,
    gradientOverlayPath,
    index = 0,
}: WorkshopCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Stagger animation delay for each card
    const staggerDelay = index * 50;

    return (
        <div
            className="relative group h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transitionDelay: `${staggerDelay}ms`,
            }}
        >
            {/* Card Container with border */}
            <div
                className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[320px] sm:h-[340px] md:h-[360px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-out"
                style={{
                    transform: isHovered ? 'scale(1.03) translateY(-8px)' : 'scale(1) translateY(0)',
                    boxShadow: isHovered
                        ? '0px 15px 40px rgba(255,255,255,0.25)'
                        : '0px 8px 30px rgba(255,255,255,0.1)',
                }}
            >
                {/* Image Container */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={imagePath}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        style={{
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={gradientOverlayPath}
                        alt="gradient"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Section */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg text-center mb-3 md:mb-4 leading-[1.3] tracking-tight">
                        {title}
                    </h3>

                    {/* Learn More Button */}
                    <button
                        className="w-full bg-white hover:bg-white/90 text-black font-semibold text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 group/button"
                        style={{
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                        }}
                    >
                        Learn More
                        <ChevronRight
                            size={16}
                            className="transition-transform duration-300 group-hover/button:translate-x-1"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
