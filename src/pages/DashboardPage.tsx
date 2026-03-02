import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BookOpen, Smile, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SoulConstellationMap from '@/features/dashboard/components/widgets/SoulConstellationMap';
import TheConfessional from '@/features/dashboard/components/widgets/TheConfessional';
import HumanMatchCard from '@/features/dashboard/components/widgets/HumanMatchCard';
import SoulSyncCard from '@/features/dashboard/components/widgets/SoulSyncCard';
import PatternAlerts from '@/features/dashboard/components/widgets/PatternAlerts';
import { useDashboard } from '@/hooks/useDashboard';

const statCards = [
  { key: 'sessionsCompleted', label: 'Sessions', icon: Calendar, route: '/dashboard/sessions' },
  { key: 'moodEntries', label: 'Mood Logs', icon: Smile, route: '/dashboard/mood' },
  { key: 'journalEntries', label: 'Journal Entries', icon: BookOpen, route: '/dashboard/journal' },
  { key: 'meditationSessions', label: 'Meditations', icon: Brain, route: '/dashboard/meditation' },
] as const;

export default function DashboardPage() {
  const [isConfessionalActive, setIsConfessionalActive] = useState(false);
  const { data, isLoading } = useDashboard();

  return (
    <div className="w-full h-full pb-20 relative">

      {/* Global Background Dimmer for "Safe Room" Effect */}
      <AnimatePresence>
        {isConfessionalActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md' : 'opacity-100'}`}>
        {statCards.map(({ key, label, icon: Icon, route }) => (
          <Link key={key} to={route}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full rounded-[20px] p-5 bg-[#0c0c0c] border border-[#2b2b2b]/80 hover:border-white/20 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white/60" />
                </div>
                <span className="text-xs text-white/40 uppercase tracking-widest font-medium">{label}</span>
              </div>
              <p className="text-3xl font-semibold text-white/90 tabular-nums">
                {isLoading ? '—' : (data?.stats[key] ?? 0)}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10 p-2">

        {/* Left Column (Main Focus - Map & Interaction) */}
        <div className={`xl:col-span-2 flex flex-col gap-8 transition-all duration-700 ease-in-out ${isConfessionalActive ? "opacity-30 blur-md grayscale-[0.5]" : "opacity-100"}`}>
          <SoulConstellationMap />
        </div>

        {/* Right Column (Intelligence & Funnels) */}
        <div className={`xl:col-span-1 flex flex-col gap-6 transition-all duration-700 ease-in-out ${isConfessionalActive ? "opacity-30 blur-md grayscale-[0.5]" : "opacity-100"}`}>
          <PatternAlerts />

          <div className="my-1">
            <h3 className="text-white/40 uppercase tracking-widest text-[11px] font-semibold mb-3 ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Ecosystem Resonance
            </h3>
            <SoulSyncCard type="romantic" />
          </div>

          <div className="my-1">
            <h3 className="text-white/40 uppercase tracking-widest text-[11px] font-semibold mb-3 ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              Professional Resolution
            </h3>
            <HumanMatchCard />
          </div>
        </div>

      </div>

      {/* Confessional Container - Breaks out of the dimming effect */}
      <div className={`mt-8 relative z-50 transition-all duration-700 ease-in-out ${isConfessionalActive ? '-translate-y-32 xl:-translate-y-64 scale-105 shadow-2xl' : 'translate-y-0 scale-100 xl:w-2/3'}`}>
        <TheConfessional onFocusChange={setIsConfessionalActive} />
      </div>

    </div>
  );
}
