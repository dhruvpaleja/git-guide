import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function CorporateHero() {
    return (
        <section className="relative w-full bg-black pt-[100px]">
            {/* Secondary Nav */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-16 mb-4">
                <div className="flex items-center justify-between text-[12px] uppercase tracking-[2px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    <span className="text-white/50">Business</span>
                    <img src="/images/main-logo.png" alt="Soul Yatri" className="w-[36px] h-[30px] object-contain" />
                    <Link to="/home" className="text-white/50 hover:text-white transition-colors">Home</Link>
                </div>
            </div>

            {/* Back arrow */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-16 mb-2">
                <Link to="/business" className="inline-flex items-center text-white/40 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </Link>
            </div>

            {/* Page Title */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-16 mb-2">
                <h1
                    className="text-white text-[28px] md:text-[36px] font-semibold leading-[1.2]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    Corporate Wellness
                </h1>
                <div className="flex items-center gap-4 mt-2">
                    <Link to="/business" className="text-white/40 text-[12px] hover:text-white transition-colors" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        Back To Business
                    </Link>
                    <button className="text-white/40 text-[12px] hover:text-white transition-colors" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        Report
                    </button>
                </div>
            </div>

            {/* Hero Content: Image + Stacked Cards */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-16 pt-6 pb-16 flex flex-col md:flex-row gap-6 items-stretch">
                {/* Left: Image */}
                <div className="w-full md:w-[40%] rounded-2xl overflow-hidden min-h-[380px] md:min-h-[480px] relative">
                    <img
                        src="/images/corporate-figma.png"
                        alt="Corporate Wellness"
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    />
                </div>

                {/* Right: Stacked Info Cards */}
                <div className="w-full md:w-[60%] flex flex-col gap-4">
                    {/* Card 1: Employee Counselling */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
                        <h2
                            className="text-white text-[20px] md:text-[24px] font-semibold mb-3"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            Employee Counselling
                        </h2>
                        <p
                            className="text-white/50 text-[13px] md:text-[14px] leading-[22px]"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            Our expert-led wellbeing programs are designed to bring emotional and mental health resources to your teams and communities.
                        </p>
                    </div>

                    {/* Card 2: Problem */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
                        <h3
                            className="text-white text-[16px] md:text-[18px] font-semibold mb-3"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            Problem - Why Employee's need Counselling?
                        </h3>
                        <p
                            className="text-white/50 text-[13px] md:text-[14px] leading-[22px]"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            Stress, deadlines, and workplace pressures affect an employee's focus, morale and productivity. Many employees struggle silently with emotional challenges.
                        </p>
                    </div>

                    {/* Card 3: Solution */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
                        <h3
                            className="text-white text-[16px] md:text-[18px] font-semibold mb-3"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            Solution - Our Employee Counselling Program.
                        </h3>
                        <p
                            className="text-white/50 text-[13px] md:text-[14px] leading-[22px]"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            We offer a holistic counselling ecosystem that provides employees with access to certified counsellors, emotional support, and personalized wellbeing plans.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
