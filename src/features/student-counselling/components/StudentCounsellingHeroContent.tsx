import { ArrowDown } from 'lucide-react';

export default function StudentCounsellingHeroContent() {
    return (
        <div className="w-full h-full px-6 md:px-8 py-16 md:py-24 flex flex-col">
            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full">
                {/* Top Section */}
                <div className="flex flex-col gap-8 md:gap-12">
                    {/* Category Label */}
                    <div className="text-white/60 font-semibold text-[14px] md:text-[16px] tracking-[-0.16px]">
                        Business | B2B
                    </div>

                    {/* Main Title */}
                    <div className="max-w-2xl">
                        <h1 className="text-white font-semibold text-[40px] md:text-[48px] lg:text-[56px] tracking-[-0.32px] leading-[1.2]">
                            Student Counselling
                        </h1>
                        <p className="text-white/50 text-[14px] md:text-[16px] mt-6 hover:text-white/70 transition-colors cursor-pointer">
                            Back To Business
                        </p>
                    </div>
                </div>

                {/* Content Grid - Image and Text */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-16">
                    {/* Image Section */}
                    <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-[24px] overflow-hidden border border-white/20 shadow-lg">
                        <img
                            src="/images/student-counselling/hero-student.jpg"
                            alt="Student Counselling"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Text Content Section */}
                    <div className="space-y-6 md:space-y-8 flex flex-col justify-center">
                        {/* Section 1: Topic */}
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex gap-2 md:gap-3 items-start">
                                <span className="text-white font-semibold text-[16px] md:text-[18px] whitespace-nowrap">Topic -</span>
                                <span className="text-white font-semibold text-[16px] md:text-[18px]">Student Counselling.</span>
                            </div>
                            <p className="text-white/80 text-[14px] md:text-[16px] leading-[26px] md:leading-[30px] tracking-[-0.16px]">
                                Accessible and affordable mental health support for college students.
                            </p>
                        </div>

                        {/* Section 2: Problem */}
                        <div className="space-y-2 md:space-y-3 pt-4 md:pt-6">
                            <div className="flex gap-2 md:gap-3 items-start">
                                <span className="text-white font-semibold text-[16px] md:text-[18px] whitespace-nowrap">Problem -</span>
                                <span className="text-white font-semibold text-[16px] md:text-[18px]">The Mental Crisis Among Students.</span>
                            </div>
                            <p className="text-white/80 text-[14px] md:text-[16px] leading-[26px] md:leading-[30px] tracking-[-0.16px]">
                                Academic pressure, social anxiety, and emotional instability impact students' performance and overall wellbeing.
                            </p>
                        </div>

                        {/* Section 3: Solution */}
                        <div className="space-y-2 md:space-y-3 pt-4 md:pt-6">
                            <div className="flex gap-2 md:gap-3 items-start">
                                <span className="text-white font-semibold text-[16px] md:text-[18px] whitespace-nowrap">Solution -</span>
                                <span className="text-white font-semibold text-[16px] md:text-[18px]">Our Student Counselling Services.</span>
                            </div>
                            <p className="text-white/80 text-[14px] md:text-[16px] leading-[26px] md:leading-[30px] tracking-[-0.16px]">
                                We provide students with 1:1 expert counselling, early emotional screening, and continuous support through digital wellbeing tools.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="flex justify-center pt-12 md:pt-16">
                    <ArrowDown size={24} className="text-white/40 animate-bounce" />
                </div>
            </div>
        </div>
    );
}
