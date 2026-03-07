import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component with blur-up placeholder
 * 
 * Features:
 * - Loads image only when visible in viewport
 * - Shows blur-up placeholder while loading
 * - Supports custom aspect ratio
 * - Handles load errors gracefully
 * 
 * Usage:
 * ```tsx
 * <LazyImage
 *   src={therapist.photoUrl}
 *   alt={therapist.name}
 *   className="w-12 h-12 rounded-full"
 *   width={48}
 *   height={48}
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 animate-pulse ${placeholderClassName}`}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02]">
          <span className="text-[10px] font-bold text-white/20">
            {alt.charAt(0)}
          </span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

/**
 * Lazy image for therapist photos (pre-configured)
 */
export function TherapistPhoto({
  photoUrl,
  name,
  className = 'w-12 h-12 rounded-full',
}: {
  photoUrl: string | null;
  name: string;
  className?: string;
}) {
  if (!photoUrl) {
    return (
      <div className={`${className} bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center border border-amber-500/20`}>
        <span className="text-[12px] font-bold text-amber-400/60">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <LazyImage
      src={photoUrl}
      alt={name}
      className={className}
      placeholderClassName="rounded-full"
    />
  );
}
