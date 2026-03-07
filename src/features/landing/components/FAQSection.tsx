import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How can I stop overthinking and negative thoughts?',
    answer:
      "Overthinking often stems from anxiety or a need for control. Start by naming the thought (\"I'm overthinking again\") without judgment - awareness is the first step. Grounding techniques like the 5-4-3-2-1 method (notice 5 things you see, 4 you can touch, etc.) interrupt the spiral. Scheduled worry time (15 mins/day to think through concerns, then stop) also helps retrain the brain. Therapy, especially CBT, is highly effective for breaking thought patterns long-term.",
  },
  {
    question: 'How do I deal with anxiety or panic attacks in public places?',
    answer:
      "In the moment: slow your exhale - breathe in for 4 counts, out for 6. This activates the parasympathetic nervous system and signals safety to your brain. Have an exit plan ready (knowing you can leave reduces panic). Over time, gradual exposure to triggering situations with a therapist's guidance (called exposure therapy) significantly reduces public anxiety.",
  },
  {
    question: 'I feel mentally exhausted and unmotivated. What should I do?',
    answer:
      'This is often a sign of burnout or low-grade depression - both very real and treatable. Start small: protect sleep, reduce decision fatigue, and do one tiny enjoyable thing daily. Avoid pushing yourself to just be productive - that often worsens exhaustion. Speaking with a therapist can help identify whether this is burnout, depression, or something else, and build a real recovery plan.',
  },
  {
    question: "How do I know if what I'm feeling is stress, anxiety, or depression?",
    answer:
      'Stress is usually tied to a specific external cause and eases when the situation resolves.\n\nAnxiety is persistent worry or fear, often without a clear trigger, and includes physical symptoms like racing heart or restlessness.\n\nDepression involves prolonged low mood, loss of interest in things you once enjoyed, fatigue, and sometimes hopelessness.\n\nThese can overlap and co-exist. A mental health professional can give you clarity - you do not need to self-diagnose to seek help.',
  },
  {
    question: "What should I do if I don't feel comfortable talking to anyone about my problems?",
    answer:
      'That discomfort is completely valid and very common - especially in cultures where mental health is still stigmatized. Start with anonymity: journaling your thoughts privately, or using text-based therapy platforms where you do not have to speak at all. Soul Yatri therapists are trained to be culturally sensitive and non-judgmental - many clients say the first session felt far safer than they expected. You do not have to share everything at once; you go at your own pace.',
  },
];

export default function FAQSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

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
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`mb-3 rounded-[22px] border transition-all duration-500 ${isOpen ? 'bg-white/6 border-white/20' : 'bg-transparent border-white/10 hover:bg-white/5'
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${0.1 + i * 0.06}s` }}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center min-h-[52px] px-3 py-2 text-left"
                >
                  <div className="w-[34px] h-[34px] rounded-[12px] flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] font-semibold text-white">{i + 1}</span>
                  </div>
                  <p className="flex-1 ml-3 pr-3 text-[12px] sm:text-[13px] text-white/85 leading-relaxed">
                    {faq.question}
                  </p>
                  <span className="flex-shrink-0 w-[34px] h-[34px] flex items-center justify-center">
                    <ChevronDown
                      size={18}
                      className={`text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </span>
                </button>

                <div
                  id={`faq-answer-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-12 pb-4 text-[12px] sm:text-[13px] leading-relaxed text-white/65 whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-8">
          <img src="/images/line-58.svg" alt="" className="w-full h-px opacity-30" />
        </div>
      </div>
    </section>
  );
}
