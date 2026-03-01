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
  autoAdvanceDelay = 5000, // 5 seconds to view unblur animations + static content
}: JourneyPreparationPageProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

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
      className={`w-screen h-screen bg-white relative overflow-hidden transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleSkip}
    >
      {/* Mandala Background - static, no animation */}
      <MandalaBackground />

      {/* Journey Stage Cards - exact Figma positioning */}
      <div className="relative w-full h-full pointer-events-none">
          {/* Card 1: Preparing Your Journey - Fully visible, no blur */}
          <JourneyCard text="Preparing Your Journey" position="top" blurred={false} />

          {/* Card 2: Centering Your Soul - Starts blurred, animates to unblur */}
          <JourneyCard text="Centering Your Soul" position="middle" blurred={true} />

          {/* Card 3: Awakening Soul - Starts blurred, animates to unblur */}
          <JourneyCard text="Awakening Soul" position="bottom" blurred={true} />
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
                animation: `pulse ${1.4 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
