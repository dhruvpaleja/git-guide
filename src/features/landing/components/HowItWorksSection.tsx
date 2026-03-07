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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[82px]">
        {/* Title */}
        <div className="text-center mb-2">
          <h2
            className={`text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-black tracking-[-0.32px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            How Soul Yatri Works For You
          </h2>
        </div>
        <div className="text-center mb-12">
          <p
            className={`text-sm md:text-[16px] font-normal text-black/50 tracking-[-0.16px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '0.1s' }}
          >
            The services what we provide to you for your Mental health and wellbeing.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`transition-all duration-700 w-full max-w-[95vw] sm:max-w-[350px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              {/* Card */}
              <div
                className="relative overflow-hidden rounded-[25px] group cursor-pointer border border-black/20 pb-4 min-h-[380px] sm:min-h-[420px] md:min-h-[450px] w-full"
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[25px]">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Gradient overlays */}
                <div className="absolute left-0 right-0 bottom-0 h-[250px] rounded-b-[25px] pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  {/* Using CSS gradient instead of image for better responsiveness */}
                </div>

                {/* Text Context - Positioned relative to bottom to avoid static top overlaps */}
                <div className="absolute bottom-6 left-6 right-6 text-center text-white">
                  <h3 className="text-xl sm:text-[24px] font-semibold tracking-[-0.24px] leading-tight sm:leading-[30px] mb-2 drop-shadow-md">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-[14px] font-medium leading-snug sm:leading-[24px] tracking-[-0.14px] drop-shadow-md text-white/90">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* CTA button below card */}
              <div className="flex justify-center mt-6">
                <button className="h-[60px] w-full sm:max-w-[200px] rounded-[25px] border border-black/20 text-[16px] font-semibold text-black text-center tracking-[-0.16px] leading-[30px] bg-white transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 shadow-sm">
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
