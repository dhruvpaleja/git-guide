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
      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Title - Figma: text-32px, centered */}
        <div
          className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ paddingTop: '230px', transitionDelay: '0.2s' }}
        >
          <h2 className="text-[32px] font-semibold text-white tracking-[-0.32px] text-center">
            Wellness Feels Fragmented
          </h2>
        </div>

        {/* Description - Figma: text-14px, w-541, centered, leading-30 */}
        <div
          className={`text-center mt-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '0.3s' }}
        >
          <p className="text-[14px] font-normal text-white leading-[30px] tracking-[-0.14px] mx-auto" style={{ width: '541px' }}>
            Mental health services are expensive, scarce and stigmatized.<br />
            Many prefer culturally familiar modalities (astrology, spiritual healers)<br />
            but those services are fragmented, unregulated and often lack measurable outcomes.
          </p>
        </div>

        {/* Model Image - Figma: w-540, h-685, rounded-bl-172 */}
        <div
          className={`flex justify-center mt-12 transition-all duration-[1200ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: '540px',
              height: '685px',
              borderRadius: '0 0 0 172px',
            }}
          >
            <img
              src="/images/model-image.png"
              alt="Wellness"
              className="absolute max-w-none"
              style={{ width: '138.89%', height: '109.2%', left: '-12.9%', top: '-9.05%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
