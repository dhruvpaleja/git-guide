import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Heart,
  Briefcase,
  Users,
  ArrowRight,
  Fingerprint,
  BrainCircuit,
  MapPin,
  Sparkles,
  Filter,
  Zap,
  Shield,
  Eye,
  Network,
  Activity,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────

type ConnectionType = 'all' | 'romantic' | 'platonic' | 'professional';

interface ConnectionMatch {
  id: string;
  type: 'romantic' | 'platonic' | 'professional';
  title: string;
  label: string;
  synergy: number;
  distance: string;
  description: string;
  actionText: string;
  avatar: string;
  matchTraits: string[];
  sharedNodes: number;
  activeNow: boolean;
}

// ── Mock data ──────────────────────────────────────────────────────────

const MOCK_MATCHES: ConnectionMatch[] = [
  {
    id: '1',
    type: 'romantic',
    title: 'Romantic Offset',
    label: 'Karmic Balance Match',
    synergy: 94,
    distance: '4 miles',
    description:
      'Your constellation shows intense energy around the relationship node. This user\'s emotional map perfectly counter-balances your current pattern — they bring grounding where you have turbulence.',
    actionText: 'Reveal Profile',
    avatar: 'https://i.pravatar.cc/100?img=32',
    matchTraits: ['Emotional Grounding', 'Shared Vulnerability', 'Opposing Polarity'],
    sharedNodes: 4,
    activeNow: true,
  },
  {
    id: '2',
    type: 'professional',
    title: 'Constellation Match',
    label: 'Professional Guidance',
    synergy: 98,
    distance: 'Remote',
    description:
      'You\'ve mapped severe friction between the Tech Career and Anxiety nodes over the last 3 weeks. Dr. Aisha M. specializes precisely in high-functioning corporate panic.',
    actionText: 'Connect Now',
    avatar: 'https://i.pravatar.cc/100?img=5',
    matchTraits: ['Burnout Recovery', 'Career Transition', 'FAANG Experience'],
    sharedNodes: 3,
    activeNow: true,
  },
  {
    id: '3',
    type: 'platonic',
    title: 'Shared Frequency',
    label: 'Empathy Match',
    synergy: 87,
    distance: '12 miles',
    description:
      'A user just added a "Grief" node identical to yours. Their emotional chart shows high compatibility for holding space. Sometimes the best healing comes from someone walking the same path.',
    actionText: 'Send Support Pulse',
    avatar: 'https://i.pravatar.cc/100?img=12',
    matchTraits: ['Grief Processing', 'Deep Listening', 'Shared Experience'],
    sharedNodes: 2,
    activeNow: false,
  },
  {
    id: '4',
    type: 'professional',
    title: 'Synergy Node',
    label: 'Skill Match',
    synergy: 91,
    distance: 'Remote',
    description:
      'You mapped "Need an Editor" in your Work node 2 days ago. This user is a top-rated editor with matching communication styles and complementary creative energy.',
    actionText: 'Connect Professionally',
    avatar: 'https://i.pravatar.cc/100?img=8',
    matchTraits: ['Creative Synergy', 'Communication Style', 'Work Ethic Match'],
    sharedNodes: 2,
    activeNow: false,
  },
  {
    id: '5',
    type: 'platonic',
    title: 'Mirror Node',
    label: 'Growth Partner',
    synergy: 82,
    distance: '8 miles',
    description:
      'This user\'s meditation practice node mirrors yours almost exactly — same frequency, same struggles with consistency. They\'re looking for an accountability partner.',
    actionText: 'Send Pulse',
    avatar: 'https://i.pravatar.cc/100?img=18',
    matchTraits: ['Meditation Practice', 'Consistency', 'Accountability'],
    sharedNodes: 3,
    activeNow: true,
  },
  {
    id: '6',
    type: 'romantic',
    title: 'Harmonic Resonance',
    label: 'Deep Frequency Match',
    synergy: 89,
    distance: '2 miles',
    description:
      'This user\'s emotional frequency has been oscillating in perfect harmony with yours for the last 2 weeks. Your grief and hope nodes move in tandem — a rare phenomenon our AI flagged.',
    actionText: 'Reveal Profile',
    avatar: 'https://i.pravatar.cc/100?img=25',
    matchTraits: ['Emotional Resonance', 'Timing Alignment', 'Mutual Healing'],
    sharedNodes: 5,
    activeNow: true,
  },
];

