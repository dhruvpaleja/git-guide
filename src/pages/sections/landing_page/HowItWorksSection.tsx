import { useEffect, useRef, useState } from 'react';

const features = [
  { title: 'Get A Guided Plan', description: 'Use Self-help Plan & Tools Guided By Therapists & Healers.', buttonText: 'Get Now', image: '/images/feature-plan.png' },
  { title: '1:1 Sessions', description: 'Live Video/Voice Sessions With Psychologists, Astrologers, & Healers.', buttonText: 'Book Now', image: '/images/feature-sessions.png' },
  { title: 'Micro Tools', description: 'CBT Worksheets, Grounding Exercises & Sleep Stories.', buttonText: 'Start Now', image: '/images/feature-tools.png' },
];

export default function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative bg-white py-[60px]">
      <div className="max-w-[1440px] mx-auto px-[82px]">
        {/* Title - Figma: text-32px */}
        <div className="text-center mb-2">
          <h2
            className={`text-[32px] font-semibold text-black tracking-[-0.32px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            How Soul Yatri Works For You
          </h2>
        </div>
        <div className="text-center mb-10">
          <p
            className={`text-[16px] font-normal text-black/50 tracking-[-0.16px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '0.1s' }}
          >
            The services what we provide to you for your Mental health and wellbeing.
          </p>
        </div>

        {/* Feature Cards - Figma: 350x450 each, rounded-25, border rgba(0,0,0,0.2) */}
        <div className="flex justify-center gap-[18px]">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              {/* Card */}
              <div
                className="relative overflow-hidden rounded-[25px] group cursor-pointer border border-black/20"
                style={{ width: '350px', height: '450px' }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[25px]">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="absolute max-w-none transition-transform duration-700 group-hover:scale-105"
                    style={{ width: '100%', height: '117%', top: '-17%', left: '0' }}
                  />
                </div>

                {/* Gradient overlays */}
                <div className="absolute left-0 right-0 bottom-0 h-[250px] rounded-b-[25px] pointer-events-none">
                  <img src="/images/gradient-overlay.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-b-[25px]" />
                </div>
                <div className="absolute left-0 right-0 bottom-0 h-[220px] rounded-b-[25px] pointer-events-none">
                  <img src="/images/gradient-overlay.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-b-[25px]" />
                </div>

                {/* Text - Figma: text-24px title, text-14px desc, centered */}
                <div className="absolute left-[42px] right-[42px] text-center text-white" style={{ top: '320px' }}>
                  <h3 className="text-[24px] font-semibold tracking-[-0.24px] leading-[30px] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] font-medium leading-[30px] tracking-[-0.14px]" style={{ width: '265px', margin: '0 auto' }}>
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* CTA button below card - Figma: h-60, w-200, rounded-25, border rgba(0,0,0,0.2) */}
              <div className="flex justify-center mt-4">
                <button className="h-[60px] w-[200px] rounded-[25px] border border-black/20 text-[16px] font-semibold text-black text-center tracking-[-0.16px] leading-[30px] bg-white transition-all duration-300 hover:bg-black hover:text-white">
                  {feature.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
