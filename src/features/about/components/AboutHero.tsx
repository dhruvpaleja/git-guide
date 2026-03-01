import { useEffect, useRef, useState } from 'react';

export default function AboutHero() {
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative w-full pt-[140px] pb-[80px] flex flex-col items-center justify-center bg-white"
        >
            <div
                className="w-full text-center px-4"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <h1
                    className="text-[32px] md:text-[42px] font-semibold leading-tight md:leading-[80px] tracking-[-0.42px]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    <span style={{ color: '#FF7B00' }}>We see you. </span>
                    <span style={{ color: '#18A2B8' }}>We hear you.</span>
                    <br className="hidden md:block" />
                    <span style={{ color: '#000000' }}>We travel within — together.</span>
                </h1>
            </div>

            {/* Scroll Down Arrow */}
            <div
                className="mt-20 flex justify-center items-center w-[60px] h-[60px] rounded-full border border-black/10 cursor-pointer hover:bg-black/5 transition-colors"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                }}
                onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    );
}
