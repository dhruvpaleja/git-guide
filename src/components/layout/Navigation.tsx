import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'About Soul Yatri', path: '/about' },
  { label: 'Business', path: '/business' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact', path: '/contact' },
  { label: 'Login', path: '/login' },
  { label: 'Signup', path: '/signup' },
];

const LIGHT_THEME_ROUTE_SEGMENTS = ['/about', '/business', '/blog', '/contact', '/careers', '/courses'];

function resolveThemeFromPathname(pathname: string): 'light' | 'dark' {
  return LIGHT_THEME_ROUTE_SEGMENTS.some((segment) => pathname.includes(segment)) ? 'light' : 'dark';
}

export default function Navigation() {
  // Use lazy initializer to avoid calling setState in effect
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY > 30;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolledRef = useRef(isScrolled);
  const themeRef = useRef(theme);
  const rafIdRef = useRef<number | null>(null);

  const updateHeaderState = useCallback(() => {
    const nextIsScrolled = window.scrollY > 30;
    if (nextIsScrolled !== isScrolledRef.current) {
      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    }

    const elements = document.querySelectorAll('.bg-white, .bg-black, [data-theme]');
    let foundTheme: 'light' | 'dark' | null = null;
    const headerHitLine = 50;

    for (let i = elements.length - 1; i >= 0; i--) {
      const rect = elements[i].getBoundingClientRect();
      if (rect.top <= headerHitLine && rect.bottom >= headerHitLine) {
        if (elements[i].classList.contains('bg-white') || elements[i].getAttribute('data-theme') === 'light') {
          foundTheme = 'light';
          break;
        }
        if (elements[i].classList.contains('bg-black') || elements[i].getAttribute('data-theme') === 'dark') {
          foundTheme = 'dark';
          break;
        }
      }
    }

    if (!foundTheme) {
      foundTheme = resolveThemeFromPathname(location.pathname);
    }

    if (foundTheme !== themeRef.current) {
      themeRef.current = foundTheme;
      setTheme(foundTheme);
    }
  }, [location.pathname]);

  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      return;
    }

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      updateHeaderState();
    });
  }, [updateHeaderState]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleScroll]);

  // Update navbar theme when navigating to a new page
  // Use setTimeout to avoid setState-in-effect warning
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateHeaderState();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, updateHeaderState]);

  // Handle Logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/home') {
      navigate('/home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLight = theme === 'light';

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-[800px] ${isScrolled ? 'top-2' : 'top-6'
        }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      <div className={`rounded-full px-6 py-3 flex items-center justify-between shadow-2xl transition-all duration-500 backdrop-blur-md border border-white/10 ${isLight ? 'bg-black/80' : 'bg-white/10'
        }`}>
        {/* Logo */}
        <a
          href="/home"
          onClick={handleLogoClick}
          className="shrink-0 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/images/main-logo.png"
            alt="Soul Yatri"
            className="w-[45px] h-[38px] object-contain"
          />
        </a>

        {/* Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center justify-center gap-1 flex-1 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) || (item.path === '/home' && location.pathname === '/');

            // Constant text styling, only depends on active state
            const textStyle = isActive
              ? 'text-white font-semibold bg-white/10'
              : 'text-white/70 font-normal hover:text-white hover:bg-white/5';

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 py-2 rounded-full text-[13px] tracking-[-0.14px] transition-all duration-300 whitespace-nowrap ${textStyle}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2">
          <nav id="mobile-nav-menu" aria-label="Mobile navigation" className={`rounded-2xl border border-white/10 p-2 flex flex-col gap-1 shadow-2xl backdrop-blur-md transition-colors duration-500 ${isLight ? 'bg-black/90' : 'bg-black/40'
            }`}>
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path) || (item.path === '/home' && location.pathname === '/');

              const mobileTextStyle = isActive
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/5';

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm transition-colors ${mobileTextStyle}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
