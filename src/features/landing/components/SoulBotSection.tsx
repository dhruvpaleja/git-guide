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
          className={`text-[32px] font-semibold text-black tracking-[-0.32px] mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          You Personal AI SouBot
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
        className={`bg-black relative overflow-hidden transition-all duration-[1000ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        style={{ height: '820px', transitionDelay: '0.2s' }}
      >
        {/* Grey blur circle - Figma: size-400, top:-200 */}
        <div className="absolute pointer-events-none" style={{ width: '400px', height: '400px', left: '33.33%', top: '-200px' }}>
          <div className="absolute inset-[-100%]">
            <img src="/images/grey-blur-circle.svg" alt="" className="block max-w-none w-full h-full" />
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto relative h-full">
          {/* Welcome text - Figma: text-32px at top:80 */}
          <div className="text-center" style={{ paddingTop: '80px' }}>
            <h3 className="text-[32px] font-semibold text-white tracking-[-0.32px] mb-3" style={{ width: '420px', margin: '0 auto' }}>
              Welcome Dhruv Bhai!
            </h3>
            <p className="text-[16px] font-normal text-white/50 tracking-[-0.16px]" style={{ width: '420px', margin: '0 auto' }}>
              Main hoon yahan — thoda batao, kya ho raha hai?
            </p>
          </div>

          {/* CTA buttons - Figma: h-60 each, rounded-25, top:240 */}
          <div className="flex justify-center gap-[8px] flex-wrap" style={{ paddingTop: '60px' }}>
            {/* CTA 1 - Figma: w-204 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 cursor-pointer hover:border-white/40 transition-colors" style={{ width: '204px' }}>
              <div className="w-[50px] h-[50px] bg-white rounded-[22px] flex items-center justify-center flex-shrink-0 ml-[5px] overflow-hidden">
                <div className="relative w-[18px] h-[25px]">
                  <img src="/images/icon-breathe.png" alt="" className="absolute max-w-none" style={{ width: '152%', height: '111%', left: '-26%', top: '-6%' }} />
                </div>
              </div>
              <span className="text-[16px] font-normal text-white text-center tracking-[-0.16px] flex-1">Help me breathe</span>
            </div>

            {/* CTA 2 - Figma: w-228 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 cursor-pointer hover:border-white/40 transition-colors" style={{ width: '228px' }}>
              <div className="w-[50px] h-[50px] bg-white rounded-[22px] flex items-center justify-center flex-shrink-0 ml-[6px] overflow-hidden">
                <div className="relative w-[21px] h-[25px]">
                  <img src="/images/icon-anxious.png" alt="" className="absolute max-w-none" style={{ width: '131%', height: '111%', left: '-15%', top: '-11%' }} />
                </div>
              </div>
              <span className="text-[16px] font-normal text-white text-center tracking-[-0.32px] flex-1">I am Feeling Anxious</span>
            </div>

            {/* CTA 3 - Figma: w-305, bg-#080808 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 bg-[#080808] cursor-pointer hover:border-white/40 transition-colors" style={{ width: '305px' }}>
              <div className="w-[50px] h-[50px] bg-white rounded-[22px] flex items-center justify-center flex-shrink-0 ml-[5px] overflow-hidden">
                <div className="relative w-[18px] h-[25px]">
                  <img src="/images/icon-sad.png" alt="" className="absolute max-w-none rounded-b-[5px]" style={{ width: '148%', height: '105%', left: '-22%', top: '-5%' }} />
                </div>
              </div>
              <span className="text-[16px] font-normal text-white text-center tracking-[-0.16px] flex-1">Mein Udas Hu Bat Karo Mujhse</span>
            </div>
          </div>

          {/* Tabs + Voice Chat - Figma: top:450 */}
          <div className="flex items-center justify-between px-[82px]" style={{ paddingTop: '60px' }}>
            <div className="flex items-center gap-0">
              <div className="flex items-center justify-center h-[60px] text-[16px] font-semibold text-white text-center tracking-[-0.16px]" style={{ width: '82px' }}>
                New Chats
              </div>
              <div className="flex items-center justify-center h-[60px] text-[16px] font-normal text-white/50 text-center tracking-[-0.16px]" style={{ width: '91px' }}>
                Chat History
              </div>
              <div className="flex items-center justify-center h-[60px] text-[16px] font-normal text-white/50 text-center tracking-[-0.16px]" style={{ width: '34px' }}>
                Help
              </div>
            </div>

            {/* Voice Chat - Figma: w-166, h-60, bg-#080808 */}
            <div className="flex items-center h-[60px] rounded-[25px] border border-white/20 bg-[#080808] cursor-pointer hover:border-white/40 transition-colors" style={{ width: '166px' }}>
              <div className="w-[50px] h-[50px] bg-white rounded-[22px] flex items-center justify-center flex-shrink-0 ml-[5px] overflow-hidden">
                <div className="relative w-[17px] h-[25px]">
                  <img src="/images/icon-mic.png" alt="" className="absolute max-w-none" style={{ width: '147%', height: '100%', left: '-24%', top: '0' }} />
                </div>
              </div>
              <span className="text-[16px] font-semibold text-white text-center tracking-[-0.16px] flex-1">Voice Chat</span>
            </div>
          </div>

          {/* Chat space - Figma: h-200, w-1276, rounded-25, bg-#080808, border white/10 */}
          <div className="px-[82px]" style={{ paddingTop: '20px' }}>
            <div
              className="relative rounded-[25px] bg-[#080808] border border-white/10"
              style={{ height: '200px', width: '1276px', maxWidth: '100%' }}
            >
              {/* Robot - Figma: w-80, h-95 */}
              <div className="absolute flex items-center justify-center" style={{ left: '50px', top: '52px', width: '80px', height: '95px' }}>
                <div className="-scale-y-100 rotate-180">
                  <div className="relative" style={{ width: '80px', height: '95px' }}>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img
                        src="/images/robot.png"
                        alt="SoulBot"
                        className="absolute max-w-none"
                        style={{ width: '133.33%', height: '114.16%', left: '-16.8%', top: '-7.53%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Chat text - Figma: text-16px, white/50 */}
              <div className="absolute flex items-center" style={{ left: '180px', top: '0', bottom: '0', right: '50px' }}>
                <p className="text-[16px] font-normal text-white/50 tracking-[-0.16px]">
                  {`Mein tumhara dost hu. Mujhse share karo jo tumhare dil mein haii... `}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
