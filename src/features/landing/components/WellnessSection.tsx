import { useEffect, useRef, useState } from 'react';

export default function WellnessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
      style={{ minHeight: '1100px' }}
    >
      {/* Orange Circle - Figma: two semi-circles h-1000 w-508/500, blur-50 */}
      <div className="absolute flex items-center justify-center pointer-events-none" style={{ left: '13.33%', top: '100px' }}>
        <div
          className={`transition-all duration-[1500ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{
            width: '508px',
            height: '1000px',
            borderRadius: '500px 0 0 500px',
            background: 'linear-gradient(to bottom, #ffa755, #ff7b00 50%)',
            filter: 'blur(50px)',
          }}
        />
      </div>
      <div className="absolute flex items-center justify-center pointer-events-none" style={{ left: '46.67%', top: '100px' }}>
        <div className="-scale-y-100 rotate-180">
          <div
            className={`transition-all duration-[1500ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{
              width: '500px',
              height: '1000px',
              borderRadius: '500px 0 0 500px',
              background: 'linear-gradient(to bottom, #ffa755, #ff7b00 50%)',
              filter: 'blur(50px)',
            }}
          />
        </div>
      </div>

      {/* Orange Stroke Ring - Figma: size-1200 */}
      <div
        className={`absolute pointer-events-none transition-all duration-[1500ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ left: '6.67%', top: '0px', width: '1200px', height: '1200px' }}
      >
        <img src="/images/orange-stroke.svg" alt="" className="block max-w-none w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Title */}
        <div
          className={`text-center pt-[120px] md:pt-[230px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '0.2s' }}
        >
          <h2 className="text-3xl md:text-[32px] font-semibold text-white tracking-[-0.32px] text-center px-4">
            Wellness Feels Fragmented
          </h2>
        </div>

        {/* Description */}
        <div
          className={`text-center mt-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '0.3s' }}
        >
          <p className="text-sm md:text-[14px] font-normal text-white/80 leading-[26px] md:leading-[30px] tracking-[-0.14px] max-w-xl mx-auto px-4">
            Mental health services are expensive, scarce and stigmatized. <br className="hidden md:block" />
            Many prefer culturally familiar modalities (astrology, spiritual healers) <br className="hidden md:block" />
            but those services are fragmented, unregulated and often lack measurable outcomes.
          </p>
        </div>

        {/* Model Image Container */}
        <div
          className={`flex justify-center mt-12 px-4 transition-all duration-[1200ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div
            className="relative overflow-hidden w-full max-w-[540px] aspect-[4/5] object-cover"
            style={{
              borderRadius: '0 0 0 120px',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="/images/model-image.png"
              alt="Wellness"
              className="absolute w-full h-full object-cover scale-110 object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
