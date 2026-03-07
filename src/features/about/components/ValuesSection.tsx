import { useEffect, useRef, useState } from 'react';

const values = [
    { title: "Empathy", icon: "heart", isOrange: true },
    { title: "Confidentiality", icon: "shield", isOrange: false },
    { title: "Evidence First", icon: "clipboard", isOrange: false },
    { title: "Cultural Humility", icon: "globe", isOrange: false },
    { title: "Holistic Approach", icon: "layers", isOrange: false },
    { title: "Continuous Learning", icon: "book", isOrange: false }
];

export default function ValuesSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Simple placeholder icons matching size
    const renderIcon = (type: string) => {
        switch (type) {
            case 'heart': return <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>;
            case 'shield': return <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
            case 'clipboard': return <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
            case 'globe': return <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
            case 'layers': return <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>;
            case 'book': return <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
            default: return null;
        }
    }

    return (
        <section ref={sectionRef} className="w-full bg-white py-[40px] md:py-[60px] lg:py-[100px]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

                <h2
                    className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold text-center mb-16"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <span className="text-[#18A2B8]">Soul Yatri’s</span> <span className="text-black">Values</span>
                </h2>

                <div className="flex flex-wrap justify-center gap-6 max-w-[900px] mx-auto">
                    {values.map((val, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center justify-center w-[140px] sm:w-[170px] md:w-[200px] h-[140px] sm:h-[170px] md:h-[200px] rounded-[24px] sm:rounded-[32px] overflow-hidden relative cursor-default"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${(index * 0.1)}s`,
                                background: val.isOrange ? 'linear-gradient(180deg, #FF9737 0%, #FF7B00 100%)' : '#111111'
                            }}
                        >
                            {/* Internal absolute hover gradient for black boxes */}
                            {!val.isOrange && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#18A2B8] to-[#127F91] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                            )}

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <div className="mb-4 text-white">
                                    {renderIcon(val.icon)}
                                </div>
                                <h3 className="text-white font-extrabold text-[22px] text-center px-4 leading-[32px] tracking-[-0.22px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                    {val.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
