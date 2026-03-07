import { useEffect, useRef, useState } from 'react';

export default function SoulBotSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="soulbot" className="relative bg-white">
      {/* Title area - Figma: text-32px, text-16px */}
      <div className="text-center py-[50px]">
        <h2
          className={`text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-black tracking-[-0.32px] mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          Your Personal AI SoulBot
        </h2>
        <p
          className={`text-[16px] font-normal text-black/50 tracking-[-0.16px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          style={{ transitionDelay: '0.1s' }}
        >
          Talk To Your AI Soul Bot. Share Your Feelings & Emotions You Want. Share Your Mood.
        </p>
      </div>

      {/* Black chat panel - Figma: h-820, w-1440, bg-black */}
      <div
        className={`bg-black relative overflow-hidden transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        style={{ height: 'clamp(600px, 120vh, 820px)', transitionDuration: '1000ms', transitionDelay: '0.2s' }}
      >
        {/* Grey blur circle - Figma: size-400, top:-200 */}
        <div className="absolute pointer-events-none" style={{ width: 'clamp(200px, 80vw, 400px)', height: 'clamp(200px, 80vw, 400px)', left: '33.33%', top: 'clamp(-100px, -25vw, -200px)' }}>
          <div className="absolute inset-[-100%]">
            <img src="/images/grey-blur-circle.svg" alt="" className="block max-w-none w-full h-full" />
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto relative h-full flex flex-col justify-between py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[82px] z-10">
          {/* Welcome text */}
          <div className="text-center pt-8 md:pt-10">
            <h3 className="text-2xl md:text-[32px] font-semibold text-white tracking-[-0.32px] mb-3 md:w-[420px] mx-auto">
              Welcome back.
            </h3>
            <p className="text-sm md:text-[16px] font-normal text-white/70 tracking-[-0.16px] md:w-[420px] mx-auto">
              Main yahan hoon. Thoda batao, aaj tum kaisa mehsoos kar rahe ho?
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-4 flex-wrap pt-8 pb-4">
            {/* CTA 1 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 cursor-pointer hover:bg-white/5 transition-colors w-full sm:w-auto px-2 pr-6">
              <div className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm rounded-[22px] flex items-center justify-center flex-shrink-0">
                <img src="/images/icon-breathe.png" alt="Breathe" className="w-[20px] h-auto object-contain drop-shadow" />
              </div>
              <span className="text-[14px] md:text-[16px] font-medium text-white text-center ml-3">Help me breathe</span>
            </div>

            {/* CTA 2 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 cursor-pointer hover:bg-white/5 transition-colors w-full sm:w-auto px-2 pr-6">
              <div className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm rounded-[22px] flex items-center justify-center flex-shrink-0">
                <img src="/images/icon-anxious.png" alt="Anxious" className="w-[22px] h-auto object-contain drop-shadow" />
              </div>
              <span className="text-[14px] md:text-[16px] font-medium text-white text-center ml-3">I am Feeling Anxious</span>
            </div>

            {/* CTA 3 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 bg-[#111] cursor-pointer hover:bg-white/10 transition-colors w-full md:w-auto px-2 pr-6 col-span-full sm:col-span-1">
              <div className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm rounded-[22px] flex items-center justify-center flex-shrink-0">
                <img src="/images/icon-sad.png" alt="Sad" className="w-[20px] h-auto object-contain drop-shadow" />
              </div>
              <span className="text-[14px] md:text-[16px] font-medium text-white text-center ml-3">Mein Udas Hu Bat Karo Mujhse</span>
            </div>
          </div>

          {/* Tabs + Voice Chat */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-0 pt-8 border-t border-white/10 md:border-none mt-4 md:mt-0">
            <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar justify-center md:justify-start">
              <div className="text-[14px] md:text-[16px] font-semibold text-white whitespace-nowrap cursor-pointer hover:text-white/80">
                New Chats
              </div>
              <div className="text-[14px] md:text-[16px] font-normal text-white/50 whitespace-nowrap cursor-pointer hover:text-white">
                Chat History
              </div>
              <div className="text-[14px] md:text-[16px] font-normal text-white/50 whitespace-nowrap cursor-pointer hover:text-white">
                Help
              </div>
            </div>

            {/* Voice Chat */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 bg-[#111] cursor-pointer hover:bg-white/10 transition-colors px-2 pr-6 w-full md:w-auto justify-center md:justify-start">
              <div className="w-[50px] h-[50px] bg-white/10 rounded-[22px] flex items-center justify-center flex-shrink-0">
                <img src="/images/icon-mic.png" alt="Voice" className="w-[18px] h-auto object-contain drop-shadow" />
              </div>
              <span className="text-[15px] md:text-[16px] font-semibold text-white ml-3">Voice Chat</span>
            </div>
          </div>

          {/* Chat space */}
          <div className="pt-6 w-full">
            <div className="relative rounded-[25px] bg-[#111] border border-white/10 min-h-[140px] md:min-h-[200px] w-full flex items-center p-6 md:px-12 flex-col md:flex-row gap-6 md:gap-8">
              {/* Robot icon */}
              <div className="w-[60px] md:w-[80px] h-[70px] md:h-[95px] flex-shrink-0 relative">
                <img
                  src="/images/robot.png"
                  alt="SoulBot"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Chat text */}
              <div className="flex-1">
                <p className="text-[14px] md:text-[16px] font-normal text-white/70 tracking-[-0.16px] text-center md:text-left leading-relaxed">
                  {`Main yahan sunne ke liye hoon. Jo tumhare dil mein hai, use share karo.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
