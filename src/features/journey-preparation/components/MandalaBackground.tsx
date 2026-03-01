/**
 * MandalaBackground Component
 * Displays a continuously rotating mandala pattern for immersive visual effect
 */

export default function MandalaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main mandala - full size, rotated */}
      <div 
        className="absolute w-full h-full animate-mandala-rotate"
        style={{
          left: '-30%',
          top: '-30%',
          width: '160%',
          height: '160%',
        }}
      >
        <img
          src="/images/journey-preparation/mandala.png"
          alt="Mandala background"
          className="w-full h-full object-cover opacity-5"
          loading="lazy"
        />
      </div>

      {/* Secondary mandala - rotated differently for layering effect */}
      <div 
        className="absolute animate-mandala-rotate"
        style={{
          left: '-25%',
          top: '-25%',
          width: '150%',
          height: '150%',
          animationDirection: 'reverse',
          animationDuration: '180s',
        }}
      >
        <img
          src="/images/journey-preparation/mandala.png"
          alt="Mandala background overlay"
          className="w-full h-full object-cover opacity-3"
          loading="lazy"
        />
      </div>

      {/* Mini mandala - centered, faster rotation */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-mandala-rotate"
        style={{
          width: '40%',
          height: '40%',
          animationDuration: '60s',
        }}
      >
        <img
          src="/images/journey-preparation/mandala.png"
          alt="Mandala center"
          className="w-full h-full object-cover opacity-4 rounded-full"
          loading="lazy"
        />
      </div>

      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.02) 100%)',
        }}
      />
    </div>
  );
}
