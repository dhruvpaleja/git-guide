import { useEffect, useRef, useState } from 'react';

interface Feature {
  title: string;
  description: string;
  buttonText: string;
  image: string;
}

const features: Feature[] = [
  {
    title: 'Get A Guided Plan',
    description: 'Get a personalized wellness plan tailored to your unique needs and goals.',
    buttonText: 'Get Now',
    image: '/asset_7.jpg',
  },
  {
    title: '1-1 Sessions',
    description: 'Connect with experts one-on-one for personalized guidance and support.',
    buttonText: 'Book Now',
    image: '/asset_8.jpg',
  },
  {
    title: 'Micro Tools',
    description: 'Access quick exercises and tools to manage stress and anxiety anytime.',
    buttonText: 'Start Now',
    image: '/asset_9.jpg',
  },
];

function FeatureCard({ feature, index, isVisible }: { feature: Feature; index: number; isVisible: boolean }) {
  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        {/* Image */}
        <div className="h-48 overflow-hidden">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
          <p className="text-sm text-zinc-600 mb-5 leading-relaxed">{feature.description}</p>
          <button className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-zinc-800 hover:scale-105">
            {feature.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mb-10 sm:mb-14 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          How Soul Yatri Works For You
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
