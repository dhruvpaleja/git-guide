import { useEffect, useRef, useState } from 'react';

export default function WellnessSection() {
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
      className="relative py-24 overflow-hidden bg-black"
    >
      {/* Orange Gradient Circle Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[90%] max-w-[800px] aspect-square rounded-full gradient-orange transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{
            background: 'radial-gradient(circle at 40% 40%, #FCD34D 0%, #F59E0B 30%, #EA580C 60%, #9A3412 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          Wellness Feels Fragmented
        </h2>

        {/* Description */}
        <p
          className={`text-base sm:text-lg text-black/80 max-w-xl mx-auto mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          Mental health care is scattered across apps, appointments, and advice that doesn't stick. We're bringing it all together.
        </p>

        {/* Silhouette Image */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <img
            src="/asset_2.png"
            alt="Woman silhouette"
            className="w-full max-w-[500px] mx-auto h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
