import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  buttonText: string;
  image: string;
}

const services: Service[] = [
  {
    title: 'Breathwork',
    description: 'Learn powerful breathing techniques to reduce stress and increase energy.',
    buttonText: 'Start Now',
    image: '/images/service-breathwork.jpg',
  },
  {
    title: 'Therapist',
    description: 'Connect with licensed therapists for professional mental health support.',
    buttonText: 'Book Now',
    image: '/images/service-therapist.jpg',
  },
  {
    title: 'Counsellor',
    description: "Get guidance from experienced counsellors for life's challenges.",
    buttonText: 'Consult Now',
    image: '/images/service-counsellor.jpg',
  },
  {
    title: 'Healer',
    description: 'Experience holistic healing practices for mind-body wellness.',
    buttonText: 'Heal Now',
    image: '/images/service-healer.jpg',
  },
];

function ServiceCard({ service, index, isVisible }: { service: Service; index: number; isVisible: boolean }) {
  return (
    <div
      className={`flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[280px] md:w-[320px] snap-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden group cursor-pointer">
        {/* Background Image */}
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 card-gradient-overlay" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-sm text-white/80 mb-4 line-clamp-2">{service.description}</p>
          <button className="self-start px-6 py-2.5 bg-white text-black text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {service.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 bg-zinc-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mb-8 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          What Soul Yatri Offers To You
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
