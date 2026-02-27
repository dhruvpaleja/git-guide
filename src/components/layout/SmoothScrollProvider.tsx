import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Disable lenis completely on mobile for native scroll performance
    if (isMobile) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
