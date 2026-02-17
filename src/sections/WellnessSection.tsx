import { useEffect, useRef, useState } from 'react';

export default function WellnessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInViewport || !sectionRef.current) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      // Get section boundaries
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      // Get current scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate progress (0 to 1)
      // Starts when section top is 80% down the viewport
      // Ends when section bottom is 20% up the viewport
      const startTrigger = sectionTop - windowHeight * 0.2;
      const endTrigger = sectionBottom - windowHeight * 0.8;
      const triggerRange = endTrigger - startTrigger;

      let progress = 0;
      if (scrollY >= startTrigger && scrollY <= endTrigger) {
        progress = (scrollY - startTrigger) / triggerRange;
      } else if (scrollY > endTrigger) {
        progress = 1;
      }

      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const wrappedHandleScroll = () => {
      handleScroll();
      animationFrameRef.current = requestAnimationFrame(wrappedHandleScroll);
    };

    animationFrameRef.current = requestAnimationFrame(wrappedHandleScroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInViewport]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-black"
    >
      {/* Orange Gradient Circle Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={circleRef}
          className={`w-[95%] sm:w-[90%] max-w-[600px] sm:max-w-[800px] aspect-square rounded-full gradient-orange transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: 'radial-gradient(circle at 40% 40%, #FCD34D 0%, #F59E0B 30%, #EA580C 60%, #9A3412 100%)',
            transform: `scale(${1 + scrollProgress * 4.5})`,
            opacity: Math.max(0, 1 - scrollProgress * 0.5),
            willChange: 'transform, opacity',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{ transitionDelay: '0.2s' }}
        >
          Wellness Feels Fragmented
        </h2>

        {/* Description */}
        <p
          className={`text-sm sm:text-base md:text-lg text-black/80 max-w-xl mx-auto mb-8 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{ transitionDelay: '0.4s' }}
        >
          Mental health care is scattered across apps, appointments, and advice that doesn't stick. We're bringing it all together.
        </p>

        {/* Silhouette Image */}
        <div
          className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <img
            src="/images/wellness-silhouette.png"
            alt="Woman silhouette"
            className="w-full max-w-[500px] mx-auto h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
