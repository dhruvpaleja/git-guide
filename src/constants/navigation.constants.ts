/**
 * Navigation Constants
 */

import type { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '#home',
  },
  {
    label: 'About Our Team',
    href: '#about',
  },
  {
    label: 'Blog',
    href: '#blog',
  },
  {
    label: 'Business',
    href: '#business',
  },
];

export const FOOTER_LINKS = {
  COMPANY: [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  RESOURCES: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Help Center', href: '/help' },
    { label: 'API', href: '/api' },
    { label: 'Guides', href: '/guides' },
  ],
  LEGAL: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  SOCIAL: [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
};
