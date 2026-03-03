/**
 * Responsive Design Hooks
 * Utilities for responsive behavior in React components
 */

import { useEffect, useState, useCallback } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook to track window size and provide responsive state
 * Usage:
 *   const { width, isMobile, isTablet, isDesktop } = useWindowSize();
 *   if (isMobile) return <MobileComponent />;
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width < 640,     // < sm
        isTablet: width >= 640 && width < 1024,  // sm to lg
        isDesktop: width >= 1024,  // >= lg
      });
    }

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to check if a specific breakpoint is reached
 * Usage:
 *   const isSmall = useMediaQuery('(max-width: 640px)');
 *   const isLarge = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      // Use setTimeout to avoid setting state directly in effect
      setTimeout(() => {
        setMatches(media.matches);
      }, 0);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Hook to get current breakpoint name
 * Usage:
 *   const breakpoint = useBreakpoint();
 *   // Returns: 'mobile' | 'tablet' | 'desktop'
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    }

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to detect if device is touch-enabled
 * Usage:
 *   const isTouchDevice = useTouchDevice();
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch, { passive: true });
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return isTouchDevice;
}

/**
 * Hook to detect device orientation
 * Usage:
 *   const { orientation, isPortrait, isLandscape } = useOrientation();
 */
export function useOrientation(): {
  orientation: 'portrait' | 'landscape';
  isPortrait: boolean;
  isLandscape: boolean;
} {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    function handleOrientationChange() {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    }

    window.addEventListener('resize', handleOrientationChange, { passive: true });
    handleOrientationChange();

    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
}

/**
 * Hook to get safe area insets for notched devices
 * Usage:
 *   const safeArea = useSafeArea();
 *   // { top: 0, right: 0, bottom: 0, left: 0 }
 */
export function useSafeArea(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    function updateSafeArea() {
      const style = getComputedStyle(document.documentElement);
      const top = parseInt(style.getPropertyValue('--safe-area-inset-top') || '0');
      const right = parseInt(style.getPropertyValue('--safe-area-inset-right') || '0');
      const bottom = parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0');
      const left = parseInt(style.getPropertyValue('--safe-area-inset-left') || '0');

      setSafeArea({ top, right, bottom, left });
    }

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea, { passive: true });
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}

/**
 * Hook to debounce callback on window resize
 * Usage:
 *   useResponsiveCallback(() => {
 *     console.log('Window resized');
 *   }, 300);
 */
export function useResponsiveCallback(callback: () => void, delay: number = 300) {
  const timeoutRef = useCallback(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [callback, delay]);

  useEffect(timeoutRef, [timeoutRef]);
}

/**
 * Hook to check if element is in viewport
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const isInViewport = useInViewport(ref);
 */
export function useInViewport(ref: React.RefObject<HTMLElement>): boolean {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInViewport;
}
