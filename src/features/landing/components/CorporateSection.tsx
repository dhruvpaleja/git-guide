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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="business" ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* Title */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-14 pb-6">
        <div className="text-center">
          <h2
            className={`text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-black tracking-tight mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            Corporate Wellness
          </h2>
          <p
            className={`text-[13px] text-black/40 leading-[2] max-w-[650px] mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '0.1s' }}
          >
            Soul Yatri offers holistic corporate wellness programs that nurture employee well-being
            through mental health therapy, mindfulness workshops, and emotional resilience training.
          </p>
        </div>
      </div>

      {/* Corporate Image */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div
          className={`relative rounded-[30px] overflow-hidden transition-all ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
            }`}
          style={{ transitionDuration: '1200ms', transitionDelay: '0.2s', height: 'clamp(280px, 50vw, 500px)' }}
        >
          <img
            src="/images/corporate-figma.png"
            alt="Corporate wellness"
            className="w-full h-full object-cover"
          />

          {/* Overlay cards */}
          <div className="absolute top-[5%] md:top-6 left-[5%] md:left-6 right-[5%] md:right-6 flex flex-col md:flex-row gap-3 overflow-y-auto max-h-[90%] md:overflow-visible">
            {/* Topic */}
            <div
              className="rounded-[20px] md:rounded-[30px] border border-white/60 backdrop-blur-md flex flex-col items-center justify-center px-4 md:px-5 py-3 md:py-4 shrink-0 w-full md:w-[200px]"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <h3 className="text-sm md:text-[16px] font-semibold text-black mb-1">Topic</h3>
              <p className="text-[12px] md:text-[12px] text-black/90 text-center leading-snug">
                Leadership Mindfulness Training
              </p>
            </div>

            {/* Problem */}
            <div
              className="rounded-[20px] md:rounded-[30px] border border-white/60 backdrop-blur-md flex flex-col items-center justify-center px-4 md:px-5 py-3 md:py-4 shrink-0 w-full md:w-[280px]"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <h3 className="text-sm md:text-[16px] font-semibold text-black mb-1">Problem</h3>
              <p className="text-[12px] md:text-[12px] text-black/90 text-center leading-[1.6]">
                Workplace pressure drives leader burnout and reactive decisions, impacting teams.
              </p>
            </div>

            {/* Solution */}
            <div
              className="rounded-[20px] md:rounded-[30px] border border-white/60 backdrop-blur-md flex flex-col items-center justify-center px-4 md:px-5 py-3 md:py-4 flex-1 md:min-w-[300px]"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              <h3 className="text-sm md:text-[16px] font-semibold text-black mb-1">Solution</h3>
              <p className="text-[12px] md:text-[12px] text-black/90 text-center leading-[1.6]">
                Soul Yatri's Leadership Mindfulness Training helps leaders build clarity and emotional intelligence through a 4–8 week program.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-6 pb-10">
          <button className="px-8 py-2.5 rounded-full text-[12px] font-semibold text-black border border-black/15 transition-all duration-300 hover:bg-black hover:text-white shadow-sm">
            Request A Demo
          </button>
        </div>
      </div>
    </section>
  );
}
