import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const HERO_WORD_ONE_CHARS = Array.from('Your ');
const HERO_WORD_TWO_CHARS = Array.from('Journey Begins.');
const HERO_TITLE_VARIANTS = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.6 },
  },
};
const HERO_LETTER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const HERO_CURSOR_TRANSITION = { repeat: Infinity, duration: 0.8, ease: 'linear' } as const;

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop: Full pinning and scale out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=120%", // Slightly reduced scrub distance for better feel
          pin: true,
          scrub: 1,
        }
      });

      tl.to(imageRef.current, {
        scale: 1.5,
        y: 100, // Move down slightly to stay centered while scaling
        opacity: 0,
        ease: "power2.inOut",
      }, 0);

      tl.to(textRef.current, {
        opacity: 0,
        y: -50,
        ease: "power2.in",
      }, 0);
    });

    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      // Tablet: Parallax only, no pinning to avoid swipe-trap
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      tl.to(imageRef.current, {
        y: 200,
        opacity: 0,
        ease: "none",
      }, 0);

      tl.to(textRef.current, {
        y: -100,
        opacity: 0,
        ease: "none",
      }, 0);
    });

    // Mobile (<768px): No GSAP scroll animation needed. We let normal document scrolling take over.
    // Framer motion handles the entrance.

    return () => mm.revert(); // Cleanup
  }, { scope: container });

  return (
    <section
      id="home"
      ref={container}
      className="relative overflow-hidden bg-black"
      style={{ height: '100dvh' }}
    >
      {/* Grey Ellipse - Figma: size-500, top:-250, centered */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 'clamp(250px, 60vw, 500px)',
          height: 'clamp(250px, 60vw, 500px)',
          top: 'clamp(-125px, -30vw, -250px)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="absolute inset-[-100%]">
          <img src="/images/grey-ellipse.svg" alt="" className="block max-w-none w-full h-full" />
        </div>
      </div>

      {/* Hero image container - pinned by GSAP */}
      <div
        className={`absolute inset-0 flex items-end justify-center pointer-events-none transition-all ${isVisible ? 'opacity-100' : 'opacity-0 scale-95'
          }`}
        style={{ transitionDuration: '1500ms', transitionDelay: '0.2s', paddingBottom: '0' }}
      >
        <div className="relative w-full h-[500px] md:h-[700px] flex items-end justify-center mt-16 md:mt-0">
          {/* Subtle background glow behind image instead of blurring the image itself */}
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-[100px] w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Monk image with bottom fade mask */}
          <img
            ref={imageRef}
            src="/images/hero-monk.png"
            alt="Soul Yatri Hero"
            className="relative z-10 w-auto h-full max-h-[75dvh] object-contain object-bottom pointer-events-auto origin-bottom"
            style={{
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Text Content */}
      <div ref={textRef} className="relative z-30 w-full h-full max-w-[1440px] mx-auto px-6 md:px-12 pointer-events-none flex flex-col justify-start lg:justify-center lg:block pt-24 sm:pt-28 lg:pt-0 pb-48 sm:pb-0">

        {/* Title "Your Journey Begins." */}
        <div
          className={`transition-all duration-700 lg:absolute lg:top-[390px] lg:left-[6.67%] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-[60px] font-medium text-white lg:leading-[1.2] tracking-[-0.02em] text-center lg:text-left drop-shadow-md"
            variants={HERO_TITLE_VARIANTS}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {HERO_WORD_ONE_CHARS.map((char, i) => (
              <motion.span key={`w1-${i}`} variants={HERO_LETTER_VARIANTS}>{char}</motion.span>
            ))}
            <br className="hidden lg:block" />

            {HERO_WORD_TWO_CHARS.map((char, i) => (
              <motion.span key={`w2-${i}`} variants={HERO_LETTER_VARIANTS}>{char}</motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={HERO_CURSOR_TRANSITION}
              className="inline-block w-[2px] h-[56px] bg-white/70 align-middle ml-1 -translate-y-2 hidden lg:inline-block"
            />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={HERO_CURSOR_TRANSITION}
              className="inline-block w-[2px] h-[28px] bg-white/70 align-middle ml-1 -translate-y-1 lg:hidden"
            />
          </motion.h1>
        </div>

        {/* Content Right Side (Description) */}
        <div
          className={`flex flex-col items-center lg:items-end transition-all duration-700 lg:absolute lg:top-[340px] lg:right-[6.67%] z-30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.5s' }}
        >
          <p className="text-xs sm:text-[13px] font-normal text-white/50 text-center lg:text-right leading-[22px] sm:leading-[26px] tracking-[-0.01em] max-w-sm sm:max-w-md mx-auto lg:mx-0 lg:w-[350px] mb-4 sm:mb-6 drop-shadow-sm px-4 lg:px-0">
            A Tech-enabled Mental wellbeing platform <br className="hidden lg:block" />
            blending modern Psychology, Coaching & <br className="hidden lg:block" />
            Traditional Indian wisdom.
          </p>
        </div>

        {/* CTA Button Centered over the Monk at bottom */}
        <div
          className={`absolute bottom-24 sm:bottom-16 lg:bottom-[12%] left-1/2 -translate-x-1/2 z-50 transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          style={{ transitionDuration: '1000ms', transitionDelay: '1.2s' }}
        >
          <Link to="/contact" className="h-[52px] sm:h-[56px] px-8 sm:px-10 rounded-[28px] text-[13px] sm:text-[14px] font-medium text-white/90 tracking-[0.02em] text-center transition-all duration-300 hover:scale-105 border border-white/10 bg-[#311d17]/60 hover:bg-[#311d17]/90 backdrop-blur-xl pointer-events-auto shadow-[0_0_20px_rgba(49,29,23,0.5)] inline-flex items-center justify-center">
            Start Your Journey
          </Link>
        </div>

      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
    </section>
  );
}
