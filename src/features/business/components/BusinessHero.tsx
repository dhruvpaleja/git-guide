import { Search } from 'lucide-react';

export default function BusinessHero() {
    return (
        <section className="w-full flex justify-center pt-[140px] pb-[80px] px-6">
            <div className="max-w-[800px] w-full flex flex-col items-center text-center">
                <h1
                    className="text-[40px] md:text-[54px] font-semibold text-black leading-[1.2] tracking-[-1.08px] mb-6"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    Improve Engagement. Reduce Attrition.
                </h1>

                <p
                    className="text-[16px] md:text-[20px] font-normal text-black/60 leading-[32px] mb-12 max-w-[700px]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    Customizable, scalable, and measurable mental wellbeing programs for your company or campus.
                </p>

                <div className="relative w-full max-w-[480px]">
                    <input
                        type="text"
                        placeholder="Search for Services..."
                        className="w-full h-[60px] pl-6 pr-14 rounded-full bg-[#F3F3F3] border border-black/5 text-[16px] outline-none placeholder:text-black/40 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-colors"
                    >
                        <Search size={20} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </section>
    );
}
