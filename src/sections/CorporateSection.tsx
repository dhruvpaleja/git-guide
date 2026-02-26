import { useEffect, useRef, useState } from 'react';

export default function CorporateSection() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-black"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] glow-teal blur-[120px] rounded-full transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Corporate Wellness
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed mb-6 sm:mb-8 max-w-lg">
              Bring wellness to your workplace. Our corporate programs help teams manage stress, improve focus, and build resilience. Create a healthier, happier, and more productive work environment.
            </p>
            <button className="px-8 py-3.5 border border-white text-white font-medium text-sm rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:scale-105">
              Request A Demo
            </button>
          </div>

          {/* Image */}
          <div
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="relative">
              <img
                src="/images/corporate-wellness.jpg"
                alt="Corporate wellness team"
                className="w-full rounded-3xl shadow-2xl"
              />
              {/* Subtle glow behind image */}
              <div className="absolute -inset-4 bg-teal-500/10 blur-3xl rounded-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
