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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-black"
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Teal Glow */}
        <div
          className={`absolute -left-1/4 top-1/4 w-[600px] h-[600px] glow-teal blur-[120px] rounded-full transition-all duration-1000 ${
            isVisible ? 'opacity-100 animate-pulse-glow' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.5s' }}
        />
        {/* Right Cyan Glow */}
        <div
          className={`absolute -right-1/4 top-1/3 w-[500px] h-[500px] glow-cyan blur-[100px] rounded-full transition-all duration-1000 ${
            isVisible ? 'opacity-100 animate-pulse-glow' : 'opacity-0'
          }`}
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column - Headline */}
          <div className="lg:col-span-3 text-center lg:text-left order-2 lg:order-1">
            <h1
              className={`text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.05] tracking-tight transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              Your
              <br />
              Journey
              <br />
              Begins
            </h1>
          </div>

          {/* Center Column - Image */}
          <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
            <div
              className={`relative transition-all duration-800 ${
                isVisible
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '0.5s' }}
            >
              {/* Image Container with subtle glow */}
              <div className="relative">
                <img
                  src="/hero-monk.png"
                  alt="Meditation practitioner with headphones"
                  className="w-full max-w-[420px] h-auto object-contain mx-auto"
                />
                {/* Subtle bottom glow for image */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-t from-teal-500/20 to-transparent blur-2xl rounded-full" />
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`mt-10 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.7s' }}
            >
              <button className="group relative px-8 py-3.5 bg-white text-black font-medium text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 active:scale-95">
                <span className="relative z-10">Start Your Journey</span>
              </button>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="lg:col-span-3 text-center lg:text-left order-3">
            <p
              className={`text-sm text-zinc-400 leading-relaxed max-w-[240px] mx-auto lg:mx-0 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.6s' }}
            >
              A safe space to nurture your mind, body, and soul. Discover
              transformative practices that empower your evolution.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
