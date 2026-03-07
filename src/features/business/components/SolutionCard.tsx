import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SolutionCardProps {
    title: string;
    category: string;
    metricsText: string;
    description: string;
    imagePath: string;
    imagePosition?: 'left' | 'right';
    linkTo?: string;
}

export default function SolutionCard({
    title,
    category,
    metricsText,
    description,
    imagePath,
    imagePosition = 'left',
    linkTo,
}: SolutionCardProps) {
    const navigate = useNavigate();
    const isRightAlign = imagePosition === 'left';

    const handleClick = () => {
        if (linkTo) {
            navigate(linkTo);
        }
    };

    return (
        <div className={`w-full max-w-[1240px] mx-auto bg-white rounded-[32px] border border-black/5 overflow-hidden flex flex-col ${imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch min-h-[300px] md:min-h-[500px] shadow-sm hover:shadow-lg transition-shadow duration-500`}>

            {/* Image Container */}
            <div className="w-full md:w-1/2 relative bg-zinc-100 min-h-[300px] md:min-h-full">
                <img
                    src={imagePath}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Content Container */}
            <div className={`w-full md:w-1/2 p-8 md:p-14 lg:p-20 flex flex-col justify-center relative bg-gradient-to-br from-white to-[#F8F9FA]/50`}>

                {/* Top Metric */}
                <div className={`flex w-full mb-16 md:mb-24 ${isRightAlign ? 'justify-end text-right' : 'justify-start text-left'}`}>
                    <span
                        className="text-[12px] md:text-[13px] text-black/60 font-medium"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {metricsText}
                    </span>
                </div>

                {/* Text Body */}
                <div className={`flex flex-col mb-12 w-full ${isRightAlign ? 'items-end text-right' : 'items-start text-left'}`}>
                    <span
                        className="text-[14px] md:text-[16px] text-black/70 mb-3"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {category}
                    </span>
                    <h3
                        className="text-[28px] md:text-[40px] font-semibold text-black leading-[1.2] tracking-[-0.8px] mb-6"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {title}
                    </h3>
                    <p
                        className={`text-[15px] md:text-[17px] text-black/60 leading-[28px] md:leading-[32px] max-w-[480px] ${isRightAlign ? 'ml-auto' : 'mr-auto'}`}
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {description}
                    </p>
                </div>

                {/* Action Button */}
                <div className={`flex w-full mt-auto ${isRightAlign ? 'justify-end' : 'justify-start'}`}>
                    <button
                        onClick={handleClick}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-black/10 hover:border-black/30 hover:bg-black/5 transition-all group"
                    >
                        <span
                            className="text-[15px] font-medium text-black"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            Request A Demo
                        </span>
                        <ArrowRight size={18} className="text-black transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
