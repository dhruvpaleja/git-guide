import { useEffect, useRef, useState } from 'react';

const aboutStats = [
    { prefix: 'More Than ', number: 24, suffix: '+', subtitle: 'wellness courses' },
    { prefix: '', number: 2, suffix: ' Lakh Plus', subtitle: 'associated with us' },
    { prefix: 'More Than ', number: 200, suffix: '+', subtitle: 'therapists' }
];

export default function AboutStats() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-white pb-[60px] md:pb-[100px] flex justify-center mt-[-40px] z-10">
            <div className="max-w-[1037px] w-full px-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 md:gap-0">
                {aboutStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-center w-full md:w-auto">
                        <div
                            className="flex flex-col items-center justify-center text-center px-2 w-full"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                                transition: `all 0.8s ease ${index * 0.2}s`
                            }}
                        >
                            <h3 className="text-[32px] md:text-[36px] font-semibold tracking-tight text-black leading-tight mb-2 whitespace-nowrap" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                {stat.prefix}
                                <AnimatedNumber target={stat.number} isVisible={isVisible} />
                                {stat.suffix}
                            </h3>
                            <p className="text-[16px] md:text-[18px] font-normal leading-relaxed text-black/80 max-w-[200px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                {stat.subtitle}
                            </p>
                        </div>

                        {/* Separator - only show after first two items */}
                        {index < 2 && (
                            <div
                                className="hidden md:block w-[1px] h-[100px] bg-black/10 mx-8"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transition: `opacity 1s ease ${(index * 0.2) + 0.1}s`
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

function AnimatedNumber({ target, isVisible }: { target: number, isVisible: boolean }) {
    // Re-implement a simple count-up here or import if cleanly exported
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        let startTime: number;
        const duration = 2000;

        function tick(now: number) {
            if (!startTime) startTime = now;
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [isVisible, target]);

    return <span>{value}</span>;
}
