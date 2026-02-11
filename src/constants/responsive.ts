/**
 * Responsive Design Constants and Utilities
 * Mobile-first approach for Soul Yatri
 */

/**
 * Tailwind Breakpoints (in px)
 */
export const BREAKPOINTS = {
  sm: 640,   // Small devices
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices
  xl: 1280,  // Extra large devices
  '2xl': 1536, // 2X Large devices
} as const;

/**
 * Responsive Typography Scale
 * Use: className={`text-${responsiveText.heading1.mobile} sm:text-${responsiveText.heading1.tablet} md:text-${responsiveText.heading1.desktop}`}
 */
export const RESPONSIVE_TEXT = {
  heading1: {
    mobile: '2xl',      // text-2xl => 24px
    tablet: 'text-3xl', // 30px
    desktop: 'text-5xl', // 48px
  },
  heading2: {
    mobile: 'text-lg',  // 18px
    tablet: 'text-2xl', // 24px
    desktop: 'text-4xl', // 36px
  },
  heading3: {
    mobile: 'text-base',  // 16px
    tablet: 'text-lg',    // 18px
    desktop: 'text-2xl',  // 24px
  },
  body: {
    mobile: 'text-sm',
    tablet: 'text-base',
    desktop: 'text-base',
  },
  small: {
    mobile: 'text-xs',
    tablet: 'text-sm',
    desktop: 'text-sm',
  },
} as const;

/**
 * Responsive Spacing Scale
 * Mobile: 16 sm:20 md:24 lg:32
 */
export const RESPONSIVE_SPACING = {
  section: {
    mobile: 'py-12 px-4',
    tablet: 'sm:py-16 sm:px-6',
    desktop: 'md:py-24 lg:px-8',
  },
  containerX: {
    mobile: 'px-4',
    tablet: 'sm:px-6',
    desktop: 'lg:px-8',
  },
  containerY: {
    mobile: 'py-8',
    tablet: 'sm:py-12',
    desktop: 'md:py-16',
  },
  gap: {
    mobile: 'gap-4',
    tablet: 'sm:gap-6 md:gap-8',
    desktop: 'lg:gap-12',
  },
} as const;

/**
 * Responsive Grid Layouts
 */
export const RESPONSIVE_GRID = {
  twoCol: 'grid-cols-1 md:grid-cols-2',
  threeCol: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  fourCol: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  autoFit: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
} as const;

/**
 * Common Responsive Classes
 */
export const RESPONSIVE_CLASSES = {
  // Hide on mobile, show on tablet+
  hideOnMobile: 'hidden sm:block',
  // Hide on sm, show on md+
  hideOnSmall: 'hidden md:block',
  // Show on mobile, hide on tablet+
  showOnMobile: 'sm:hidden',
  // Show on sm only
  showOnSmallOnly: 'sm:block md:hidden',
  // Hide on desktop, show on mobile/tablet
  hideOnDesktop: 'lg:hidden',
  // Full width on mobile, constrained on larger screens
  fullMobile: 'w-full',
  // Responsive text centering
  centerOnMobile: 'text-center sm:text-left',
  centerText: 'text-center md:text-left',
} as const;

/**
 * Touch-Friendly Button Size
 * Minimum 44px height for accessibility
 */
export const TOUCH_TARGET = {
  small: 'px-4 py-2.5 min-h-10',
  medium: 'px-6 py-3 min-h-11',
  large: 'px-8 py-3.5 min-h-12',
} as const;

/**
 * Responsive Container Max Widths
 */
export const CONTAINER_WIDTHS = {
  compact: 'max-w-2xl',
  standard: 'max-w-4xl',
  wide: 'max-w-6xl',
  full: 'max-w-7xl',
  ultraWide: 'max-w-7xl',
} as const;

/**
 * Hook to get current breakpoint
 * Usage: const breakpoint = useResponsive()
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof BREAKPOINTS>('sm');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (width < BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (width < BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    window.addEventListener('resize', updateBreakpoint);
    updateBreakpoint();

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Responsive Design Best Practices
 * 
 * 1. Mobile First: Start with mobile styles, then add breakpoints
 *    Bad:  className="text-4xl sm:text-2xl md:text-lg"
 *    Good: className="text-lg sm:text-2xl md:text-4xl"
 * 
 * 2. Use Consistent Spacing Scale
 *    Mobile:  px-4 py-8
 *    Tablet:  sm:px-6 sm:py-12
 *    Desktop: md:px-8 md:py-16
 * 
 * 3. Group Responsive Classes
 *    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
 * 
 * 4. Touch Targets (minimum 44px x 44px)
 *    <button className="px-4 py-3 min-h-11"> (44px height)
 * 
 * 5. Container Queries for Components (Future)
 *    @container (min-width: 200px) { /* card styles */ }
 * 
 * 6. Responsive Images
 *    <img srcSet="mobile.jpg 640w, tablet.jpg 1024w, desktop.jpg 1920w"
 *         sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw" />
 */

/**
 * Responsive Image Sizes
 * Use for srcSet calculation
 */
export const IMAGE_SIZES = {
  mobile: '100vw',
  tabletSmall: '90vw',
  tablet: '80vw',
  desktop: '60vw',
  containerSmall: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw',
  containerMedium: '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 70vw',
  containerLarge: '(max-width: 1024px) 100vw, (max-width: 1536px) 85vw, 65vw',
} as const;

import React from 'react';
