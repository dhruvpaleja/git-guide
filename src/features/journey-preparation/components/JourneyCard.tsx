/**
 * JourneyCard Component
 * Animated text card for journey preparation stages
 */

interface JourneyCardProps {
  text: string;
  position: 'top' | 'middle' | 'bottom';
  animationDelay: string;
  blurred?: boolean;
  opacity?: number;
}

export default function JourneyCard({
  text,
  position,
  animationDelay,
  blurred = false,
  opacity = 1,
}: JourneyCardProps) {
  // Position-specific styling
  const positionClasses = {
    top: 'left-[90px] top-[237px] w-[450px]',
    middle: 'left-[545px] top-[487px] w-[350px]',
    bottom: 'left-[1050px] top-[717px] w-[300px]',
  };

  // Text size classes based on position
  const textSizeClasses = {
    top: 'text-3xl font-semibold tracking-[-0.32px]',
    middle: 'text-2xl font-normal tracking-[-0.24px]',
    bottom: 'text-lg font-normal tracking-[-0.18px]',
  };

  // Height classes
  const heightClasses = {
    top: 'h-[100px]',
    middle: 'h-[80px]',
    bottom: 'h-[70px]',
  };

  // Get default opacity based on position
  const defaultOpacity = {
    top: 1,
    middle: 0.4,
    bottom: 0.3,
  };

  const finalOpacity = opacity !== 1 ? opacity : defaultOpacity[position];

  // Border styles based on position
  const borderColor = {
    top: 'border-[rgba(0,0,0,0.2)]',
    middle: 'border-[rgba(0,0,0,0.3)]',
    bottom: 'border-[rgba(0,0,0,0.2)]',
  };

  // Gradient directions
  const gradients = {
    top: 'linear-gradient(-70.17694293521421deg, rgb(255, 255, 255) 62.653%, rgb(249, 249, 249) 100%)',
    middle: 'linear-gradient(104.9699877734434deg, rgb(255, 255, 255) 50.116%, rgb(249, 249, 249) 100%)',
    bottom: 'linear-gradient(104.67779760411315deg, rgb(255, 255, 255) 50.116%, rgb(249, 249, 249) 100%)',
  };

  return (
    <div
      className={`absolute animate-journey-card ${positionClasses[position]} ${heightClasses[position]} ${blurred ? 'blur-[4px]' : ''}`}
      style={{
        animationDelay,
        opacity: blurred ? 1 : finalOpacity,
      }}
    >
      {/* Card background with gradient and border */}
      <div
        className={`absolute h-full w-full border border-solid rounded-[30px] left-0 top-0 ${borderColor[position]} shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)]`}
        style={{
          backgroundImage: gradients[position],
        }}
      />

      {/* Text content */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center font-['Manrope:Regular',sans-serif] font-normal leading-tight text-center text-black ${textSizeClasses[position]}`}
        style={{
          opacity: finalOpacity,
        }}
      >
        <p className="leading-normal px-4">{text}</p>
      </div>
    </div>
  );
}
