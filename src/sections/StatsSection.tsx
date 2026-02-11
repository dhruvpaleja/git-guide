import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 240, prefix: 'More Than ', label: 'Doctors Available for Your Health' },
  { value: 2, suffix: ' Lakh Plus', label: 'Partnered With Practitioners Worldwide' },
  { value: 22, prefix: 'More Than ', label: 'Videos Available for Your Growth' },
];

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

function StatCard({ stat, index, isVisible }: { stat: StatItem; index: number; isVisible: boolean }) {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div
      className={`text-center py-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${0.3 + index * 0.15}s` }}
    >
      <div className="text-2xl sm:text-3xl font-semibold text-white mb-3">
        {stat.prefix}
        {count}
        {stat.suffix}
      </div>
      <p className="text-xs text-zinc-500 uppercase tracking-widest">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsSection() {
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-8 overflow-hidden bg-black"
    >
      {/* Background Glow Effects - More prominent */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Teal Glow */}
        <div
          className={`absolute -left-1/3 top-0 w-[500px] h-[500px] glow-teal blur-[120px] rounded-full transition-all duration-1000 ${
            isVisible ? 'opacity-100 animate-pulse-glow' : 'opacity-0'
          }`}
        />
        {/* Right Cyan Glow */}
        <div
          className={`absolute -right-1/3 bottom-0 w-[400px] h-[400px] glow-cyan blur-[100px] rounded-full transition-all duration-1000 ${
            isVisible ? 'opacity-100 animate-pulse-glow' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6">
        {stats.map((stat, index) => (
          <div key={stat.label}>
            <StatCard stat={stat} index={index} isVisible={isVisible} />
            {index < stats.length - 1 && (
              <div
                className={`gradient-divider transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}
                style={{ transitionDelay: `${0.4 + index * 0.15}s` }}
              />
            )}
          </div>
        ))}
        
        {/* Explore Now Button */}
        <div
          className={`flex justify-center mt-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          <button className="px-8 py-3.5 bg-white text-black font-medium text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 active:scale-95">
            Explore Now
          </button>
        </div>
      </div>
    </section>
  );
}
