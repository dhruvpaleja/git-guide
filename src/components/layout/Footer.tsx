import { useState } from 'react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Careers', href: '/careers', isRoute: true },
  { label: 'Blog', href: '/blogs', isRoute: true },
  { label: 'B2B', href: '#b2b' },
  { label: 'Terms & Conditions', href: '#terms' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Contact', href: '/contact', isRoute: true },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-black">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10">
        {/* Top row */}
        <div className="flex justify-between items-start mb-6">
          <img
            src="/images/soul-yatri-logo-footer.png"
            alt="Soul Yatri"
            className="h-[28px] w-auto object-contain"
          />
          <div className="flex flex-col items-end gap-1.5">
            {footerLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[12px] text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-white/40 leading-[2] max-w-[500px] mb-6">
          Soul Yatri blends modern psychology with cultural wisdom to offer compassionate,
          science-backed and culturally-sensitive mental well-being. We help you understand
          what's happening inside and give you practical steps.
        </p>

        {/* Email + CTA */}
        <div className="flex gap-3 mb-10">
          <div className="flex items-center h-[42px] rounded-full border border-white/15 bg-[#080808] px-5 w-[260px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full bg-transparent text-[12px] text-white/40 placeholder-white/30 focus:outline-none"
            />
          </div>
          <button className="h-[42px] px-6 bg-white rounded-full text-[12px] font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105">
            Book A Therapist
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-white/8 pt-5">
          <p className="text-[11px] text-white/40">
            © 2025 Soul Yatri Pvt. Ltd. | All Rights Reserved
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/60 mr-1">Follow Our Journey:</span>
            <a href="https://instagram.com/soulyatri" target="_blank" rel="noopener noreferrer">
              <img src="/images/insta-link.png" alt="Instagram" className="w-[16px] h-[16px] opacity-60 hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://facebook.com/soulyatri" target="_blank" rel="noopener noreferrer">
              <img src="/images/facebook-link.png" alt="Facebook" className="w-[16px] h-[16px] opacity-60 hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://linkedin.com/company/soulyatri" target="_blank" rel="noopener noreferrer">
              <img src="/images/linkedin-link.png" alt="LinkedIn" className="w-[16px] h-[16px] opacity-60 hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://twitter.com/soulyatri" target="_blank" rel="noopener noreferrer">
              <img src="/images/twitter-link.png" alt="Twitter" className="w-[16px] h-[16px] opacity-60 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
