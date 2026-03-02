import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Network,
  Mic,
  User,
  Settings,
  Compass,
  Smile,
  BookOpen,
  Brain,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navSections = [
  {
    label: 'Main',
    items: [
      { icon: Home, label: 'Soul Sync', href: '/dashboard' },
      { icon: Network, label: 'The Constellation', href: '/dashboard/constellation' },
      { icon: Compass, label: 'Connections', href: '/dashboard/connections' },
    ],
  },
  {
    label: 'Wellness',
    items: [
      { icon: Smile, label: 'Mood Tracker', href: '/dashboard/mood' },
      { icon: BookOpen, label: 'Journal', href: '/dashboard/journal' },
      { icon: Brain, label: 'Meditation', href: '/dashboard/meditation' },
      { icon: Mic, label: 'Confessional', href: '/dashboard/confessional' },
    ],
  },
];

const bottomItems = [
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

interface DashboardSidebarProps {
  forceExpanded?: boolean;
  onNavigate?: () => void;
}

export default function DashboardSidebar({ forceExpanded, onNavigate }: DashboardSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cn(
        'fixed left-0 lg:left-4 top-0 lg:top-4 bottom-0 lg:bottom-4 bg-[#0c0c0c] border-r lg:border border-[#1a1a1a] lg:rounded-[24px] flex flex-col items-center py-8 z-50 transition-all duration-300 overflow-hidden',
        forceExpanded
          ? 'w-[240px]'
          : 'w-[60px] hover:w-[200px] group',
      )}
    >
      {/* Brand */}
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex-shrink-0 mb-6 flex items-center justify-center w-full px-4"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-500 flex-shrink-0" />
        <span
          className={cn(
            'ml-3 font-bold text-white whitespace-nowrap tracking-tight text-[15px] transition-opacity duration-300',
            forceExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          Soul Yatri
        </span>
      </Link>

      {/* Nav Sections */}
      <nav className="flex-1 w-full flex flex-col gap-1 px-2 overflow-y-auto hide-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={section.label}>
            {/* Section label — only visible when expanded */}
            <div
              className={cn(
                'px-3 pt-5 pb-2 transition-opacity duration-300',
                forceExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              <span className="text-[11px] uppercase tracking-wider text-white/25 font-semibold">
                {section.label}
              </span>
            </div>

            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'relative flex items-center w-full px-3 py-2.5 rounded-2xl transition-all duration-200 mb-0.5',
                    active
                      ? 'text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/5',
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white/[0.08] rounded-2xl -z-10 border border-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className="w-[18px] h-[18px] flex-shrink-0 ml-0.5"
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      'ml-3 text-[13px] font-medium whitespace-nowrap transition-opacity duration-300',
                      forceExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                    )}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3.5 bg-accent rounded-r-full" />
                  )}
                </Link>
              );
            })}

            {/* Divider between sections */}
            {sIdx < navSections.length - 1 && (
              <div className="mx-3 my-1 h-px bg-white/[0.04]" />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="mt-auto w-full flex flex-col gap-1 px-2 border-t border-white/[0.06] pt-3">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center w-full p-2.5 rounded-2xl transition-all duration-200',
                active
                  ? 'text-white bg-white/[0.06]'
                  : 'text-white/35 hover:text-white/70 hover:bg-white/5',
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0 ml-0.5" strokeWidth={2} />
              <span
                className={cn(
                  'ml-3 text-[13px] font-medium whitespace-nowrap transition-opacity duration-300',
                  forceExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                )}
              >
                {item.label}
              </span>
              {item.icon === Bell && (
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full bg-accent ml-auto flex-shrink-0 animate-pulse transition-opacity duration-300',
                    forceExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
