import { useEffect, useRef, useState } from 'react';

const founders = [
    {
        name: 'Dhruv Paleja',
        role: 'Founder | CEO',
        image: '/images/about/dhruv-paleja.jpg',
        fallback: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
        link: '#'
    },
    {
        name: 'Kanishk Thakur',
        role: 'Co-Founder | CFO',
        image: '/images/about/kanishk-thakur.jpg',
        fallback: 'https://images.unsplash.com/photo-1600804889194-e6fbf08ddb39?q=80&w=600&auto=format&fit=crop',
        link: '#'
    },
    {
        name: 'Jonmajoy Bardhan',
        role: 'Head Of Design',
        image: '/images/about/jonmajoy-bardhan.jpg',
        fallback: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
        link: '#'
    }
];

export default function FoundersSection() {
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

    return (
        <section ref={sectionRef} className="w-full bg-white pt-[20px] pb-[80px]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 text-center">

                <h2
                    className="text-[34px] sm:text-[40px] md:text-[48px] font-bold text-black mb-10 sm:mb-16 leading-tight"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <span className="text-[#18A2B8]">Soul Yatri’s</span> Founders & Advisors
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xlg:gap-12">
                    {founders.map((founder, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-white rounded-[32px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0px_20px_40px_rgba(24,162,184,0.1)] transition-all duration-500"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${(index * 0.2) + 0.2}s`
                            }}
                        >
                            {/* Photo */}
                            <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-6 bg-gray-100">
                                <img
                                    src={founder.image}
                                    alt={founder.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = founder.fallback;
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <h3 className="text-[22px] sm:text-2xl font-bold text-black tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                {founder.name}
                            </h3>
                            <p className="text-[#FF7B00] font-semibold text-xs sm:text-sm tracking-wider uppercase mt-1 mb-5" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                {founder.role}
                            </p>

                            {/* Socials & Action */}
                            <div className="w-full flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                                <div className="flex gap-2.5 sm:gap-4">
                                    {/* Instagram icon */}
                                    <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-[#18A2B8] hover:bg-[#18A2B8]/5 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>
                                    {/* LinkedIn icon */}
                                    <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-[#18A2B8] hover:bg-[#18A2B8]/5 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>
                                </div>
                                <a href={founder.link} className="inline-flex min-h-[40px] items-center gap-2 text-[#4A4A4A] font-semibold text-sm hover:text-black transition-colors">
                                    Read Blog
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
