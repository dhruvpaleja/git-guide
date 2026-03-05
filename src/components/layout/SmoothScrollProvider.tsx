import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mql.matches);
        const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mql.addEventListener('change', handleMotionChange);

        return () => {
            window.removeEventListener('resize', checkMobile);
            mql.removeEventListener('change', handleMotionChange);
        };
    }, []);

    // Disable lenis on mobile or when user prefers reduced motion
    if (isMobile || prefersReducedMotion) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
