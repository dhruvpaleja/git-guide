import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const exploreLinks = [
  { label: 'Overview', href: '/home', isRoute: true },
  { label: 'Careers', href: '/careers', isRoute: true },
  { label: 'Blog', href: '/blogs', isRoute: true },
  { label: 'B2B', href: '/business', isRoute: true },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '#terms' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Contact', href: '/contact', isRoute: true },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/soulyatri',
    icon: Instagram,
    hoverClass: 'group-hover:text-[#E4405F] group-hover:border-[#E4405F]/35',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/soulyatri',
    icon: Facebook,
    hoverClass: 'group-hover:text-[#1877F2] group-hover:border-[#1877F2]/35',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/soulyatri',
    icon: Linkedin,
    hoverClass: 'group-hover:text-[#0A66C2] group-hover:border-[#0A66C2]/35',
  },
  {
    label: 'X / Twitter',
    href: 'https://twitter.com/soulyatri',
    icon: Twitter,
    hoverClass: 'group-hover:text-white group-hover:border-white/35',
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const columnAnimation = (delayMs: number) =>
    isVisible
      ? {
          animation: `footer-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          animationDelay: `${delayMs}ms`,
        }
      : undefined;

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#0a0a0a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_100%,rgba(224,123,57,0.2),rgba(10,10,10,0.96)_70%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.22)_0.35px,transparent_0.35px)] [background-size:3px_3px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-14 lg:px-12 lg:pt-16">
        <div className="grid items-start gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col self-start opacity-0" style={columnAnimation(0)}>
            <div className="mb-4 flex h-10 items-center gap-3">
              <span className="footer-lotus-glow inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E07B39]/35 bg-[#E07B39]/12">
                <img src="/images/main-logo.png" alt="Soul Yatri Lotus" className="h-6 w-6 object-contain" />
              </span>
              <span
                className="text-[28px] leading-none tracking-[0.01em] text-white"
                style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' }}
              >
                Soul Yatri
              </span>
            </div>
            <p
              className="mb-6 max-w-[320px] text-sm leading-6 text-white/70"
              style={{ fontFamily: '"DM Sans", "Lato", Inter, sans-serif' }}
            >
              Blending modern psychology with cultural wisdom.
            </p>

            <div className="mb-3">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="h-11 w-full rounded-full border border-[#E07B39]/20 bg-[#1a1a1a] px-5 text-sm text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:border-[#E07B39]/70 focus:shadow-[0_0_0_3px_rgba(224,123,57,0.12)]"
              />
            </div>

            <button className="h-11 rounded-full bg-[#E07B39] px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#eb8a4f] hover:shadow-[0_0_20px_rgba(224,123,57,0.4)]">
              Book A Therapist
            </button>
          </div>

          <div className="flex flex-col self-start opacity-0" style={columnAnimation(110)}>
            <h3 className="mb-4 flex h-10 items-center text-sm font-semibold tracking-[0.02em] text-white">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="inline-block border-b border-transparent pb-0.5 text-sm text-[#aaaaaa] transition-all duration-250 hover:border-[#E07B39]/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="inline-block border-b border-transparent pb-0.5 text-sm text-[#aaaaaa] transition-all duration-250 hover:border-[#E07B39]/70 hover:text-white"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col self-start opacity-0" style={columnAnimation(220)}>
            <h3 className="mb-4 flex h-10 items-center text-sm font-semibold tracking-[0.02em] text-white">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="inline-block border-b border-transparent pb-0.5 text-sm text-[#aaaaaa] transition-all duration-250 hover:border-[#E07B39]/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="inline-block border-b border-transparent pb-0.5 text-sm text-[#aaaaaa] transition-all duration-250 hover:border-[#E07B39]/70 hover:text-white"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col self-start opacity-0" style={columnAnimation(330)}>
            <h3 className="mb-4 flex h-10 items-center text-sm font-semibold tracking-[0.02em] text-white">Follow Our Journey</h3>
            <ul className="space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-sm text-[#aaaaaa] transition-colors duration-250 hover:text-white"
                    >
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/75 transition-all duration-250 ${social.hoverClass}`}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="border-b border-transparent pb-0.5 transition-all duration-250 group-hover:border-[#E07B39]/70">
                        {social.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[#E07B39]/20" />

        <div className="mt-0 bg-[#111111] px-3 py-4">
          <p className="text-center text-xs text-white/55">© 2025 Soul Yatri Pvt. Ltd. | All Rights Reserved</p>
        </div>
      </div>

      <style>{`
        @keyframes footer-fade-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes footer-lotus-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(224, 123, 57, 0);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 22px rgba(224, 123, 57, 0.28);
            transform: scale(1.03);
          }
        }

        .footer-lotus-glow {
          animation: footer-lotus-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}

