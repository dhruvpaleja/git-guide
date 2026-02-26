import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Soul Yatri', href: '#about' },
  { label: 'Business', href: '#business' },
  { label: 'Blogs', href: '#blog' },
  { label: 'Login', href: '#login' },
  { label: 'Signup', href: '#signup' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
    >
      {/* Logo - Figma: 60x50 at top:60 */}
      <div className="flex justify-center pt-[20px]">
        <a href="#home">
          <img
            src="/images/main-logo.png"
            alt="Soul Yatri"
            className="w-[60px] h-[50px] object-contain"
          />
        </a>
      </div>

      {/* Nav - Figma: 676px wide, h-60, top:160, text-14px */}
      <div className="flex justify-center pt-[30px] pb-[15px]">
        <nav className="hidden md:flex items-center gap-0 h-[60px] rounded-[25px]" style={{ width: '676px' }}>
          {navItems.map((item) => {
            const isActive =
              (item.label === 'Home' && activeSection === 'home') ||
              item.href === `#${activeSection}`;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-center h-full text-[14px] tracking-[-0.14px] transition-all duration-300 whitespace-nowrap ${isActive
                    ? 'text-white font-semibold'
                    : 'text-white/50 font-normal hover:text-white/70'
                  }`}
                style={{ flex: 1 }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-4 py-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
