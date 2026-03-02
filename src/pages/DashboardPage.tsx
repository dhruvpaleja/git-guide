import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BookOpen, Smile, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SoulConstellationMap from '@/features/dashboard/components/widgets/SoulConstellationMap';
import TheConfessional from '@/features/dashboard/components/widgets/TheConfessional';
import HumanMatchCard from '@/features/dashboard/components/widgets/HumanMatchCard';
import SoulSyncCard from '@/features/dashboard/components/widgets/SoulSyncCard';
import PatternAlerts from '@/features/dashboard/components/widgets/PatternAlerts';
import { useDashboard } from '@/hooks/useDashboard';

const statCards = [
  { key: 'sessionsCompleted', label: 'Sessions', icon: Calendar, route: '/dashboard/meditation', color: 'text-accent' },
  { key: 'moodEntries', label: 'Mood Logs', icon: Smile, route: '/dashboard/mood', color: 'text-amber-400' },
  { key: 'journalEntries', label: 'Journal', icon: BookOpen, route: '/dashboard/journal', color: 'text-blue-400' },
  { key: 'meditationSessions', label: 'Meditations', icon: Brain, route: '/dashboard/meditation', color: 'text-purple-400' },
] as const;

function getTrend(key: string, data: import('@/hooks/useDashboard').DashboardData | null): string {
  if (!data) return '';
  const v = data.stats[key as keyof typeof data.stats] ?? 0;
  if (key === 'moodEntries' && data.moodTrend.length >= 2) {
    const recent = data.moodTrend[data.moodTrend.length - 1]?.score;
    const prev = data.moodTrend[data.moodTrend.length - 2]?.score;
    if (recent != null && prev != null) {
      const diff = recent - prev;
      return diff >= 0 ? `+${diff.toFixed(1)} trend` : `${diff.toFixed(1)} trend`;
    }
  }
  return `${v} total`;
}

export default function DashboardPage() {
  const [isConfessionalActive, setIsConfessionalActive] = useState(false);
  const { data, isLoading } = useDashboard();

  return (
    <div className="w-full h-full pb-20 relative">

      {/* Safe Room Overlay */}
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
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md' : 'opacity-100'}`}>
        {statCards.map(({ key, label, icon: Icon, route, color }, idx) => (
          <Link key={key} to={route}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative w-full rounded-[24px] p-5 sm:p-6 bg-[#0c0c0c] border border-[#2b2b2b]/60 hover:border-white/15 transition-all group cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/30 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white/90 tabular-nums mb-1 relative z-10">
                {isLoading ? '—' : (data?.stats[key] ?? 0)}
              </p>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-xs text-white/40 uppercase tracking-wider font-medium">{label}</span>
                <span className="text-[11px] text-white/30 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {getTrend(key, data)}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 relative z-10">

        {/* Left Column — Constellation Map */}
        <div className={`xl:col-span-2 flex flex-col gap-6 sm:gap-8 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md grayscale-[0.5]' : 'opacity-100'}`}>
          <SoulConstellationMap />
        </div>

        {/* Right Column — Intelligence Panel */}
        <div className={`xl:col-span-1 flex flex-col gap-5 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md grayscale-[0.5]' : 'opacity-100'}`}>
          <PatternAlerts />

          <div>
            <h3 className="text-white/40 uppercase tracking-wider text-[11px] font-semibold mb-3 ml-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent" />
              Ecosystem Resonance
            </h3>
            <SoulSyncCard type="romantic" />
          </div>

          <div>
            <h3 className="text-white/40 uppercase tracking-wider text-[11px] font-semibold mb-3 ml-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              Professional Resolution
            </h3>
            <HumanMatchCard />
          </div>
        </div>
      </div>

      {/* Confessional — breaks out of dim zone */}
      <div className={`mt-8 relative z-50 transition-all duration-700 ease-in-out ${isConfessionalActive ? '-translate-y-16 xl:-translate-y-32 scale-[1.02] shadow-2xl' : 'translate-y-0 scale-100 xl:w-2/3'}`}>
        <TheConfessional onFocusChange={setIsConfessionalActive} />
      </div>
    </div>
  );
}
