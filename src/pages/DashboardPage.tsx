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
    <div className="w-full min-h-screen relative overflow-hidden bg-background transition-colors duration-500">
      {/* Deep Background Gradients (adapted for theme) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-normal dark:mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 dark:bg-accent/10 blur-[120px] rounded-full pointer-events-none mix-blend-normal dark:mix-blend-screen" />

      <div className="w-full relative z-10 pb-24 px-4 sm:px-8 mt-4 sm:mt-8">      {/* Safe Room Overlay */}
        <AnimatePresence>
          {isConfessionalActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md' : 'opacity-100'}`}>
          {statCards.map(({ key, label, icon: Icon, route, color }, idx) => (
            <Link key={key} to={route} className="block">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative w-full rounded-[32px] p-6 sm:p-8 bg-foreground/[0.02] backdrop-blur-2xl border border-foreground/[0.06] shadow-sm hover:bg-foreground/[0.04] transition-all group cursor-pointer overflow-hidden isolate"
              >
                {/* Subtle hover gradient behind content */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/[0.04] flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground/0 group-hover:text-foreground/40 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums tracking-[-0.02em] mb-2 relative z-10">
                  {isLoading ? '—' : (data?.stats[key] ?? 0)}
                </p>
                <div className="flex items-center justify-between relative z-10 mt-1">
                  <span className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">{label}</span>
                  <span className="text-[10px] text-foreground/40 flex items-center gap-1 font-medium bg-foreground/[0.03] px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {getTrend(key, data)}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 sm:gap-10 relative z-10 w-full max-w-[1600px] mx-auto">

          {/* Left Column — Constellation Map */}
          <div className={`xl:col-span-2 flex flex-col gap-8 sm:gap-10 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md grayscale-[0.5]' : 'opacity-100'}`}>
            <SoulConstellationMap />
          </div>

          {/* Right Column — Intelligence Panel */}
          <div className={`xl:col-span-1 flex flex-col gap-6 transition-all duration-700 ease-in-out ${isConfessionalActive ? 'opacity-30 blur-md grayscale-[0.5]' : 'opacity-100'}`}>
            <PatternAlerts />

            <div className="py-2">
              <h3 className="text-foreground/50 uppercase tracking-widest text-[10px] font-bold mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                Ecosystem Resonance
              </h3>
              <SoulSyncCard type="romantic" />
            </div>

            <div className="py-2">
              <h3 className="text-foreground/50 uppercase tracking-widest text-[10px] font-bold mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Professional Resolution
              </h3>
              <HumanMatchCard />
            </div>
          </div>
        </div>

        {/* Confessional — breaks out of dim zone */}
        <div className={`mt-8 relative z-50 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isConfessionalActive ? 'scale-[1.02] shadow-[0_30px_100px_rgba(0,0,0,0.8)] xl:w-[85%] mx-auto' : 'scale-100 xl:w-2/3'}`}>
          <TheConfessional onFocusChange={setIsConfessionalActive} />
        </div>
      </div>
    </div>
  );
}
