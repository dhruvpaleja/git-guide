import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Home', href: '#home', isRoute: false },
  { label: 'About Soul Yatri', href: '#about', isRoute: false },
  { label: 'Business', href: '#business', isRoute: false },
  { label: 'Blogs', href: '/blogs', isRoute: true },
  { label: 'Contact', href: '/contact', isRoute: true },
  { label: 'Login', href: '/login', isRoute: true },
  { label: 'Signup', href: '/signup', isRoute: true },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 30);
    const sections = document.querySelectorAll('section[id]');
    let current = 'home';
    sections.forEach((section) => {
      const el = section as HTMLElement;
      if (window.scrollY >= el.offsetTop - 150) {
        current = el.getAttribute('id') || 'home';
      }
    });
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-[800px] ${isScrolled ? 'top-2' : 'top-6'
        }`}
    >
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl border border-white/10">
        {/* Logo */}
        <a href="#home" className="shrink-0 transition-transform duration-300 hover:scale-105">
          <img
            src="/images/main-logo.png"
            alt="Soul Yatri"
            className="w-[45px] h-[38px] object-contain"
          />
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center justify-center gap-1 flex-1 px-4">
          {navItems.map((item) => {
            const isActive =
              (item.label === 'Home' && activeSection === 'home') ||
              item.href === `#${activeSection}`;
            if (item.isRoute) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 rounded-full text-[13px] tracking-[-0.14px] transition-all duration-300 whitespace-nowrap text-white/60 font-normal hover:text-white hover:bg-white/5"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-[13px] tracking-[-0.14px] transition-all duration-300 whitespace-nowrap ${isActive
                  ? 'text-white font-semibold bg-white/10'
                  : 'text-white/60 font-normal hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2">
          <nav className="glass-dark rounded-2xl border border-white/10 p-2 flex flex-col gap-1 shadow-2xl">
            {navItems.map((item) => {
              const isActive =
                (item.label === 'Home' && activeSection === 'home') ||
                item.href === `#${activeSection}`;
              if (item.isRoute) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm transition-colors text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
