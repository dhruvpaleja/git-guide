import { useState } from 'react';
import { Send } from 'lucide-react';

const footerLinks = {
  overview: [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
  company: [
    { label: 'Careers', href: '#careers' },
    { label: 'Press', href: '#press' },
    { label: 'Partners', href: '#partners' },
    { label: 'Contact', href: '#contact' },
  ],
  resources: [
    { label: 'Blog', href: '#blog' },
    { label: 'Guides', href: '#guides' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Support', href: '#support' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <a href="#" className="flex items-center gap-2 mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4C16 4 10 12 10 18C10 22 12 26 16 28C20 26 22 22 22 18C22 12 16 4 16 4Z"
                  fill="url(#flameGradientFooter)"
                />
                <path
                  d="M16 12C16 12 13 16 13 19C13 21 14 23 16 24C18 23 19 21 19 19C19 16 16 12 16 12Z"
                  fill="#FEF3C7"
                />
                <defs>
                  <linearGradient id="flameGradientFooter" x1="10" y1="4" x2="22" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B" />
                    <stop offset="0.5" stopColor="#EF4444" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-semibold text-white">Soul Yatri</span>
            </a>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">
              Your journey to wellness starts here. Nurture your mind, body, and soul with our comprehensive wellness platform.
            </p>
            
            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Subscribe to our newsletter</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-white text-black rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Overview */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Overview</h4>
                <ul className="space-y-3">
                  {footerLinks.overview.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            &copy; 2025 Soul Yatri. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
