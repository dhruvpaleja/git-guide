import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'About Soul Yatri', path: '/about' },
  { label: 'Business', path: '/business' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Login', path: '/login' },
  { label: 'Signup', path: '/signup' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 30);

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
      foundTheme = (location.pathname.includes('/about') || location.pathname.includes('/business')) ? 'light' : 'dark';
    }

    setTheme(foundTheme);
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
        <nav className="hidden md:flex items-center justify-center gap-1 flex-1 px-4">
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2">
          <nav className={`rounded-2xl border border-white/10 p-2 flex flex-col gap-1 shadow-2xl backdrop-blur-md transition-colors duration-500 ${isLight ? 'bg-black/90' : 'bg-black/40'
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
