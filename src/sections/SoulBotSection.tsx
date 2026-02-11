import { useEffect, useRef, useState } from 'react';
import { Mic, Send, MoreVertical } from 'lucide-react';

export default function SoulBotSection() {
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
      className="relative py-16 sm:py-20 bg-zinc-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Your Personal AI SoulBot
          </h2>
          <p
            className={`text-base text-zinc-600 max-w-lg mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.1s' }}
          >
            Talk To Your AI SoulBot. Share Your Feelings & Emotions. It Will Listen, Support Your Mood.
          </p>
        </div>

        {/* Chat Interface Mockup */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.3s' }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-auto">
            {/* Chat Header */}
            <div className="bg-black px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">SoulBot</p>
                  <p className="text-zinc-400 text-xs">Online</p>
                </div>
              </div>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="bg-zinc-100 px-4 py-6 min-h-[300px]">
              {/* Welcome Message */}
              <div className="text-center mb-6">
                <p className="text-zinc-500 text-xs mb-1">Today</p>
                <div className="inline-block bg-white rounded-2xl px-5 py-3 shadow-sm">
                  <p className="text-black font-semibold text-sm">Welcome Dhruv Bhai!</p>
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                  <p className="text-black text-sm">Hey there! How are you feeling today? I'm here to listen and support you. 😊</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4 ml-11">
                <button className="px-4 py-2 bg-white rounded-full text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors border border-zinc-200">
                  I'm feeling anxious
                </button>
                <button className="px-4 py-2 bg-white rounded-full text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors border border-zinc-200">
                  Need motivation
                </button>
                <button className="px-4 py-2 bg-white rounded-full text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors border border-zinc-200">
                  Help me relax
                </button>
              </div>

              {/* User Message */}
              <div className="flex gap-3 justify-end mb-4">
                <div className="bg-black rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm max-w-[80%]">
                  <p className="text-white text-sm">I've been feeling a bit stressed lately</p>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                  <p className="text-black text-sm">I understand. Stress can be overwhelming. Would you like to try a quick breathing exercise or talk about what's on your mind?</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-white px-4 py-4 border-t border-zinc-100">
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-zinc-100 rounded-full px-4 py-2.5">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-transparent text-sm text-black placeholder-zinc-400 outline-none"
                    readOnly
                  />
                </div>
                <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-zinc-800 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
