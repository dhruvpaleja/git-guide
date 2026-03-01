/**
 * Journey Preparation Page
 * Loading screen shown when user completes login flow
 * Displays journey stages: Preparing, Centering, Awakening
 * Features rotating mandala background for immersive experience
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
  autoAdvanceDelay = 6000, // 6 seconds before auto-advancing
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
      {/* Mandala Background with rotating effect */}
      <MandalaBackground />

      {/* Journey Stage Cards */}
      <div className="relative w-full h-full pointer-events-none">
        {/* Stage 1: Preparing Your Journey - appears first, fully visible */}
        <JourneyCard
          text="Preparing Your Journey"
          position="top"
          animationDelay="0s"
          blurred={false}
          opacity={1}
        />

        {/* Stage 2: Centering Your Soul - appears second, subtle blur, 40% opacity */}
        <JourneyCard
          text="Centering Your Soul"
          position="middle"
          animationDelay="1.5s"
          blurred={true}
          opacity={0.4}
        />

        {/* Stage 3: Awakening Soul - appears third, more blur, 30% opacity */}
        <JourneyCard
          text="Awakening Soul"
          position="bottom"
          animationDelay="3s"
          blurred={true}
          opacity={0.3}
        />
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
