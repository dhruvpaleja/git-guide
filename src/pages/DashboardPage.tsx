import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  BookOpen,
  Brain,
  Play,
  ChevronRight,
  Moon,
  Sun,
  CloudSun,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SoulConstellationMap from '@/features/dashboard/components/widgets/SoulConstellationMap';
import TheConfessional from '@/features/dashboard/components/widgets/TheConfessional';
import PatternAlerts from '@/features/dashboard/components/widgets/PatternAlerts';
import HumanMatchCard from '@/features/dashboard/components/widgets/HumanMatchCard';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/context/AuthContext';

/* ──── Greeting by time of day ──── */
function getGreeting(): { text: string; icon: typeof Sun } {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: Sun };
  if (h < 17) return { text: 'Good Afternoon', icon: CloudSun };
  return { text: 'Good Evening', icon: Moon };
}

/* ──── Quick Actions ──── */
const quickActions = [
  {
    label: 'Book a Session',
    desc: 'Find the right therapist',
    icon: Calendar,
    route: '/dashboard/sessions',
    accentColor: 'text-amber-400',
    bgColor: 'bg-amber-500/[0.08]',
    borderColor: 'border-amber-500/[0.08]',
    glowColor: 'bg-amber-500/[0.03]',
  },
  {
    label: 'Journal',
    desc: 'Write your thoughts',
    icon: BookOpen,
    route: '/dashboard/journal',
    accentColor: 'text-purple-400',
    bgColor: 'bg-purple-500/[0.08]',
    borderColor: 'border-purple-500/[0.08]',
    glowColor: 'bg-purple-500/[0.03]',
  },
  {
    label: 'Meditate',
    desc: 'Guided breathing',
    icon: Brain,
    route: '/dashboard/meditate',
    accentColor: 'text-teal-400',
    bgColor: 'bg-teal-500/[0.08]',
    borderColor: 'border-teal-500/[0.08]',
    glowColor: 'bg-teal-500/[0.03]',
  },
];

/* ──── Stagger animation variants ──── */
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const [isConfessionalActive, setIsConfessionalActive] = useState(false);
  const { data } = useDashboard();
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] ?? 'there';
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] relative">
      {/* ─── Safe Room Overlay ─── */}
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

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full relative z-10 pb-16"
      >
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — Welcome + Book Session CTA
            Clean, minimal. No vanity metrics.
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className={`mb-6 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GreetingIcon className="w-3.5 h-3.5 text-amber-500/60" />
                <p className="text-[11px] text-white/50 font-semibold tracking-[0.12em] uppercase">
                  {greeting.text}
                </p>
              </div>
              <h1 className="text-[28px] sm:text-[34px] font-bold text-white/90 tracking-[-0.04em] leading-[1.1]">
                Welcome back, {userName}.
              </h1>
              <p className="text-[12px] text-white/25 mt-2 font-medium leading-relaxed max-w-md">
                Your journey begins here. Take it one step at a time.
              </p>
            </div>

            {data?.upcomingSession ? (
              <Link
                to={`/dashboard/sessions/${data.upcomingSession.id}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-300 group flex-shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/10">
                  <Play className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Next Session</p>
                  <p className="text-[13px] text-white/85 font-semibold">{data.upcomingSession.therapistName}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 ml-1 transition-colors" />
              </Link>
            ) : (
              <Link
                to="/dashboard/sessions"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/50 hover:to-orange-800/30 border border-amber-500/10 text-[13px] font-medium text-white/70 hover:text-white/90 transition-all duration-400 backdrop-blur-sm flex items-center gap-2 flex-shrink-0 shadow-[0_0_40px_rgba(180,120,40,0.08)]"
              >
                Book a Session
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — The Confessional (AI input — stays prominent)
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className={`mb-6 relative transition-all duration-1000 ease-soul-smooth ${isConfessionalActive
              ? 'z-50 scale-[1.01] shadow-[0_30px_100px_rgba(0,0,0,0.8)]'
              : 'z-10 scale-100'
            }`}
        >
          <TheConfessional onFocusChange={setIsConfessionalActive} />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — ★ CONSTELLATION MAP (Hero — the main event)
            This is what makes Soul Yatri unique. Gets top billing.
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className={`mb-6 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''}`}
        >
          <SoulConstellationMap />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — ★ INSIGHTS + PSYCHOLOGIST MATCH (the money shot)
            Pattern intelligence on left, therapist recommendation on right.
            This is the primary conversion funnel.
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''
            }`}
        >
          <PatternAlerts />
          <HumanMatchCard />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5 — Quick Actions (compact utility row at bottom)
            Book Session • Journal • Meditate
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-700 ${isConfessionalActive ? 'opacity-20 blur-sm' : ''
            }`}
        >
          {quickActions.map(({ label, desc, icon: Icon, route, accentColor, bgColor, borderColor, glowColor }) => (
            <Link key={label} to={route}>
              <motion.div
                whileHover={{ y: -2 }}
                className="relative rounded-[16px] p-4 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all duration-400 group cursor-pointer overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 ${glowColor} blur-[30px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-[10px] ${bgColor} border ${borderColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-[15px] h-[15px] ${accentColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white/75 tracking-tight">{label}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">{desc}</p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/25 transition-all duration-300 flex-shrink-0" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* ── Bottom Breathing Space ── */}
        <div className="h-8" />
      </motion.div>
    </div>
  );
}
