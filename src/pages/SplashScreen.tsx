import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const GREETINGS = [
  'नमस्ते',       // Hindi
  'Hello',        // English
  'こんにちは',     // Japanese
  'مرحبا',        // Arabic
  'Bonjour',      // French
  'Hola',         // Spanish
  'Ciao',         // Italian
  'Olá',          // Portuguese
  'Привет',       // Russian
  '안녕하세요',     // Korean
  '你好',          // Chinese
  'Hallo',        // German
  'Merhaba',      // Turkish
  'Sawubona',     // Zulu
  'Salam',        // Persian
  'Habari',       // Swahili
  'Xin chào',     // Vietnamese
  'Sawasdee',     // Thai
  'Salut',        // Romanian
  'Aloha',        // Hawaiian
];

/** CSS-based gradient-stroke circle using mask trick */
function GradientCircle({
  size,
  color,
  className = '',
}: {
  size: number;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        WebkitMask:
          'radial-gradient(farthest-side, transparent calc(100% - 1px), black calc(100% - 1px))',
        mask:
          'radial-gradient(farthest-side, transparent calc(100% - 1px), black calc(100% - 1px))',
        willChange: 'transform, opacity',
      }}
    />
  );
}

export default function SplashScreen() {
  const navigate = useNavigate();
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  return (
    <div
      className="relative flex h-screen w-full cursor-pointer items-center justify-center overflow-hidden bg-black"
      onClick={handleClick}
    >
      {/* Animated Concentric Circles */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Outer circle - cyan/teal - wave 1 */}
        <GradientCircle
          size={1000}
          color="#18A2B8"
          className="animate-circle-expand"
        />
        {/* Outer circle - cyan/teal - wave 2 (staggered) */}
        <GradientCircle
          size={1000}
          color="#18A2B8"
          className="animate-circle-expand animation-delay-2000"
        />

        {/* Inner circle - orange - wave 1 */}
        <GradientCircle
          size={500}
          color="#FF7B00"
          className="animate-circle-expand animation-delay-500"
        />
        {/* Inner circle - orange - wave 2 (staggered) */}
        <GradientCircle
          size={500}
          color="#FF7B00"
          className="animate-circle-expand animation-delay-2500"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Tap To Lotus */}
        <p
          className="absolute -top-[200px] whitespace-nowrap text-sm tracking-tight text-white/50 sm:-top-[240px]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.14px' }}
        >
          Tap To Lotus
        </p>

        {/* Logo */}
        <img
          src="./images/soul-yatri-logo.png"
          alt="Soul Yatri Logo"
          className="h-[42px] w-[50px] object-cover"
        />

        {/* Title */}
        <h1
          className="mt-5 text-2xl font-semibold tracking-tight text-white"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.24px' }}
        >
          Soul Yatri
        </h1>

        {/* Cycling Greeting */}
        <p
          className="mt-2 h-9 min-w-[70px] text-center text-2xl text-white/60"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          key={greetingIndex}
        >
          {GREETINGS[greetingIndex]}
        </p>
      </div>
    </div>
  );
}
