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
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navSections = [
  {
    label: 'Main',
    items: [
      { icon: Home, label: 'Home', href: '/dashboard' },
      { icon: Network, label: 'Constellation', href: '/dashboard/constellation' },
      { icon: Compass, label: 'Connections', href: '/dashboard/connections' },
      { icon: Calendar, label: 'Sessions', href: '/dashboard/sessions' },
    ],
  },
  {
    label: 'Wellness',
    items: [
      { icon: Smile, label: 'Mood', href: '/dashboard/mood' },
      { icon: BookOpen, label: 'Journal', href: '/dashboard/journal' },
      { icon: Brain, label: 'Meditate', href: '/dashboard/meditate' },
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
        'fixed left-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden transition-all duration-500 ease-out',
        'lg:left-3 lg:top-3 lg:bottom-3 lg:rounded-[20px]',
        'bg-[#0a0a0c]/90 backdrop-blur-xl border-r lg:border border-white/[0.05] shadow-2xl',
        forceExpanded
          ? 'w-[250px]'
          : 'w-[68px] hover:w-[210px] group',
      )}
    >
      {/* ─── Logo ─── */}
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 px-4 py-5 flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]"
      >
        <img
          src="/images/main-logo.png"
          alt="Soul Yatri"
          className="w-[34px] h-[30px] object-contain flex-shrink-0 ml-1"
        />
        <span
          className={cn(
            'font-semibold text-white/80 whitespace-nowrap tracking-tight text-[15px] transition-all duration-300',
            forceExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
          )}
        >
          Soul Yatri
        </span>
      </Link>

      {/* ─── Divider ─── */}
      <div className="mx-3 h-px bg-white/[0.05] mb-2" />

      {/* ─── Navigation ─── */}
      <nav aria-label="Dashboard navigation" className="flex-1 w-full flex flex-col gap-0.5 px-2 overflow-y-auto hide-scrollbar pt-1">
        {navSections.map((section, sIdx) => (
          <div key={section.label}>
            {/* Section label */}
            <div
              className={cn(
                'px-3 pt-4 pb-2 transition-all duration-300',
                forceExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-10 overflow-hidden',
              )}
            >
              <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 font-semibold">
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
                    'relative flex items-center w-full px-3 py-2.5 rounded-full transition-all duration-300 mb-[2px]',
                    active
                      ? 'text-white font-semibold bg-white/[0.06]'
                      : 'text-white/50 font-normal hover:text-white/80 hover:bg-white/[0.03]',
                  )}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3.5 bg-amber-500/70 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <item.icon
                    className="w-[17px] h-[17px] flex-shrink-0 ml-1"
                    strokeWidth={active ? 2.2 : 1.6}
                  />
                  <span
                    className={cn(
                      'ml-3 text-[13px] tracking-[-0.14px] whitespace-nowrap transition-all duration-300',
                      forceExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Section divider */}
            {sIdx < navSections.length - 1 && (
              <div className="mx-3 my-2 h-px bg-white/[0.04]" />
            )}
          </div>
        ))}
      </nav>

      {/* ─── Bottom Actions ─── */}
      <div className="mt-auto w-full flex flex-col gap-0.5 px-2 border-t border-white/[0.04] pt-3 pb-4">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center w-full px-3 py-2.5 rounded-full transition-all duration-300',
                active
                  ? 'text-white font-semibold bg-white/[0.06]'
                  : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]',
              )}
            >
              <item.icon className="w-[17px] h-[17px] flex-shrink-0 ml-1" strokeWidth={active ? 2.2 : 1.6} />
              <span
                className={cn(
                  'ml-3 text-[13px] tracking-[-0.14px] whitespace-nowrap transition-all duration-300',
                  forceExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                )}
              >
                {item.label}
              </span>
              {item.icon === Bell && (
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full bg-amber-500/70 ml-auto flex-shrink-0 transition-all duration-300',
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
