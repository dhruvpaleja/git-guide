import { useEffect, useRef, useState } from 'react';

const faqs = [
  { question: 'How can I stop overthinking and negative thoughts?' },
  { question: 'How do I deal with anxiety or panic attacks in public places?' },
  { question: 'I feel mentally exhausted and unmotivated. What should I do?' },
  { question: "How do I know if what I'm feeling is stress, anxiety, or depression?" },
  { question: "What should I do if I don't feel comfortable talking to anyone about my problems?" },
];

export default function FAQSection() {
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="relative py-14 bg-black">
      {/* Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] opacity-25 pointer-events-none">
        <img src="/images/grey-blur-circle.svg" alt="" className="w-full h-full" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <h2
          className={`text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-white text-center tracking-tight mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          Get Your All Questions Answered
        </h2>

        <div className="max-w-[700px] mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`flex items-center min-h-[52px] rounded-full px-3 py-2 mb-3 group cursor-pointer hover:bg-white/5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: `${0.1 + i * 0.06}s` }}
            >
              <div className="w-[34px] h-[34px] rounded-[12px] flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-semibold text-white">{i + 1}</span>
              </div>
              <p className="flex-1 ml-3 text-[12px] sm:text-[13px] text-white/80 leading-relaxed">
                {faq.question}
              </p>
              <div className="flex-shrink-0 w-[34px] h-[34px] flex items-center justify-center">
                <img src="/images/arrow.svg" alt="" className="w-[34px] h-[34px] opacity-50" />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-8">
          <img src="/images/line-58.svg" alt="" className="w-full h-px opacity-30" />
        </div>
      </div>
    </section>
  );
}
