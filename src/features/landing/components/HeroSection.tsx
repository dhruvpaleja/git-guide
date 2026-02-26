import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black"
      style={{ height: '900px' }}
    >
      {/* Grey Ellipse - Figma: size-500, top:-250, centered */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          top: '-250px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="absolute inset-[-100%]">
          <img src="/images/grey-ellipse.svg" alt="" className="block max-w-none w-full h-full" />
        </div>
      </div>

      {/* Hero image glow - Figma: size-700, top:300 from page (minus nav ~160), blur-50 */}
      <div
        className={`absolute flex items-center justify-center transition-all duration-[1500ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        style={{
          width: '700px',
          height: '700px',
          top: '140px',
          left: '50%',
          transform: 'translateX(-50%)',
          transitionDelay: '0.2s',
        }}
      >
        <div className="-scale-y-100 rotate-180">
          <div
            className="relative"
            style={{
              width: '700px',
              height: '700px',
              filter: 'blur(50px)',
              borderRadius: '0 0 220px 220px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/hero-image.png"
              alt=""
              className="absolute w-[146%] h-[146%] max-w-none"
              style={{ top: '-37%', left: '-31%' }}
            />
          </div>
        </div>
      </div>

      {/* Content - max 1440px centered */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full">
        {/* Title "Your Journey Begins" - Figma: text-65px, top:550-160=390 from section, left:calc(6.67%-14px) */}
        <div
          className={`absolute transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{
            top: '390px',
            left: '6.67%',
            transitionDelay: '0.4s',
          }}
        >
          <h1
            className="text-[65px] font-semibold text-white leading-[100px] tracking-[-0.65px]"
          >
            Your Journey<br />
            {`Begins `}
          </h1>
        </div>

        {/* Description - Figma: text-16px, w-300, text-right, top:500-160=340, right:calc(100%-73.33%-302px) */}
        <div
          className={`absolute transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{
            top: '340px',
            right: '6.67%',
            transitionDelay: '0.5s',
          }}
        >
          <p
            className="text-[16px] font-normal text-white/50 text-right leading-[30px] tracking-[-0.16px]"
            style={{ width: '300px' }}
          >
            A Tech-enabled Menta wellbeing platform<br />
            blending modern Psychology, Therapy &<br />
            Traditional Indian Astrology.
          </p>
        </div>

        {/* CTA - Figma: h-60, w-200, rounded-25, text-14px, top:590-160=430 */}
        <div
          className={`absolute transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{
            top: '430px',
            right: '6.67%',
            transitionDelay: '0.7s',
          }}
        >
          <button
            className="h-[60px] w-[200px] rounded-[25px] text-[14px] font-semibold text-white tracking-[-0.14px] text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 border border-white/20"
          >
            Start Your Healing
          </button>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
    </section>
  );
}
