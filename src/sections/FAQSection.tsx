import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How can I start my wellness journey with Soul Yatri?',
    answer: 'Starting your wellness journey is simple. Create an account, complete a brief assessment to understand your needs, and explore our range of services including guided plans, 1-1 sessions, and micro tools. Our AI SoulBot is also available 24/7 to provide immediate support and guidance.',
  },
  {
    question: 'What types of wellness services do you offer?',
    answer: 'We offer a comprehensive range of wellness services including breathwork sessions, therapy with licensed professionals, counseling, healing practices, guided wellness plans, and AI-powered support through our SoulBot. Each service is designed to address different aspects of mental and emotional well-being.',
  },
  {
    question: 'How do I book a session with a therapist or counsellor?',
    answer: 'Booking a session is easy. Browse our network of verified therapists and counsellors, view their profiles and specialties, and select a time slot that works for you. You can book directly through our platform and receive confirmation instantly. Sessions can be conducted via video call or chat.',
  },
  {
    question: 'Is my personal information and data secure?',
    answer: 'Absolutely. We take your privacy very seriously. All your personal information and session data are encrypted and stored securely. We comply with all relevant data protection regulations and never share your information with third parties without your explicit consent.',
  },
  {
    question: 'Can I access Soul Yatri services from anywhere?',
    answer: 'Yes! Soul Yatri is accessible from anywhere in the world. All you need is an internet connection. Our platform works on desktop, tablet, and mobile devices, allowing you to access wellness support whenever and wherever you need it.',
  },
];

function FAQAccordionItem({ item, index, isOpen, onToggle, isVisible }: { 
  item: FAQItem; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
  isVisible: boolean;
}) {
  return (
    <div
      className={`border-b border-zinc-800 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-base sm:text-lg font-medium text-white pr-8 group-hover:text-teal-400 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-black"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          className={`text-3xl sm:text-4xl font-bold text-white text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Get Your All Question Answers
        </h2>

        {/* FAQ Accordion */}
        <div className="border-t border-zinc-800">
          {faqs.map((faq, index) => (
            <FAQAccordionItem
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
