import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Smile,
  Brain,
  Compass,
  Calendar,
  TrendingUp,
  Sparkles,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SoulConstellationMap from '@/features/dashboard/components/widgets/SoulConstellationMap';
import TheConfessional from '@/features/dashboard/components/widgets/TheConfessional';
import HumanMatchCard from '@/features/dashboard/components/widgets/HumanMatchCard';
import PatternAlerts from '@/features/dashboard/components/widgets/PatternAlerts';
import { useDashboard } from '@/hooks/useDashboard';

/* ──── Stat Cards ──── */
const statCards = [
  {
    key: 'sessionsCompleted',
    label: 'Sessions',
    icon: Calendar,
    route: '/dashboard/meditation',
    gradient: 'from-orange-500/25 via-amber-500/10 to-transparent',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    ringColor: 'ring-orange-500/20',
  },
  {
    key: 'moodEntries',
    label: 'Mood Logs',
    icon: Smile,
    route: '/dashboard/mood',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    ringColor: 'ring-amber-500/20',
  },
  {
    key: 'journalEntries',
    label: 'Journal',
    icon: BookOpen,
    route: '/dashboard/journal',
    gradient: 'from-teal-500/20 via-cyan-500/10 to-transparent',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-400',
    ringColor: 'ring-teal-500/20',
  },
  {
    key: 'meditationSessions',
    label: 'Meditations',
    icon: Brain,
    route: '/dashboard/meditation',
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    ringColor: 'ring-purple-500/20',
  },
] as const;

/* ──── Quick-Link Pills ──── */
const quickLinks = [
  { label: 'Constellation', icon: Compass, route: '/dashboard/constellation', color: 'text-teal-400' },
  { label: 'Connections', icon: Heart, route: '/dashboard/connections', color: 'text-rose-400' },
  { label: 'Mood Tracker', icon: Smile, route: '/dashboard/mood', color: 'text-amber-400' },
  { label: 'Journal', icon: BookOpen, route: '/dashboard/journal', color: 'text-blue-400' },
  { label: 'Meditate', icon: Brain, route: '/dashboard/meditation', color: 'text-purple-400' },
];

function getTrend(key: string, data: import('@/hooks/useDashboard').DashboardData | null): string {
  if (!data) return '';
  const v = data.stats[key as keyof typeof data.stats] ?? 0;
  if (key === 'moodEntries' && data.moodTrend.length >= 2) {
    const recent = data.moodTrend[data.moodTrend.length - 1]?.score;
    const prev = data.moodTrend[data.moodTrend.length - 2]?.score;
    if (recent != null && prev != null) {
      const diff = recent - prev;
      return diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
    }
  }
  return v > 0 ? `${v} total` : '—';
}

export default function DashboardPage() {
  const [isConfessionalActive, setIsConfessionalActive] = useState(false);
  const { data, isLoading } = useDashboard();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* ───── Ambient Warm Gradients (Soul Yatri signature) ───── */}
      <div className="absolute top-[-25%] left-[10%] w-[55%] h-[55%] bg-orange-600/[0.07] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/[0.05] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[35%] h-[35%] bg-teal-600/[0.04] blur-[130px] rounded-full pointer-events-none" />

      {/* ───── Safe Room Overlay ───── */}
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

      <div className="w-full relative z-10 pb-24">
        {/* ═══════════════════════════════════════════
            SECTION 1 — Welcome + Quick Links
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-8 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''}`}
        >
          {/* Quick Link Pills — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {quickLinks.map((link, idx) => (
              <Link key={link.label} to={link.route}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 whitespace-nowrap group cursor-pointer"
                >
                  <link.icon className={`w-[14px] h-[14px] ${link.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <span className="text-[12px] font-medium text-white/50 group-hover:text-white/80 transition-colors tracking-tight">
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            SECTION 2 — Stat Cards (Bento-style)
        ═══════════════════════════════════════════ */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''}`}>
          {statCards.map(({ key, label, icon: Icon, route, gradient, iconBg, iconColor, ringColor }, idx) => (
            <Link key={key} to={route}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -3, scale: 1.015 }}
                className={`relative w-full rounded-[24px] p-5 sm:p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] hover:bg-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-500 group cursor-pointer overflow-hidden isolate ring-1 ${ringColor} ring-inset`}
              >
                {/* Warm gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center backdrop-blur-sm`}>
                    <Icon className={`w-[18px] h-[18px] ${iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/0 group-hover:text-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                </div>

                <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-[-0.03em] mb-1 relative z-10">
                  {isLoading ? <span className="inline-block w-8 h-7 bg-white/5 rounded-lg animate-pulse" /> : (data?.stats[key] ?? 0)}
                </p>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[11px] text-white/40 uppercase tracking-[0.1em] font-semibold">{label}</span>
                  {!isLoading && (
                    <span className="text-[10px] text-white/30 flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {getTrend(key, data)}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* ═══════════════════════════════════════════
            SECTION 3 — The Confessional (hero input)
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mb-8 relative transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isConfessionalActive
              ? 'z-50 scale-[1.01] shadow-[0_30px_100px_rgba(0,0,0,0.8)]'
              : 'z-10 scale-100'
            }`}
        >
          <TheConfessional onFocusChange={setIsConfessionalActive} />
        </motion.div>

        {/* ═══════════════════════════════════════════
            SECTION 4 — Main Dashboard Grid
        ═══════════════════════════════════════════ */}
        <div className={`grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''}`}>
          {/* Left — Constellation Map (spans 8 cols) */}
          <div className="xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <SoulConstellationMap />
            </motion.div>
          </div>

          {/* Right — Intelligence + Match (spans 4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <PatternAlerts />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <HumanMatchCard />
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SECTION 5 — Daily Insight Card (lowers scroll)
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`mt-8 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''}`}
        >
          <div className="relative rounded-[24px] overflow-hidden border border-white/[0.06] bg-gradient-to-r from-[#311d17]/40 via-[#1a1008]/30 to-transparent backdrop-blur-xl p-6 sm:p-8 group hover:border-white/[0.1] transition-all duration-500">
            {/* Warm ambient glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/[0.06] blur-[100px] rounded-full pointer-events-none group-hover:bg-orange-500/[0.1] transition-colors duration-700" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/10">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white/90 tracking-tight mb-1">Your Journey So Far</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed max-w-md">
                    Every step forward, however small, is a brave act. Soul Yatri is here to walk with you — through the light, and through the dark.
                  </p>
                </div>
              </div>
              <Link
                to="/dashboard/constellation"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#311d17]/60 hover:bg-[#311d17]/90 border border-white/[0.08] text-[13px] font-medium text-white/70 hover:text-white/90 transition-all duration-300 backdrop-blur-sm shadow-[0_0_20px_rgba(49,29,23,0.3)] whitespace-nowrap flex-shrink-0"
              >
                Explore
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
