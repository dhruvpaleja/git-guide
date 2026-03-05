import { ArrowRight } from 'lucide-react';

export default function CorporateCTA() {
    return (
        <section className="w-full bg-black py-12 md:py-20">
            <div className="max-w-[1240px] mx-auto px-6 md:px-16">
                {/* Pagination dots (decorative) */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="w-8 h-1 rounded-full bg-white" />
                    <div className="w-2 h-1 rounded-full bg-white/20" />
                    <div className="w-2 h-1 rounded-full bg-white/20" />
                    <div className="w-2 h-1 rounded-full bg-white/20" />
                </div>

                {/* CTA Button */}
                <div className="flex justify-center mb-8">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-[15px] font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 group"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        Request A Demo
                        <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Consultation text */}
                <p
                    className="text-center text-white/50 text-[13px] md:text-[14px] leading-[22px] max-w-[600px] mx-auto"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    Book a free 30-minute consultation with our mindfulness strategist to experience how Soul Yatri can elevate your leaders' focus, empathy, and well-being.
                </p>
            </div>
        </section>
    );
}
