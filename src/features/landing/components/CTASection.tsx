import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 pb-24 overflow-hidden"
    >
      {/* Subtle glow behind button */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-teal-500/10 blur-[60px] rounded-full transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 flex justify-center px-4">
        <Link
          to="/login"
          className={`group relative px-10 py-3.5 bg-white text-black font-medium text-sm rounded-full transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-white/20 active:scale-95 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <span className="relative z-10">Explore Now</span>
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </div>
        </Link>
      </div>
    </section>
  );
}
