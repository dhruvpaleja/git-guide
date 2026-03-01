/**
 * Mandala Background Component
 * Static mandala background layers matching Figma design exactly (no animations)
 */

export default function MandalaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main mandala - large left layer at position from Figma */}
      <div
        className="absolute animate-mandala-breathe"
        style={{
          left: '-304px',
          top: '-436px',
          width: '1024px',
          height: '1845.999px',
          animationDuration: '16s',
        }}
      >
        <img
          src="/images/journey-preparation/mandala.png"
          alt="Mandala background"
          className="w-full h-full object-cover opacity-5"
          loading="lazy"
        />
      </div>

      {/* Secondary mandala - right layer, mirrored (scaleX -1) */}
      <div
        className="absolute animate-mandala-breathe"
        style={{
          left: '720px',
          top: '-436px',
          width: '1024px',
          height: '1845.999px',
          transform: 'scaleX(-1)',
          animationDuration: '20s',
        }}
      >
        <img
          src="/images/journey-preparation/mandala.png"
          alt="Mandala depth layer"
          className="w-full h-full object-cover opacity-5"
          loading="lazy"
        />
      </div>

      {/* Mini mandala - centered bottom, with specific border radius */}
      <div
        className="absolute overflow-hidden animate-mandala-breathe"
        style={{
          left: '627px',
          top: '435px',
          width: '94.637px',
          height: '184.389px',
          borderRadius: '506px 457px 0 0 / 506px 457px 0 0',
          animationDuration: '12s',
        }}
      >
        <img
          src="/images/journey-preparation/mandala.png"
          alt="Mandala mini"
          className="absolute object-cover opacity-5"
          style={{
            width: '393.25%',
            height: '363.83%',
            left: '-293.56%',
            top: '-138.08%',
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
