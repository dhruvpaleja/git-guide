import { useEffect, useRef, useState } from 'react';

/* ───────────────────── Count-Up Hook ───────────────────── */
function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return value;
}

/* ───────────────── Format helpers ──────────────────────── */
function formatNumber(n: number, type: 'lakh' | 'plain') {
  if (type === 'lakh') {
    if (n >= 100000) {
      const lakhs = Math.floor(n / 100000);
      return `${lakhs} Lakh`;
    }
    return n.toLocaleString('en-IN');
  }
  return n.toString();
}

/* ───────────────── Stats data ──────────────────────────── */
const stats = [
  {
    prefix: 'More than ',
    number: 150,
    suffix: '+',
    format: 'plain' as const,
    subtitle: 'Courses available for your Health.',
    action: 'Explore Now',
  },
  {
    prefix: '',
    number: 200000,
    suffix: ' Plus',
    format: 'lakh' as const,
    subtitle: 'Practitioners available for your Health.',
    action: 'Consult Now',
  },
  {
    prefix: 'More than ',
    number: 100,
    suffix: '+',
    format: 'plain' as const,
    subtitle: 'Instructors available for your Health.',
    action: 'Connect Now',
  },
];

/* ──────────────── Animated Stat Card ───────────────────── */
function StatCard({
  stat,
  isVisible,
  delay,
}: {
  stat: (typeof stats)[number];
  isVisible: boolean;
  delay: number;
}) {
  const count = useCountUp(stat.number, 2000, isVisible);

  return (
    <div
      className="flex flex-col items-center justify-center px-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
      }}
    >
      <p
        className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold text-white tracking-tight mb-2 whitespace-normal md:whitespace-nowrap"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {stat.prefix}
        <span>{formatNumber(count, stat.format)}</span>
        {stat.suffix}
      </p>

      <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-normal text-white/50 leading-relaxed mb-5 text-center max-w-[260px] sm:max-w-[280px]">
        {stat.subtitle}
      </p>

      <button
        type="button"
        className="inline-flex min-h-[40px] items-center px-1 text-[14px] lg:text-[15px] font-normal text-white/50 tracking-tight hover:text-white/60 transition-colors duration-300 bg-transparent border-none cursor-pointer"
      >
        {stat.action}
      </button>
    </div>
  );
}

/* ──────────── Golden Gradient Separator (vertical) ─────── */
function GoldenSeparator({ isVisible, delay }: { isVisible: boolean; delay: number }) {
  return (
    <div
      className="hidden md:flex items-center justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity 1s ease ${delay}s`,
      }}
    >
      <div
        style={{
          width: '1px',
          height: '100px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(204, 98, 0, 0.6) 30%, rgba(204, 98, 0, 0.8) 50%, rgba(204, 98, 0, 0.6) 70%, transparent 100%)',
          borderRadius: '1px',
        }}
      />
    </div>
  );
}

/* ════════════════ StatsSection ═════════════════════════ */
export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{ padding: 'clamp(60px, 10vw, 100px) 0 clamp(80px, 12vw, 120px)' }}
    >
      {/* ── Unified Circular Background Effect ───────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15, 40, 60, 0.4) 0%, transparent 60%)',
        }}
      />

      {/* ── Blue Ellipse - LEFT side (subtle) ────────────── */}
      <div
        className="absolute pointer-events-none opacity-30"
        style={{
          width: '700px',
          height: '700px',
          left: '-300px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <img
          src="/images/blue-ellipse-2.svg"
          alt=""
          className="block w-full h-full"
          style={{ transform: 'rotate(-90deg)' }}
        />
      </div>

      {/* ── Blue Ellipse - RIGHT side (subtle) ───────────── */}
      <div
        className="absolute pointer-events-none opacity-30"
        style={{
          width: '700px',
          height: '700px',
          right: '-300px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <img
          src="/images/blue-ellipse.svg"
          alt=""
          className="block w-full h-full"
          style={{ transform: 'rotate(90deg)' }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-3">
          <h2
            className="text-[28px] md:text-[32px] font-semibold text-white tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              lineHeight: '1.2',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Soul Yatri Family
          </h2>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-16">
          <p
            className="text-[14px] md:text-[15px] font-normal text-white/50 tracking-tight max-w-[400px] mx-auto"
            style={{
              lineHeight: '1.5',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
            }}
          >
            The family which takes care of you and your mental health.
          </p>
        </div>

        {/* Stats Row — 3 cards with 2 golden separators */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0">
          {/* Card 1 */}
          <div className="flex-1 flex justify-center w-full">
            <StatCard stat={stats[0]} isVisible={isVisible} delay={0.2} />
          </div>

          {/* Separator 1 */}
          <GoldenSeparator isVisible={isVisible} delay={0.4} />

          {/* Card 2 */}
          <div className="flex-1 flex justify-center">
            <StatCard stat={stats[1]} isVisible={isVisible} delay={0.3} />
          </div>

          {/* Separator 2 */}
          <GoldenSeparator isVisible={isVisible} delay={0.5} />

          {/* Card 3 */}
          <div className="flex-1 flex justify-center">
            <StatCard stat={stats[2]} isVisible={isVisible} delay={0.4} />
          </div>
        </div>
      </div>
    </section>
  );
}
