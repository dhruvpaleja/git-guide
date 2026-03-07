import { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high';
  priority?: boolean;
}

/**
 * Optimized image component that adapts to network quality
 * - Low network: Shows placeholder or blurred low-res version
 * - Medium network: Loads compressed version
 * - High network: Loads full quality
 * - Offline: Shows placeholder only
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%231a1a24"/%3E%3C/svg%3E',
  quality,
  priority = false,
}: OptimizedImageProps) {
  const { isSlow, isOnline } = useNetworkStatus();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine quality based on network if not specified
  const effectiveQuality = quality || (isSlow ? 'low' : 'high');

  // Generate optimized URL (works with most CDNs)
  const getOptimizedSrc = () => {
    if (!src) return placeholder;
    
    // Add quality parameters for common CDNs
    if (src.includes('cloudinary.com')) {
      return src.replace('/upload/', `/upload/q_${effectiveQuality === 'low' ? 'auto:low' : effectiveQuality === 'medium' ? 'auto:good' : 'auto:best'}/`);
    }
    if (src.includes('imgix.net')) {
      return `${src}${src.includes('?') ? '&' : '?'}q=${effectiveQuality === 'low' ? '30' : effectiveQuality === 'medium' ? '60' : '90'}`;
    }
    if (src.includes('images.unsplash.com')) {
      return `${src}${src.includes('?') ? '&' : '?'}q=${effectiveQuality === 'low' ? '40' : effectiveQuality === 'medium' ? '70' : '90'}`;
    }
    
    return src;
  };

  const optimizedSrc = getOptimizedSrc();

  useEffect(() => {
    if (priority || !isSlow) {
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [optimizedSrc, priority, isSlow]);

  // Show placeholder on slow networks or while loading
  const showPlaceholder = !loaded || !isOnline || effectiveQuality === 'low';

  if (error) {
    return (
      <div className={`bg-[#1a1a24] flex items-center justify-center ${className}`}>
        <span className="text-white/20 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {showPlaceholder && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      {!showPlaceholder && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      
      {/* Loading indicator for slow networks */}
      {isSlow && !loaded && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
          <span className="text-[10px] text-white/60">Loading...</span>
        </div>
      )}
    </div>
  );
}

/**
 * Lazy image component - only loads when network is good
 */
export function LazyImage(props: OptimizedImageProps) {
  const shouldLoad = useConditionalLoad();
  
  if (!shouldLoad) {
    return (
      <div className={`${props.className} bg-[#1a1a24]`} title="Image hidden to save data">
        <div className="flex items-center justify-center h-full">
          <span className="text-white/20 text-xs">📷 Tap to load</span>
        </div>
      </div>
    );
  }
  
  return <OptimizedImage {...props} />;
}

// Helper hook
function useConditionalLoad() {
  const { status } = useNetworkStatus();
  return status === '4g' || status === 'online';
}