// ── Config ─────────────────────────────────────────────────────────────

const typeConfigs = {
  romantic: {
    color: 'from-rose-500/20 to-purple-500/10',
    borderColor: 'border-rose-500/30',
    hoverBorder: 'hover:border-rose-500/50',
    iconColor: 'text-rose-400',
    pillBg: 'bg-rose-500/10',
    icon: Heart,
    badge: 'bg-rose-500/10 text-rose-400',
    accentHex: '#f43f5e',
    glowColor: 'rose-500',
    ringColor: 'stroke-rose-400',
  },
  platonic: {
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    pillBg: 'bg-blue-500/10',
    icon: Users,
    badge: 'bg-blue-500/10 text-blue-400',
    accentHex: '#3b82f6',
    glowColor: 'blue-500',
    ringColor: 'stroke-blue-400',
  },
  professional: {
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/50',
    iconColor: 'text-emerald-400',
    pillBg: 'bg-emerald-500/10',
    icon: Briefcase,
    badge: 'bg-emerald-500/10 text-emerald-400',
    accentHex: '#10b981',
    glowColor: 'emerald-500',
    ringColor: 'stroke-emerald-400',
  },
};

const filterTabs: { key: ConnectionType; label: string; icon: typeof Compass }[] = [
  { key: 'all', label: 'All Matches', icon: Compass },
  { key: 'romantic', label: 'Romantic', icon: Heart },
  { key: 'platonic', label: 'Platonic', icon: Users },
  { key: 'professional', label: 'Professional', icon: Briefcase },
];

// ── Synergy Ring SVG ───────────────────────────────────────────────────

function SynergyRing({ synergy, color, size = 48 }: { synergy: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (synergy / 100) * circumference;
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - filled }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white/80 text-[11px] font-bold"
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
        {synergy}%
      </text>
    </svg>
  );
}

// ── Fingerprint Scanner Animation ──────────────────────────────────────

function FingerprintScanner() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <Fingerprint className="w-7 h-7 text-accent/30" />
      <motion.div
        className="absolute inset-0 border border-accent/15 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ── Brain Circuit Visualization ────────────────────────────────────────

function BrainCircuitVisual() {
  return (
    <div className="w-14 h-14 flex items-center justify-center">
      <BrainCircuit className="w-7 h-7 text-emerald-400/30" />
    </div>
  );
}

// ── Match Card Component ───────────────────────────────────────────────

