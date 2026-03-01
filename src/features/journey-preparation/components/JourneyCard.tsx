/**
 * JourneyCard Component
 * Static positioned text cards matching Figma design exactly
 * Cards 2 & 3 animate from blurred to sharp (unblur animation)
 */

interface JourneyCardProps {
  text: string;
  position: 'top' | 'middle' | 'bottom';
  blurred?: boolean;
}

export default function JourneyCard({
  text,
  position,
  blurred = false,
}: JourneyCardProps) {
  // Position-specific data from Figma design
  const positionData = {
    top: {
      left: '90px',
      top: '237px',
      width: '450px',
      height: '100px',
      fontSize: '32px',
      textTracking: '-0.32px',
      gradient: 'linear-gradient(-70.17694293521421deg, rgb(255, 255, 255) 62.653%, rgb(249, 249, 249) 100%)',
      borderColor: 'rgba(0,0,0,0.2)',
      opacity: 1,
      animationDelay: '0s',
    },
    middle: {
      left: '545px',
      top: '487px',
      width: '350px',
      height: '80px',
      fontSize: '24px',
      textTracking: '-0.24px',
      gradient: 'linear-gradient(104.9699877734434deg, rgb(255, 255, 255) 50.116%, rgb(249, 249, 249) 100%)',
      borderColor: 'rgba(0,0,0,0.3)',
      opacity: 0.4,
      animationDelay: '0.8s',
    },
    bottom: {
      left: '1050px',
      top: '717px',
      width: '300px',
      height: '70px',
      fontSize: '18px',
      textTracking: '-0.18px',
      gradient: 'linear-gradient(104.67779760411315deg, rgb(255, 255, 255) 50.116%, rgb(249, 249, 249) 100%)',
      borderColor: 'rgba(0,0,0,0.2)',
      opacity: 0.3,
      animationDelay: '1.6s',
    },
  };

  const data = positionData[position];
  const shouldUnblur = position !== 'top'; // Cards 2 & 3 unblur

  return (
    <div
      className={`absolute transition-all duration-1200 ${
        blurred && shouldUnblur ? 'animate-unblur-in' : ''
      }`}
      style={{
        left: data.left,
        top: data.top,
        width: data.width,
        height: data.height,
        filter: blurred && shouldUnblur ? 'blur(4px)' : 'blur(0px)',
        animationDelay: data.animationDelay,
      }}
    >
      {/* Card background with gradient and border */}
      <div
        className="absolute inset-0 border border-solid rounded-[30px] shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)]"
        style={{
          backgroundImage: data.gradient,
          borderColor: data.borderColor,
        }}
      />

      {/* Text content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center font-['Manrope:Regular',sans-serif] font-normal text-center text-black"
        style={{
          fontSize: data.fontSize,
          opacity: data.opacity,
          letterSpacing: data.textTracking,
          lineHeight: 'normal',
        }}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}
