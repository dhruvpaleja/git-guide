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

      {/* Hero image container - updated for responsiveness and clarity */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-[1500ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        style={{ transitionDelay: '0.2s' }}
      >
        <div className="relative w-full max-w-[800px] aspect-square md:w-[700px] md:h-[700px] mx-auto mt-20 md:mt-[140px]">
          {/* Suttle background glow behind image instead of blurring the image itself */}
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl" />
          <div
            className="relative w-full h-full rounded-b-full overflow-hidden flex justify-center items-end"
            style={{
              borderRadius: '0 0 50% 50%',
            }}
          >
            <img
              src="/images/hero-image.png"
              alt="Soul Yatri Hero"
              className="relative w-[120%] max-w-none object-cover sm:w-[146%]"
              style={{ objectPosition: 'center bottom' }}
            />
          </div>
        </div>
      </div>

      {/* Content - max 1440px centered */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full flex flex-col justify-end pb-32 px-6 md:px-12 lg:block lg:pb-0 lg:px-0">
        {/* Title "Your Journey Begins" */}
        <div
          className={`lg:absolute transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{
            top: '390px',
            left: '6.67%',
            transitionDelay: '0.4s',
          }}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-[65px] font-semibold text-white lg:leading-[100px] tracking-[-0.65px] text-center lg:text-left mb-6 lg:mb-0"
          >
            Your Journey<br className="hidden lg:block" />
            <span className="lg:hidden"> </span>
            Begins
          </h1>
        </div>

        {/* Content Right Side (Description + CTA) */}
        <div
          className={`lg:absolute flex flex-col items-center lg:items-end transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{
            top: '340px',
            right: '6.67%',
            transitionDelay: '0.5s',
          }}
        >
          <p
            className="text-sm md:text-base font-normal text-white/50 text-center lg:text-right leading-[30px] tracking-[-0.16px] max-w-sm mx-auto lg:mx-0 lg:w-[320px] mb-8 lg:mb-8"
          >
            A Tech-enabled Mental wellbeing platform <br className="hidden lg:block" />
            blending modern Psychology, Therapy & <br className="hidden lg:block" />
            Traditional Indian Astrology.
          </p>

          <button
            className="h-[60px] w-[200px] rounded-[25px] text-[14px] font-semibold text-white tracking-[-0.14px] text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/40 border border-white/20 bg-black/40 backdrop-blur-sm"
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
