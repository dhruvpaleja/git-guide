/**
 * Journey Preparation Page
 * Pixel-perfect meditation-style loading screen matching Figma design
 * Displays static cards with unblur animation effect
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MandalaBackground from '../components/MandalaBackground';
import JourneyCard from '../components/JourneyCard';

interface JourneyPreparationPageProps {
  onComplete?: () => void;
  autoAdvanceDelay?: number;
}

export default function JourneyPreparationPage({
  onComplete,
  autoAdvanceDelay = 5600, // lets users feel the full immersive sequence before dashboard
}: JourneyPreparationPageProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [stageScale, setStageScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const scale = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
      setStageScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  useEffect(() => {
    // Auto-navigate to dashboard after delay
    const timer = setTimeout(() => {
      setIsVisible(false);

      // Small delay for fade-out animation before navigation
      setTimeout(() => {
        onComplete?.();
        navigate('/dashboard');
      }, 300);
    }, autoAdvanceDelay);

    return () => clearTimeout(timer);
  }, [navigate, onComplete, autoAdvanceDelay]);

  // Allow users to skip by clicking anywhere on the page
  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div
      className={`w-screen h-screen bg-white relative overflow-hidden transition-opacity duration-500 animate-immersive-scene-in ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleSkip}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_0%,rgba(0,0,0,0.03)_100%)]" />

      {/* Scaled Figma stage (1440x900) to preserve exact coordinates and keep all cards visible */}
      <div
        className="absolute left-1/2 top-1/2 origin-top-left pointer-events-none"
        style={{
          width: '1440px',
          height: '900px',
          transform: `translate(-50%, -50%) scale(${stageScale})`,
        }}
      >
        {/* Mandala Background - static, no animation */}
        <MandalaBackground />

        {/* Ambient center glow for meditative depth */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[760px] h-[760px] rounded-full animate-ambient-breathe bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.25)_32%,rgba(255,255,255,0)_70%)]" />
        </div>

        {/* Subtle grain layer for cinematic texture */}
        <div className="absolute inset-0 opacity-[0.06] animate-grain-shift bg-[linear-gradient(0deg,transparent_24%,rgba(0,0,0,0.09)_25%,rgba(0,0,0,0.09)_26%,transparent_27%,transparent_74%,rgba(0,0,0,0.09)_75%,rgba(0,0,0,0.09)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,0,0,0.08)_25%,rgba(0,0,0,0.08)_26%,transparent_27%,transparent_74%,rgba(0,0,0,0.08)_75%,rgba(0,0,0,0.08)_76%,transparent_77%,transparent)] [background-size:4px_4px]" />

        {/* Journey Stage Cards - exact Figma positioning */}
        <div className="relative w-full h-full">
          <JourneyCard text="Preparing Your Journey" position="top" blurred={false} />
          <JourneyCard text="Centering Your Soul" position="middle" blurred={true} />
          <JourneyCard text="Awakening Soul" position="bottom" blurred={true} />
        </div>
      </div>

      {/* Skip indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-auto cursor-pointer">
        <p className="text-sm text-black/50 font-light hover:text-black/70 transition-colors">
          Click anywhere to skip
        </p>
      </div>

      {/* Loading indicator - subtle pulse at center */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-black"
              style={{
                animation: `pulse-soft ${1.4 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