function MatchCard({ match, idx }: { match: ConnectionMatch; idx: number }) {
  const c = typeConfigs[match.type];
  const TypeIcon = c.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.07 }}
      className={cn(
        'relative w-full rounded-[24px] p-6 bg-[#0a0a0a] border border-[#2b2b2b]/60 overflow-hidden group transition-all duration-300',
        c.hoverBorder,
      )}
    >
      {/* Background glow */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-30',
          c.color,
        )}
      />

      <div className="relative z-10">
        {/* Top Row: Icon + Title + Badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Type icon with animated ring */}
            <div className="relative">
              <div
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center',
                  c.pillBg,
                )}
              >
                <TypeIcon className={cn('w-5 h-5', c.iconColor)} />
              </div>
              {match.activeNow && (
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0a0a]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h3 className="text-white/90 font-semibold tracking-tight">{match.title}</h3>
              <p className="text-[11px] text-white/35 uppercase tracking-wider font-medium">
                {match.label}
              </p>
            </div>
          </div>

            {/* Shared nodes + Location */}
            <div className="flex items-center gap-2 text-[11px] text-white/35">
              <span className="flex items-center gap-1">
                <Network className="w-3 h-3" />
                {match.sharedNodes} shared
              </span>
              <span className="text-white/15">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {match.distance}
              </span>
            </div>
        </div>

        {/* Neural Match Visualization Row */}
        <div className="flex items-center gap-5 mt-5 mb-5">
          {/* Synergy Ring */}
          <SynergyRing synergy={match.synergy} color={c.accentHex} />

          {/* Match Traits */}
          <div className="flex-1 space-y-1.5">
            {match.matchTraits.map((trait) => (
              <div key={trait} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.accentHex, opacity: 0.6 }}
                />
                <span className="text-xs text-white/50">{trait}</span>
              </div>
            ))}
          </div>

          {/* Visual element based on type */}
          <div className="hidden sm:flex">
            {match.type === 'professional' ? (
              <BrainCircuitVisual />
            ) : (
              <FingerprintScanner />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <p className="text-white/65 text-[14.5px] leading-relaxed">{match.description}</p>
        </div>

        {/* Expanded: Compatibility Breakdown */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pb-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-wider font-medium">
                  <Activity className="w-3.5 h-3.5" />
                  Compatibility Breakdown
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Emotional', value: Math.min(100, match.synergy + 3), icon: Heart },
                    { label: 'Neural Pattern', value: Math.max(60, match.synergy - 7), icon: BrainCircuit },
                    { label: 'Frequency', value: Math.max(65, match.synergy - 4), icon: Radio },
                  ].map((bar) => (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                        <bar.icon className="w-3 h-3" />
                        {bar.label}
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: c.accentHex, opacity: 0.7 }}
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="text-[11px] text-white/30 text-right">{bar.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Row */}
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#111] border-2 border-[#1a1a1a] flex items-center justify-center overflow-hidden">
                <img
                  src={match.avatar}
                  alt=""
                  className="w-full h-full object-cover opacity-60 blur-[2px] group-hover:blur-0 group-hover:opacity-80 transition-all duration-500"
                />
              </div>
            </div>

            {/* Expand details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {expanded ? 'Less' : 'Details'}
            </button>
          </div>

          <button
            onClick={() => toast.info(`${match.actionText} — coming soon!`)}
            className={cn(
              'group/btn flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg',
              match.type === 'professional'
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
            )}
          >
            {match.actionText}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────────────

function StatsBar({ matches }: { matches: ConnectionMatch[] }) {
  const active = matches.filter((m) => m.activeNow).length;
  const avgSynergy = Math.round(matches.reduce((sum, m) => sum + m.synergy, 0) / matches.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-4 gap-4 mb-8"
    >
      {[
        { label: 'Total Matches', value: matches.length, icon: Compass, color: 'text-accent' },
        { label: 'Active Now', value: active, icon: Zap, color: 'text-green-400' },
        { label: 'Avg Synergy', value: `${avgSynergy}%`, icon: Activity, color: 'text-purple-400' },
        { label: 'Privacy Score', value: '100%', icon: Shield, color: 'text-blue-400' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + i * 0.04 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-[#1a1a1a]"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
            <stat.icon className={cn('w-4 h-4', stat.color)} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white/80">{stat.value}</div>
            <div className="text-[11px] text-white/30 uppercase tracking-wider">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────

export default function ConnectionsPage() {
  const [activeFilter, setActiveFilter] = useState<ConnectionType>('all');
  const [showFilter, setShowFilter] = useState(false);

  const filteredMatches = useMemo(
    () =>
      activeFilter === 'all'
        ? MOCK_MATCHES
        : MOCK_MATCHES.filter((m) => m.type === activeFilter),
    [activeFilter],
  );

  return (
    <div className="w-full pb-20">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative rounded-[24px] p-8 bg-[#0a0a0a] border border-[#2b2b2b]/40 overflow-hidden">
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Compass className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white/90 tracking-tight">
                  Human Connections
                </h1>
                <p className="text-sm text-white/35 mt-1 max-w-md leading-relaxed">
                  Neural-matched souls based on your constellation patterns, emotional fingerprints, and behavioral brain circuits. Every match is unique.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent">{MOCK_MATCHES.length} matches</span>
              </div>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all',
                  showFilter
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70',
                )}
              >
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <StatsBar matches={MOCK_MATCHES} />

      {/* Filter Tabs */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.04]">
              {filterTabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all',
                    activeFilter === key
                      ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/[0.03] border-[#1a1a1a] text-white/40 hover:text-white/70 hover:bg-white/5',
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  <span className="ml-1 text-[10px] opacity-50">
                    {key === 'all'
                      ? MOCK_MATCHES.length
                      : MOCK_MATCHES.filter((m) => m.type === key).length}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Cards */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {filteredMatches.map((match, idx) => (
            <MatchCard key={match.id} match={match} idx={idx} />
          ))}
        </AnimatePresence>

        {filteredMatches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center">
                <Compass className="w-8 h-8 text-white/15" />
              </div>
              <motion.div
                className="absolute inset-0 border border-white/5 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <p className="text-sm text-white/35 font-medium">No matches in this category yet</p>
            <p className="text-xs text-white/20 mt-1.5 max-w-xs">
              Add more nodes to your constellation to improve matching. The more emotional data you map, the better our neural engine can find your people.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
