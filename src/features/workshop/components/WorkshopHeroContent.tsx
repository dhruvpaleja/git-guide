import { ArrowDown } from 'lucide-react';

export default function WorkshopHeroContent() {
    return (
        <div className="w-full h-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 flex flex-col">
            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full">
                {/* Top Section */}
                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                    {/* Category Label */}
                    <div className="text-white/60 font-semibold text-xs sm:text-sm tracking-tight">
                        Business | B2B
                    </div>

                    {/* Main Title */}
                    <div className="max-w-2xl">
                        <h1 className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.2]">
                            Workshops & Training
                        </h1>
                        <p className="text-white/50 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 hover:text-white/70 transition-colors cursor-pointer">
                            Back To Business
                        </p>
                    </div>
                </div>

                {/* Content Grid - Image and Text */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-8 md:mt-10">
                    {/* Image Section */}
                    <div className="relative h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-lg">
                        <img
                            src="/images/workshops/stress-anxiety.jpg"
                            alt="Workshops & Training"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Text Content Section */}
                    <div className="space-y-4 sm:space-y-5 md:space-y-6 flex flex-col justify-center">
                        {/* Section 1: Topic */}
                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex gap-1.5 md:gap-2 items-start">
                                <span className="text-white font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Topic -</span>
                                <span className="text-white font-semibold text-xs sm:text-sm md:text-base">Workshops & Trainings.</span>
                            </div>
                            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed tracking-tight">
                                Live, expert-led wellbeing sessions designed to strengthen emotional resilience across teams and communities.
                            </p>
                        </div>

                        {/* Section 2: Problem */}
                        <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-3">
                            <div className="flex gap-1.5 md:gap-2 items-start">
                                <span className="text-white font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Problem -</span>
                                <span className="text-white font-semibold text-xs sm:text-sm md:text-base">Why Workshops Matter?</span>
                            </div>
                            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed tracking-tight">
                                Organizations and campuses often struggle with stress, low morale, and emotional fatigue. Structured wellbeing education is essential for long-term balance.
                            </p>
                        </div>

                        {/* Section 3: Solution */}
                        <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-3">
                            <div className="flex gap-1.5 md:gap-2 items-start">
                                <span className="text-white font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Solution -</span>
                                <span className="text-white font-semibold text-xs sm:text-sm md:text-base">Our Workshops & Training Programs.</span>
                            </div>
                            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed tracking-tight">
                                We deliver interactive, research-backed workshops focused on stress management, emotional intelligence, leadership mindfulness, and more.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="flex justify-center pt-6 sm:pt-8 md:pt-10">
                    <ArrowDown size={20} className="text-white/40 animate-bounce" />
                </div>
            </div>
        </div>
    );
}
