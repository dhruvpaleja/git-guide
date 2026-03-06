import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WellnessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const bgRef = useRef<HTMLDivElement>(null);
  const leftCircleRef = useRef<HTMLDivElement>(null);
  const rightCircleRef = useRef<HTMLDivElement>(null);
  const strokeRingRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop & Tablet (>= 768px): Full scrub animation
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "top 10%",
          scrub: 1,
        }
      });

      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0);
      tl.fromTo(leftCircleRef.current, { x: -20, scale: 0.8, opacity: 0 }, { x: -200, scale: 1, opacity: 1, ease: "none" }, 0);
      tl.fromTo(rightCircleRef.current, { x: 20, scale: 0.8, opacity: 0 }, { x: 200, scale: 1, opacity: 1, ease: "none" }, 0);
      tl.fromTo(strokeRingRef.current, { scale: 0.84, opacity: 0 }, { scale: 1.05, opacity: 0.4, ease: "none" }, 0);
      tl.fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0);
      tl.fromTo(descRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0);
      tl.fromTo(imageContainerRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0);
    });

    // Mobile (< 768px): Simplified animation, no heavy scrub on shapes
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: 1, // Shorter scrub for faster perceived performance on mobile
        }
      });

      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0);

      // Circles just fade in, no heavy translation
      tl.fromTo([leftCircleRef.current, rightCircleRef.current, strokeRingRef.current],
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: "power1.out" }, 0);

      // Text elements simply fade up
      tl.fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0);
      tl.fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.1);
      tl.fromTo(imageContainerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.2);
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-black flex flex-col items-center justify-center pt-24 pb-16"
      style={{ minHeight: 'clamp(800px, 140vh, 1100px)' }}
    >
      {/* Dynamic Background Brightness Illusion */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(255, 123, 0, 0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Center Grouping for the animated circles */}
      <div className="absolute inset-0 flex items-center justify-center top-[-100px] pointer-events-none">

        {/* Left Orange Half Circle */}
        <div
          ref={leftCircleRef}
          className="absolute"
          style={{
            width: 'clamp(250px, 70vw, 500px)',
            height: 'clamp(500px, 140vw, 1000px)',
            borderRadius: '500px 0 0 500px',
            background: 'linear-gradient(to bottom, #ffa755, #ff7b00 50%)',
            filter: 'blur(50px)',
            right: '50%',
            transformOrigin: 'right center',
          }}
        />

        {/* Right Orange Half Circle */}
        <div
          ref={rightCircleRef}
          className="absolute"
          style={{
            width: 'clamp(250px, 70vw, 500px)',
            height: 'clamp(500px, 140vw, 1000px)',
            borderRadius: '0 500px 500px 0',
            background: 'linear-gradient(to bottom, #ffa755, #ff7b00 50%)',
            filter: 'blur(50px)',
            left: '50%',
            transformOrigin: 'left center',
          }}
        />

        {/* Orange Stroke Ring */}
        <div
          ref={strokeRingRef}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            width: 'clamp(600px, 160vw, 1200px)',
            height: 'clamp(600px, 160vw, 1200px)',
          }}
        >
          <img src="/images/orange-stroke.svg" alt="" className="block w-full h-full object-contain" />
        </div>
      </div>

      {/* Content - Fully Centered over the animation */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center">

        {/* Title */}
        <div ref={titleRef} className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-[-0.32px] text-center px-4 mb-6">
            Wellness Feels Fragmented
          </h2>
        </div>

        {/* Description */}
        <div ref={descRef} className="text-center">
          <p className="text-sm md:text-base font-normal text-white/80 leading-[26px] md:leading-[30px] tracking-[-0.14px] max-w-xl mx-auto px-4 drop-shadow-md">
            Mental health services are expensive, scarce and stigmatized. <br className="hidden md:block" />
            Many prefer culturally familiar modalities (astrology, spiritual healers) <br className="hidden md:block" />
            but those services are fragmented, unregulated and often lack measurable outcomes.
          </p>
        </div>

        {/* Model Image Container */}
        <div ref={imageContainerRef} className="flex justify-center mt-12 px-4">
          <div
            className="relative overflow-hidden w-full max-w-[540px] aspect-[4/5] object-cover"
            style={{
              borderRadius: '0 0 0 clamp(40px, 10vw, 120px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="/images/model-image.png"
              alt="Wellness Model Silhouette"
              className="absolute w-full h-full object-cover scale-110 object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
