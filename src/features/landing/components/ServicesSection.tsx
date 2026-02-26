import { useEffect, useRef, useState } from 'react';

const services = [
  { title: 'Therapist', description: 'A therapist guides your inner growth.', buttonText: 'Book Now', image: '/images/service-therapist-figma.png', featured: true },
  { title: 'Counsellor', description: 'Get clear mind through counselling.', buttonText: 'Book Now', image: '/images/service-counsellor-figma.png', featured: false },
  { title: 'Healer', description: 'Healing crafted by trusted healers.', buttonText: 'Book Now', image: '/images/service-healer-figma.png', featured: false },
  { title: 'Breathwork', description: 'Start your breathwork exercise quick.', buttonText: 'Start Now', image: '/images/service-breathwork-figma.png', featured: false },
];

export default function ServicesSection() {
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
    <section id="services" ref={sectionRef} className="relative bg-white py-[60px]">
      <div className="max-w-[1440px] mx-auto px-[82px]">
        {/* Title - Figma: text-32px */}
        <div className="text-center mb-2">
          <h2
            className={`text-[32px] font-semibold text-black tracking-[-0.32px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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

        {/* Cards - Figma: Therapist 350x450, others 310x410, rounded-25 */}
        <div className="flex gap-[18px] overflow-x-auto pb-4 hide-scrollbar items-end justify-start">
          {services.map((service, i) => {
            const w = service.featured ? 350 : 310;
            const h = service.featured ? 450 : 410;
            return (
              <div
                key={service.title}
                className={`flex-shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                style={{ transitionDelay: `${0.15 + i * 0.08}s` }}
              >
                <div
                  className="relative overflow-hidden rounded-[25px] group cursor-pointer bg-white"
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    boxShadow: service.featured ? '0px 30px 60px 0px rgba(0,0,0,0.25)' : 'none',
                  }}
                >
                  {/* Full image */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient overlays (3 layers like Figma) */}
                  <div
                    className="absolute left-0 right-0 rounded-b-[25px] pointer-events-none"
                    style={{
                      bottom: 0,
                      height: service.featured ? '240px' : '215px',
                    }}
                  >
                    <img src="/images/gradient-overlay.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-b-[25px]" />
                  </div>
                  <div
                    className="absolute left-0 right-0 rounded-b-[25px] pointer-events-none"
                    style={{
                      bottom: 0,
                      height: service.featured ? '240px' : '215px',
                    }}
                  >
                    <img src="/images/gradient-overlay.png" alt="" className="absolute inset-0 w-full h-full object-cover rounded-b-[25px]" />
                  </div>

                  {/* Title/Desc - Figma: text-24px title, text-14px desc */}
                  <div className="absolute left-[15px] right-[15px]" style={{ bottom: service.featured ? '80px' : '75px' }}>
                    <h3 className="text-[24px] font-semibold text-white text-center tracking-[-0.24px] mb-1">
                      {service.title}
                    </h3>
                    <p className="text-[14px] font-normal text-white text-center leading-[30px] tracking-[-0.14px]">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA - Figma: h-60, rounded-22, bg-white, text-16px */}
                  <div
                    className="absolute left-[15px] bottom-[15px]"
                    style={{ width: service.featured ? '320px' : '280px' }}
                  >
                    <button className="w-full h-[60px] bg-white rounded-[22px] text-[16px] font-semibold text-black text-center tracking-[-0.16px] leading-[30px] transition-all duration-300 hover:bg-zinc-100">
                      {service.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
    </section>
  );
}
