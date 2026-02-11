import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Our Team', href: '#about' },
  { label: 'Blog', href: '#blog' },
  { label: 'Business', href: '#business' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-black/95 backdrop-blur-xl border-b border-white/10' 
          : 'py-4 bg-black/50 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              {/* Flame Icon */}
              <path
                d="M16 4C16 4 10 12 10 18C10 22 12 26 16 28C20 26 22 22 22 18C22 12 16 4 16 4Z"
                fill="url(#flameGradient)"
              />
              <path
                d="M16 12C16 12 13 16 13 19C13 21 14 23 16 24C18 23 19 21 19 19C19 16 16 12 16 12Z"
                fill="#FEF3C7"
              />
              <defs>
                <linearGradient id="flameGradient" x1="10" y1="4" x2="22" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F59E0B" />
                  <stop offset="0.5" stopColor="#EF4444" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-lg font-semibold text-white">Soul Yatri</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#login"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="#create-account"
              className="px-6 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-100 transition-all duration-200 hover:scale-105 shadow-lg shadow-white/20"
            >
              Create Account
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 glass rounded-2xl p-4 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-white/10 my-2 pt-2">
                <a
                  href="#login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 block"
                >
                  Login
                </a>
                <a
                  href="#create-account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mx-4 mt-2 px-5 py-2 bg-white text-black text-sm font-semibold rounded-full text-center block"
                >
                  Create Account
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
