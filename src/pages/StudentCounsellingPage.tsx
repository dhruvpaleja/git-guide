import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Heart, Clock } from 'lucide-react';

type OfferCard = {
  id: string;
  title: string;
  image: string;
};

const offerCards: OfferCard[] = [
  {
    id: '1',
    title: 'Subsidized Counselling Access',
    image: '/images/corporate-figma.png',
  },
  {
    id: '2',
    title: 'On Campus or Online Screenings',
    image: '/images/service-counsellor-figma.png',
  },
  {
    id: '3',
    title: 'Emotional Screenings & Assessment',
    image: '/images/feature-sessions.png',
  },
  {
    id: '4',
    title: 'Certified Student Counsellors',
    image: '/images/blogs/blogs-card-01.jpg',
  },
];

const analyticsData = [
  {
    icon: Users,
    value: '1.2K+',
    label: 'Universities',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Heart,
    value: '500K+',
    label: 'Students Supported',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Satisfaction Rate',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Support Available',
    color: 'from-purple-500 to-purple-600',
  },
];

export default function StudentCounsellingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: 320,
          behavior: 'smooth',
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    setAutoScroll(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
    setTimeout(() => setAutoScroll(true), 3000);
  };

  return (
    <div className="min-h-screen bg-black w-full">
      {/* Main Section */}
      <section className="relative w-full pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-center">
              Soul Yatri Offers For
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
              Student Wellness
            </h2>
          </div>

          {/* Scrollable Cards Container */}
          <div className="relative mt-12 md:mt-16">
            {/* Left Arrow Button */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200 -ml-6 md:-ml-8 hover:shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200 -mr-6 md:-mr-8 hover:shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Cards - Auto Scrolling */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 px-2 scrollbar-hide"
              style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
            >
              {offerCards.map((card) => (
                <div
                  key={card.id}
                  className="group flex-shrink-0 w-72 md:w-96 h-80 md:h-96 relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />

                  {/* Dark Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-200" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 md:mb-6 leading-tight">
                      {card.title}
                    </h3>

                    {/* Learn More Button */}
                    <button className="w-full px-6 py-3.5 md:py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all duration-200 transform group-hover:-translate-y-1 text-base md:text-lg">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="w-full bg-gradient-to-b from-black via-black to-black/95 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Students & Universities
            </h2>
            <p className="text-lg md:text-xl text-white/70">
              Creating measurable impact in student mental health
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {analyticsData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-white/30 transition-all duration-200 hover:shadow-lg hover:shadow-white/5"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${stat.color} rounded-2xl transition-opacity duration-200`} />

                  {/* Icon */}
                  <div className={`mb-4 w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-200 group-hover:scale-105">
                      {stat.value}
                    </div>
                    <div className="text-base md:text-lg text-white/70 font-medium transition-colors duration-200 group-hover:text-white">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8">
            Ready to Transform Your Campus?
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-10 md:mb-12">
            Join thousands of universities creating healthier, more supportive student communities
          </p>
          <button className="px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg text-base md:text-lg">
            Request A Demo Today
          </button>
        </div>
      </section>
    </div>
  );
}
