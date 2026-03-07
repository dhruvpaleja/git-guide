import { useEffect, useRef, useState } from 'react';

const services = [
  { title: 'Therapist', description: 'A therapist guides your inner growth.', buttonText: 'Book Now', image: '/images/service-therapist-figma.png' },
  { title: 'Counsellor', description: 'Get clear mind through counselling.', buttonText: 'Book Now', image: '/images/service-counsellor-figma.png' },
  { title: 'Healer', description: 'Healing crafted by trusted healers.', buttonText: 'Book Now', image: '/images/service-healer-figma.png' },
  { title: 'Breathwork', description: 'Start your breathwork exercise quick.', buttonText: 'Start Now', image: '/images/service-breathwork-figma.png' },
];
const SERVICES_MARQUEE_DURATION_SECONDS = 30;
const HOVER_SCALE_CLASS = 'scale-[1.04]';

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollingServices = [...services, ...services];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative bg-white py-[60px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[82px]">
        {/* Title - Figma: text-32px */}
        <div className="text-center mb-2">
          <h2
            className={`text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-black tracking-[-0.32px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            What Soul Yatri Offers To You
          </h2>
        </div>
        <div className="text-center mb-10">
          <p
            className={`text-[16px] font-normal text-black/50 tracking-[-0.16px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '0.1s' }}
          >
            Choose the right need for your mental health.
          </p>
        </div>

        {/* Cards Marquee */}
        <div className="relative overflow-hidden pb-4 pt-4 px-2 sm:px-4">
          <div
            className="flex w-max gap-6 services-marquee-track"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {scrollingServices.map((service, i) => {
              const isHovered = hoveredCardIndex === i;
              return (
                <div
                  key={`${service.title}-${i}`}
                  className={`transition-all duration-700 flex-none ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  style={{ transitionDelay: `${0.15 + (i % services.length) * 0.08}s` }}
                  onMouseEnter={() => {
                    setIsPaused(true);
                    setHoveredCardIndex(i);
                  }}
                  onMouseLeave={() => {
                    setIsPaused(false);
                    setHoveredCardIndex(null);
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-[25px] group cursor-pointer bg-white w-[260px] sm:w-[280px] lg:w-[300px] min-h-[350px] md:min-h-[400px] lg:min-h-[450px] shadow-sm transition-all duration-300 flex flex-col ${isHovered ? `${HOVER_SCALE_CLASS} shadow-2xl z-20` : 'scale-100'
                      }`}
                  >
                    {/* Full image */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Gradient overlays with CSS instead of images for better scaling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    {/* Content Container (lifted up to avoid CTA overlap) */}
                    <div className="relative z-10 flex flex-col justify-end h-full p-5 lg:p-6 text-white pb-28 md:pb-32">
                      <h3 className="text-xl md:text-[24px] font-semibold text-center tracking-[-0.24px] mb-2 drop-shadow-md">
                        {service.title}
                      </h3>
                      <p className="text-sm md:text-[14px] font-normal text-center leading-relaxed tracking-[-0.14px] text-white/90 drop-shadow-sm">
                        {service.description}
                      </p>
                    </div>

                    {/* CTA Button pinned to bottom */}
                    <div className="absolute left-6 right-6 bottom-6">
                      <button className="w-full h-[50px] md:h-[60px] bg-white rounded-[22px] text-sm md:text-[16px] font-semibold text-black text-center tracking-[-0.16px] transition-all duration-300 hover:bg-zinc-100 hover:scale-[1.02] shadow-sm">
                        {service.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nav dots - Figma: h-8, w-30, rounded-4 */}
        <div className="flex justify-center gap-[5px] mt-8">
          <div className="w-[30px] h-[8px] rounded-[4px] bg-black" />
          <div className="w-[30px] h-[8px] rounded-[4px] bg-black/10" />
          <div className="w-[30px] h-[8px] rounded-[4px] bg-black/10" />
          <div className="w-[30px] h-[8px] rounded-[4px] bg-black/10" />
          <div className="w-[30px] h-[8px] rounded-[4px] bg-black/10" />
        </div>
      </div>
      <style>{`
        .services-marquee-track {
          animation: services-marquee-scroll ${SERVICES_MARQUEE_DURATION_SECONDS}s linear infinite;
        }

        @keyframes services-marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px));
          }
        }
      `}</style>
    </section>
  );
}
