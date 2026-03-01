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
                className="relative w-full h-[450px] rounded-[30px] overflow-hidden border border-white/20 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-out"
                style={{
                    transform: isHovered ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0)',
                    boxShadow: isHovered
                        ? '0px 20px 60px rgba(255,255,255,0.3)'
                        : '0px 10px 40px rgba(255,255,255,0.1)',
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
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    {/* Title */}
                    <h3 className="text-white font-semibold text-[18px] md:text-[20px] text-center mb-6 leading-[1.3] tracking-[-0.18px]">
                        {title}
                    </h3>

                    {/* Learn More Button */}
                    <button
                        className="w-full bg-white hover:bg-white/90 text-black font-semibold text-[16px] py-4 rounded-[30px] transition-all duration-300 flex items-center justify-center gap-2 group/button"
                        style={{
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                        }}
                    >
                        Learn More
                        <ChevronRight
                            size={18}
                            className="transition-transform duration-300 group-hover/button:translate-x-1"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
