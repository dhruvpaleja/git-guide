import { useEffect, useRef, useState } from 'react';

export default function VisionMission() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-white relative py-[64px] sm:py-[80px]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between relative">

                {/* Left Text Column */}
                <div
                    className="w-full lg:w-1/2 pr-0 lg:pr-12 relative z-10"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <div className="mb-4">
                        <span className="text-[#18A2B8] uppercase tracking-widest text-[13px] sm:text-[16px] font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>
                            SOUL YATRI'S
                        </span>
                        <h2 className="text-[34px] sm:text-[40px] md:text-[48px] font-bold text-black mt-1 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Vision & Mission
                        </h2>
                    </div>

                    <div className="mt-8 space-y-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        <div>
                            <h3 className="text-[24px] sm:text-[28px] font-bold text-black mb-3">Our Vision</h3>
                            <p className="text-[#000000] opacity-80 text-[16px] sm:text-[18px] leading-[28px] sm:leading-[30px] font-normal">
                                To create a world where mental health support is universally accessible, deeply personal, and completely free of stigma. We envision a society that prioritizes psychological well-being as a fundamental foundation for a fulfilling life.
                            </p>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-[24px] sm:text-[28px] font-bold text-black mb-3">Our Mission</h3>
                            <p className="text-[#000000] opacity-80 text-[16px] sm:text-[18px] leading-[28px] sm:leading-[30px] font-normal">
                                By bridging the gap between those seeking harmony and the best wellness practices, we aim to deliver uncompromising quality in mental health services, fostering safe spaces for everyone to travel within.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Image Column */}
                <div
                    className="w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-end relative"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
                        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                    }}
                >
                    {/* Subtle Background Ellipses per Figma */}
                    <div className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-[#18A2B8]/5 blur-[60px] -z-10" />
                    <div className="absolute bottom-10 left-10 w-[200px] h-[200px] rounded-full bg-[#FF7B00]/5 blur-[40px] -z-10" />

                    <div className="relative w-full max-w-[600px] aspect-[600/845] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Try standard path, if not found we will replace it later */}
                        <img
                            src="/images/about/hero-image.jpg"
                            alt="Soul Yatri Vision"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Placeholder fallback
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop';
                            }}
                        />
                        {/* Overlay gradient as seen in Figma */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                    </div>
                </div>

            </div>
        </section>
    );
}
