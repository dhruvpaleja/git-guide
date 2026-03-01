import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

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
    let mm = gsap.matchMedia();

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
      style={{ height: '100vh', minHeight: '900px' }}
    >
      {/* Grey Ellipse - Figma: size-500, top:-250, centered */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          top: '-250px',
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
        <div className="relative w-full h-[600px] md:h-[800px] flex items-end justify-center mt-20 md:mt-0">
          {/* Subtle background glow behind image instead of blurring the image itself */}
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-[100px] w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Monk image with bottom fade mask */}
          <img
            ref={imageRef}
            src="/images/hero-monk.png"
            alt="Soul Yatri Hero"
            className="relative z-10 w-auto h-full max-h-[85vh] object-contain object-bottom pointer-events-auto origin-bottom"
            style={{
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Text Content */}
      <div ref={textRef} className="relative z-30 w-full h-full max-w-[1440px] mx-auto px-6 md:px-12 pointer-events-none flex flex-col justify-start lg:justify-center lg:block pt-32 sm:pt-40 lg:pt-0 pb-72 sm:pb-0">

        {/* Title "Your Journey Begins." */}
        <div
          className={`transition-all duration-700 lg:absolute lg:top-[390px] lg:left-[6.67%] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[72px] font-medium text-white lg:leading-[1.2] tracking-[-0.02em] text-center lg:text-left drop-shadow-md"
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.6 }
              }
            }}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {"Your ".split("").map((char, i) => (
              <motion.span key={`w1-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>{char}</motion.span>
            ))}
            <br className="hidden lg:block" />

            {"Journey Begins.".split("").map((char, i) => (
              <motion.span key={`w2-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>{char}</motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-[2px] h-[70px] bg-white/70 align-middle ml-1 -translate-y-2 hidden lg:inline-block"
            />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-[2px] h-[36px] bg-white/70 align-middle ml-1 -translate-y-1 lg:hidden"
            />
          </motion.h1>
        </div>

        {/* Content Right Side (Description) */}
        <div
          className={`flex flex-col items-center lg:items-end transition-all duration-700 lg:absolute lg:top-[340px] lg:right-[6.67%] z-30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.5s' }}
        >
          <p className="text-sm sm:text-[15px] font-normal text-white/50 text-center lg:text-right leading-[26px] sm:leading-[30px] tracking-[-0.01em] max-w-sm sm:max-w-md mx-auto lg:mx-0 lg:w-[350px] mb-6 sm:mb-8 drop-shadow-sm px-4 lg:px-0">
            A Tech-enabled Mental wellbeing platform <br className="hidden lg:block" />
            blending modern Psychology, Coaching & <br className="hidden lg:block" />
            Traditional Indian wisdom.
          </p>
        </div>

        {/* CTA Button Centered over the Monk at bottom */}
        <div
          className={`absolute bottom-32 sm:bottom-20 lg:bottom-[15%] left-1/2 -translate-x-1/2 z-50 transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
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
