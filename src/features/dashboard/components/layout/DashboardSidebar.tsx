import { Link, useLocation } from 'react-router-dom';
import { Home, Network, Mic, User, Settings, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Soul Sync', href: '/dashboard' },
  { icon: Network, label: 'The Constellation', href: '/dashboard/constellation' },
  { icon: Mic, label: 'The Confessional', href: '/dashboard/confessional' },
  { icon: Compass, label: 'Human Connections', href: '/dashboard/connections' },
];

const bottomItems = [
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-[60px] bg-[#0c0c0c] border border-[#2b2b2b] rounded-[30px] flex flex-col items-center py-6 z-50 transition-all duration-300 hover:w-[200px] group overflow-hidden shadow-2xl">
      {/* Brand/Logo Area */}
      <div className="flex-shrink-0 mb-8 flex items-center justify-center w-full px-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-500 animate-pulse-glow" />
        <span className="ml-3 font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-tight">Soul Yatri</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 w-full flex flex-col gap-4 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
          return (
             <Link
              key={item.label}
              to={item.href}
              className={cn(
                "relative flex items-center justify-start w-full p-2.5 rounded-2xl group/item transition-all duration-300",
                isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill" 
                  className="absolute inset-0 bg-white/10 rounded-2xl -z-10 border border-white/10" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span className="ml-3 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto w-full flex flex-col gap-2 px-2">
        {bottomItems.map((item) => (
           <Link
            key={item.label}
            to={item.href}
            className="flex items-center justify-start w-full p-2.5 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span className="ml-3 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
