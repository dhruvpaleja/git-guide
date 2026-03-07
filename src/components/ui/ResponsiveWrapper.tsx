import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface ResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
}

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '4k';

/**
 * Responsive Wrapper Component
 * Automatically adapts layout based on screen size
 */
export function ResponsiveWrapper({ children, className = '' }: ResponsiveWrapperProps) {
  const [screenSize, setScreenSize] = useState<ScreenSize>('lg');
  const [isTouch, setIsTouch] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Detect screen size
    const updateScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < 475) setScreenSize('xs');
      else if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else if (width < 1280) setScreenSize('xl');
      else if (width < 1536) setScreenSize('2xl');
      else if (width < 1920) setScreenSize('3xl');
      else if (width < 2560) setScreenSize('4xl');
      else if (width < 3440) setScreenSize('5xl');
      else setScreenSize('4k');
    };

    // Detect touch capability
    const detectTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Detect reduced motion preference
    const detectReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    };

    // Detect high contrast preference
    const detectHighContrast = () => {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    };

    // Initialize
    updateScreenSize();
    detectTouch();
    const cleanupMotion = detectReducedMotion();
    const cleanupContrast = detectHighContrast();

    // Listen for resize
    window.addEventListener('resize', updateScreenSize);
    
    return () => {
      window.removeEventListener('resize', updateScreenSize);
      cleanupMotion?.();
      cleanupContrast?.();
    };
  }, []);

  // Generate responsive classes
  const getResponsiveClasses = () => {
    const classes: string[] = [];
    
    // Container max-width based on screen size
    if (screenSize === '4k' || screenSize === '5xl') {
      classes.push('max-w-[2560px] mx-auto');
    } else if (screenSize === '4xl' || screenSize === '3xl') {
      classes.push('max-w-[1920px] mx-auto');
    }
    
    // Touch optimizations
    if (isTouch) {
      classes.push('touch-manipulation');
    }
    
    // Reduced motion
    if (isReducedMotion) {
      classes.push('motion-reduce:transition-none');
    }
    
    // High contrast
    if (isHighContrast) {
      classes.push('border-2');
    }
    
    return classes.join(' ');
  };

  return (
    <div 
      className={`${className} ${getResponsiveClasses()}`}
      data-screen-size={screenSize}
      data-is-touch={isTouch}
      data-reduced-motion={isReducedMotion}
      data-high-contrast={isHighContrast}
    >
      {children}
    </div>
  );
}

/**
 * Hook to get current responsive state
 */
export function useResponsive() {
  const [state, setState] = useState({
    screenSize: 'lg' as ScreenSize,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    isUltrawide: false,
  });

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      let screenSize: ScreenSize = 'lg';
      
      if (width < 475) screenSize = 'xs';
      else if (width < 640) screenSize = 'sm';
      else if (width < 768) screenSize = 'md';
      else if (width < 1024) screenSize = 'lg';
      else if (width < 1280) screenSize = 'xl';
      else if (width < 1536) screenSize = '2xl';
      else if (width < 1920) screenSize = '3xl';
      else if (width < 2560) screenSize = '4xl';
      else if (width < 3440) screenSize = '5xl';
      else screenSize = '4k';

      setState({
        screenSize,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isUltrawide: width >= 3440,
      });
    };

    updateState();
    window.addEventListener('resize', updateState);
    return () => window.removeEventListener('resize', updateState);
  }, []);

  return state;
}

/**
 * Component that renders different content based on screen size
 */
export function ResponsiveContent({
  mobile,
  tablet,
  desktop,
  children,
}: {
  mobile?: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
  children?: ReactNode;
}) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (isDesktop && desktop) return <>{desktop}</>;
  
  return <>{children}</>;
}
