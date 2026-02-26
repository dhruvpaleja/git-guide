import { useEffect, useRef, useState } from 'react';

const stats = [
  { title: 'More than  150+', subtitle: 'Courses available for your Health.', action: 'Explore Now' },
  { title: '2 Lakh Plus', subtitle: 'Practitioners available for your Health.', action: 'Consult Now' },
  { title: 'More than 100+', subtitle: 'Instructors available for your Health.', action: 'Connect Now' },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black py-[60px] overflow-hidden">
      {/* Blue ellipses - Figma: size-800 */}
      <div className="absolute flex items-center justify-center" style={{ width: '800px', height: '800px', left: '6.67%', top: '-100px' }}>
        <div className="-rotate-90">
          <img src="/images/blue-ellipse-2.svg" alt="" className="block max-w-none w-[800px] h-[800px]" />
        </div>
      </div>
      <div className="absolute flex items-center justify-center" style={{ width: '800px', height: '800px', right: '-100px', top: '-100px' }}>
        <div className="-rotate-90 -scale-y-100">
          <img src="/images/blue-ellipse.svg" alt="" className="block max-w-none w-[800px] h-[800px]" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-[82px]">
        {/* Title */}
        <div className="text-center mb-2">
          <h2
            className={`text-3xl md:text-[32px] font-semibold text-white tracking-[-0.32px] leading-tight md:leading-[100px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Soul Yatri Family
          </h2>
        </div>
        {/* Subtitle */}
        <div className="text-center mb-12">
          <p
            className={`text-sm md:text-[16px] font-normal text-white/50 tracking-[-0.16px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: '0.1s' }}
          >
            The family which takes care of you and your mental health.
          </p>
        </div>

        {/* Stats grid relative to screen width */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 mt-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {stats.map((stat, i) => (
            <div key={stat.action} className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:w-[280px] lg:w-[300px] mx-auto">
                <h3 className="text-xl lg:text-[24px] font-semibold text-white tracking-[-0.24px] mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm lg:text-[16px] font-normal text-white opacity-50 leading-[26px] lg:leading-[30px] tracking-[-0.16px] mb-4">
                  {stat.subtitle}
                </p>
                <a href="#" className="text-sm lg:text-[16px] font-normal text-white/50 text-center tracking-[-0.16px] hover:text-white/70 transition-colors">
                  {stat.action}
                </a>
              </div>

              {/* Divider on Desktop Only */}
              {i < stats.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-8 lg:w-[125px]">
                  <div className="-rotate-90">
                    <img src="/images/orange-line.svg" alt="" className="block w-20 lg:w-[125px] h-0" style={{ borderTop: '3px solid transparent' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
