import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Clock,
    Star,
    Search,
    ChevronRight,
    Video,
    MessageSquare,
    Phone,
    MapPin,
    Sparkles,
    CheckCircle2,
    Play,
    FileText,
    CalendarDays,
    Timer,
    Users,
    CircleDot,
    X,
} from 'lucide-react';

/* ━━━━━━━━━━━━━━━━━━━━ Types ━━━━━━━━━━━━━━━━━━━━ */
interface UpcomingSession {
    id: string;
    therapistName: string;
    therapistTitle: string;
    avatar: string;
    date: string;
    time: string;
    duration: string;
    sessionType: 'video' | 'chat' | 'call' | 'in-person';
    status: 'confirmed' | 'pending' | 'starting-soon';
    notes?: string;
}

interface Therapist {
    id: string;
    name: string;
    title: string;
    specializations: string[];
    avatar: string;
    rating: number;
    reviews: number;
    experience: string;
    nextAvailable: string;
    sessionTypes: ('video' | 'chat' | 'call' | 'in-person')[];
    price: number;
    matchScore: number;
    isOnline: boolean;
}

interface PastSession {
    id: string;
    therapistName: string;
    avatar: string;
    date: string;
    duration: string;
    sessionType: 'video' | 'chat' | 'call' | 'in-person';
    rating?: number;
    hasSummary: boolean;
    topic: string;
}

/* ━━━━━━━━━━━━━━━━━━━━ Mock Data ━━━━━━━━━━━━━━━━━━━━ */
const upcomingSessions: UpcomingSession[] = [
    {
        id: '1',
        therapistName: 'Dr. Aisha M.',
        therapistTitle: 'Clinical Psychologist',
        avatar: 'https://i.pravatar.cc/100?img=5',
        date: 'Today',
        time: '4:00 PM',
        duration: '50 min',
        sessionType: 'video',
        status: 'starting-soon',
        notes: 'Follow-up on career anxiety techniques',
    },
    {
        id: '2',
        therapistName: 'Dr. Priya S.',
        therapistTitle: 'CBT Specialist',
        avatar: 'https://i.pravatar.cc/100?img=9',
        date: 'Tomorrow',
        time: '10:00 AM',
        duration: '50 min',
        sessionType: 'video',
        status: 'confirmed',
    },
    {
        id: '3',
        therapistName: 'Dr. Karan A.',
        therapistTitle: 'Mindfulness Coach',
        avatar: 'https://i.pravatar.cc/100?img=15',
        date: 'Wed, 5 Mar',
        time: '11:00 AM',
        duration: '30 min',
        sessionType: 'chat',
        status: 'pending',
    },
];

const therapists: Therapist[] = [
    {
        id: '1',
        name: 'Dr. Aisha M.',
        title: 'Clinical Psychologist',
        specializations: ['Anxiety', 'Corporate Stress', 'Burnout'],
        avatar: 'https://i.pravatar.cc/100?img=5',
        rating: 4.9,
        reviews: 204,
        experience: '12 years',
        nextAvailable: 'Today, 4:00 PM',
        sessionTypes: ['video', 'chat', 'call'],
        price: 1500,
        matchScore: 98,
        isOnline: true,
    },
    {
        id: '2',
        name: 'Dr. Raj P.',
        title: 'Relationship Counselor',
        specializations: ['Relationships', 'Family Therapy', 'Couples'],
        avatar: 'https://i.pravatar.cc/100?img=12',
        rating: 4.8,
        reviews: 156,
        experience: '8 years',
        nextAvailable: 'Tomorrow, 10:00 AM',
        sessionTypes: ['video', 'call'],
        price: 1200,
        matchScore: 87,
        isOnline: false,
    },
    {
        id: '3',
        name: 'Dr. Priya S.',
        title: 'CBT Specialist',
        specializations: ['Depression', 'OCD', 'Social Anxiety'],
        avatar: 'https://i.pravatar.cc/100?img=9',
        rating: 4.9,
        reviews: 312,
        experience: '15 years',
        nextAvailable: 'Today, 7:00 PM',
        sessionTypes: ['video', 'chat', 'call', 'in-person'],
        price: 2000,
        matchScore: 91,
        isOnline: true,
    },
    {
        id: '4',
        name: 'Dr. Karan A.',
        title: 'Mindfulness Coach',
        specializations: ['Stress', 'Mindfulness', 'Self-Esteem'],
        avatar: 'https://i.pravatar.cc/100?img=15',
        rating: 4.7,
        reviews: 98,
        experience: '6 years',
        nextAvailable: 'Wed, 11:00 AM',
        sessionTypes: ['video', 'chat'],
        price: 1000,
        matchScore: 82,
        isOnline: false,
    },
];

const pastSessions: PastSession[] = [
    {
        id: '1',
        therapistName: 'Dr. Aisha M.',
        avatar: 'https://i.pravatar.cc/100?img=5',
        date: 'Mon, 24 Feb',
        duration: '50 min',
        sessionType: 'video',
        rating: 5,
        hasSummary: true,
        topic: 'Career anxiety & burnout strategies',
    },
    {
        id: '2',
        therapistName: 'Dr. Priya S.',
        avatar: 'https://i.pravatar.cc/100?img=9',
        date: 'Thu, 20 Feb',
        duration: '50 min',
        sessionType: 'video',
        rating: 5,
        hasSummary: true,
        topic: 'Cognitive restructuring techniques',
    },
    {
        id: '3',
        therapistName: 'Dr. Karan A.',
        avatar: 'https://i.pravatar.cc/100?img=15',
        date: 'Tue, 18 Feb',
        duration: '30 min',
        sessionType: 'chat',
        rating: 4,
        hasSummary: true,
        topic: 'Mindfulness meditation practice',
    },
    {
        id: '4',
        therapistName: 'Dr. Raj P.',
        avatar: 'https://i.pravatar.cc/100?img=12',
        date: 'Fri, 14 Feb',
        duration: '50 min',
        sessionType: 'call',
        rating: 5,
        hasSummary: false,
        topic: 'Relationship communication patterns',
    },
];

const sessionTypeIcons = {
    video: Video,
    chat: MessageSquare,
    call: Phone,
    'in-person': MapPin,
};

const sessionTypeLabels = {
    video: 'Video Call',
    chat: 'Chat',
    call: 'Phone Call',
    'in-person': 'In Person',
};

/* ━━━━━━━━━━━━━━━━━━━━ Animations ━━━━━━━━━━━━━━━━━━━━ */
const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ━━━━━━━━━━━━━━━━━━━━ Tab type ━━━━━━━━━━━━━━━━━━━━ */
type Tab = 'upcoming' | 'find' | 'history';

/* ━━━━━━━━━━━━━━━━━━━━ Component ━━━━━━━━━━━━━━━━━━━━ */
export default function SessionsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('upcoming');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filters = ['all', 'anxiety', 'depression', 'relationships', 'stress', 'burnout', 'mindfulness'];

    const filteredTherapists = therapists.filter((t) => {
        if (selectedFilter !== 'all') {
            return t.specializations.some((s) =>
                s.toLowerCase().includes(selectedFilter.toLowerCase())
            );
        }
        return true;
    }).filter((t) => {
        if (searchQuery) {
            return (
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        return true;
    });

    const tabs: { key: Tab; label: string; icon: typeof Calendar; count?: number }[] = [
        { key: 'upcoming', label: 'Upcoming', icon: CalendarDays, count: upcomingSessions.length },
        { key: 'find', label: 'Find Therapist', icon: Users },
        { key: 'history', label: 'History', icon: Clock },
    ];

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="w-full pb-16"
        >
            {/* ── Header ── */}
            <motion.div variants={fadeUp} className="mb-6">
                <h1 className="text-[26px] sm:text-[30px] font-bold text-white/90 tracking-[-0.03em] mb-1.5">
                    Sessions
                </h1>
                <p className="text-[13px] text-white/35 max-w-lg leading-relaxed">
                    Manage upcoming appointments, discover new therapists, and review your journey.
                </p>
            </motion.div>

            {/* ── Quick Stats ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                {[
                    { label: 'Upcoming', value: '3', icon: CalendarDays, accent: 'text-emerald-400', bg: 'from-emerald-900/15 to-emerald-900/5', border: 'border-emerald-500/8' },
                    { label: 'This Month', value: '8', icon: Calendar, accent: 'text-amber-400', bg: 'from-amber-900/15 to-amber-900/5', border: 'border-amber-500/8' },
                    { label: 'Completed', value: '47', icon: CheckCircle2, accent: 'text-blue-400', bg: 'from-blue-900/15 to-blue-900/5', border: 'border-blue-500/8' },
                    { label: 'Hours', value: '39.2', icon: Timer, accent: 'text-purple-400', bg: 'from-purple-900/15 to-purple-900/5', border: 'border-purple-500/8' },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-[16px] p-4 bg-gradient-to-br ${stat.bg} border ${stat.border} relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] blur-[30px] rounded-full" />
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-3.5 h-3.5 ${stat.accent} opacity-70`} />
                            <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <span className={`text-[22px] font-bold ${stat.accent} opacity-90`}>{stat.value}</span>
                    </div>
                ))}
            </motion.div>

            {/* ── Tab Navigation ── */}
            <motion.div variants={fadeUp} className="flex items-center gap-1 mb-6 bg-white/[0.02] rounded-[14px] p-1 border border-white/[0.04] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[12px] font-medium transition-all duration-300 ${activeTab === tab.key
                            ? 'bg-white/[0.07] text-white/90 shadow-sm'
                            : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-white/[0.05] text-white/30'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </motion.div>

            {/* ── Panel Content ── */}
            <AnimatePresence mode="wait">
                {activeTab === 'upcoming' && (
                    <motion.div
                        key="upcoming"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <UpcomingPanel sessions={upcomingSessions} />
                    </motion.div>
                )}

                {activeTab === 'find' && (
                    <motion.div
                        key="find"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FindTherapistPanel
                            therapists={filteredTherapists}
                            filters={filters}
                            selectedFilter={selectedFilter}
                            searchQuery={searchQuery}
                            onFilterChange={setSelectedFilter}
                            onSearchChange={setSearchQuery}
                        />
                    </motion.div>
                )}

                {activeTab === 'history' && (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <HistoryPanel sessions={pastSessions} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ Upcoming Panel ━━━━━━━━━━━━━━━━━━━━ */
function UpcomingPanel({ sessions }: { sessions: UpcomingSession[] }) {
    const getStatusStyle = (status: UpcomingSession['status']) => {
        switch (status) {
            case 'starting-soon':
                return { bg: 'bg-emerald-500/10 border-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Starting Soon' };
            case 'confirmed':
                return { bg: 'bg-blue-500/10 border-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Confirmed' };
            case 'pending':
                return { bg: 'bg-amber-500/10 border-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Pending' };
        }
    };

    return (
        <div className="space-y-3">
            {/* Active / Starting Soon — hero card */}
            {sessions.filter(s => s.status === 'starting-soon').map(session => {
                const SessionIcon = sessionTypeIcons[session.sessionType];
                return (
                    <div
                        key={session.id}
                        className="relative rounded-[20px] p-6 bg-gradient-to-br from-emerald-900/[0.12] via-emerald-900/[0.06] to-transparent border border-emerald-500/[0.08] overflow-hidden group"
                    >
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/[0.04] blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-emerald-500/[0.02] blur-[50px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            {/* Status + Time */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex items-center justify-center">
                                        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Session Starting Soon</span>
                                </div>
                                <span className="text-[12px] text-white/40 font-medium">{session.date} · {session.time}</span>
                            </div>

                            {/* Therapist Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/20 flex-shrink-0">
                                    <img src={session.avatar} alt={session.therapistName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[16px] font-semibold text-white/90">{session.therapistName}</h3>
                                    <p className="text-[12px] text-white/40">{session.therapistTitle}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <SessionIcon className="w-3 h-3 text-white/25" />
                                            <span className="text-[10px] text-white/30">{sessionTypeLabels[session.sessionType]}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Timer className="w-3 h-3 text-white/25" />
                                            <span className="text-[10px] text-white/30">{session.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {session.notes && (
                                <div className="mb-5 px-3.5 py-2.5 rounded-[12px] bg-white/[0.03] border border-white/[0.04]">
                                    <p className="text-[11px] text-white/35 italic">"{session.notes}"</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600/40 to-emerald-700/20 hover:from-emerald-500/50 hover:to-emerald-600/30 text-white/90 font-semibold text-[13px] transition-all border border-emerald-500/15 hover:border-emerald-500/25 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                                    <Play className="w-4 h-4" />
                                    Join Session
                                </button>
                                <button className="px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/70 font-medium text-[12px] transition-all border border-white/[0.05]">
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Other upcoming sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sessions.filter(s => s.status !== 'starting-soon').map(session => {
                    const SessionIcon = sessionTypeIcons[session.sessionType];
                    const statusStyle = getStatusStyle(session.status);
                    return (
                        <div
                            key={session.id}
                            className="rounded-[18px] p-5 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.035] hover:border-white/[0.07] transition-all duration-400 group hover:-translate-y-0.5"
                        >
                            {/* Status */}
                            <div className="flex items-center justify-between mb-3.5">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusStyle.bg} border`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                    <span className={`text-[10px] font-semibold ${statusStyle.text}`}>{statusStyle.label}</span>
                                </div>
                                <span className="text-[11px] text-white/30 font-medium">{session.date}</span>
                            </div>

                            {/* Therapist */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.06] flex-shrink-0">
                                    <img src={session.avatar} alt={session.therapistName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-semibold text-white/80">{session.therapistName}</h4>
                                    <p className="text-[10px] text-white/30">{session.therapistTitle}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-white/20" />
                                    <span className="text-[11px] text-white/40">{session.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Timer className="w-3 h-3 text-white/20" />
                                    <span className="text-[11px] text-white/40">{session.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <SessionIcon className="w-3 h-3 text-white/20" />
                                    <span className="text-[11px] text-white/40">{sessionTypeLabels[session.sessionType]}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                                <button className="flex-1 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/70 text-[11px] font-medium transition-all border border-white/[0.04]">
                                    Reschedule
                                </button>
                                <button className="flex-1 py-2 rounded-full bg-amber-900/20 hover:bg-amber-800/30 text-amber-400/80 hover:text-amber-400 text-[11px] font-semibold transition-all border border-amber-500/10">
                                    View Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Book New CTA */}
            <div className="mt-2">
                <button
                    onClick={() => {
                        // This would be better with a prop callback or setActiveTab
                        document.querySelector<HTMLButtonElement>('[data-tab="find"]')?.click();
                    }}
                    className="w-full rounded-[16px] p-4 bg-white/[0.015] border border-dashed border-white/[0.06] hover:border-amber-500/15 hover:bg-white/[0.025] transition-all flex items-center justify-center gap-2 text-white/30 hover:text-amber-400/70 group"
                >
                    <span className="w-6 h-6 rounded-full bg-white/[0.04] group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[12px] font-medium">Book a New Session</span>
                </button>
            </div>
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ Find Therapist Panel ━━━━━━━━━━━━━━━━━━━━ */
function FindTherapistPanel({
    therapists,
    filters,
    selectedFilter,
    searchQuery,
    onFilterChange,
    onSearchChange,
}: {
    therapists: Therapist[];
    filters: string[];
    selectedFilter: string;
    searchQuery: string;
    onFilterChange: (f: string) => void;
    onSearchChange: (q: string) => void;
}) {
    return (
        <div>
            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-11 bg-white/[0.03] rounded-[14px] pl-11 pr-4 text-[13px] text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/[0.08] focus:bg-white/[0.05] border border-white/[0.04] transition-all"
                />
                {searchQuery && (
                    <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-3.5 h-3.5 text-white/20 hover:text-white/40 transition-colors" />
                    </button>
                )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto hide-scrollbar pb-1">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f)}
                        className={`px-4 py-2 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all duration-300 ${selectedFilter === f
                            ? 'bg-amber-500/10 border-amber-500/15 text-amber-400/90'
                            : 'bg-white/[0.02] border-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* AI Recommendation Banner */}
            <div className="mb-5 rounded-[16px] p-4 bg-gradient-to-r from-amber-900/15 to-orange-900/5 border border-amber-500/8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.04] blur-[60px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[10px] bg-amber-500/[0.12] border border-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                    </div>
                    <p className="text-[12px] text-white/60 leading-relaxed">
                        Based on your constellation, we recommend therapists specializing in{' '}
                        <span className="text-amber-400/90 font-semibold">Career Anxiety</span> and{' '}
                        <span className="text-amber-400/90 font-semibold">Burnout Recovery</span>.
                    </p>
                </div>
            </div>

            {/* Therapist Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {therapists.map((therapist) => {
                    return (
                        <div
                            key={therapist.id}
                            className="relative rounded-[18px] p-5 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.035] hover:border-white/[0.07] transition-all duration-400 group overflow-hidden hover:-translate-y-0.5"
                        >
                            {/* Match Badge */}
                            {therapist.matchScore >= 90 && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.06]">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-400/70" />
                                    <span className="text-[9px] text-amber-400/80 font-semibold">{therapist.matchScore}% Match</span>
                                </div>
                            )}

                            {/* Avatar + Info */}
                            <div className="flex items-start gap-3.5 mb-3.5">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/[0.06]">
                                        <img src={therapist.avatar} alt={therapist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {therapist.isOnline && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#070709] flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[14px] font-semibold text-white/85">{therapist.name}</h3>
                                    <p className="text-[10px] text-white/35 mt-0.5">{therapist.title} · {therapist.experience}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Star className="w-2.5 h-2.5 text-amber-400/60 fill-amber-400/60" />
                                        <span className="text-[10px] text-white/50 font-medium">{therapist.rating}</span>
                                        <span className="text-[10px] text-white/20">({therapist.reviews})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Specializations */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {therapist.specializations.map((spec) => (
                                    <span key={spec} className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.04] text-[9px] text-white/40 font-medium">
                                        {spec}
                                    </span>
                                ))}
                            </div>

                            {/* Session Types */}
                            <div className="flex items-center gap-3 mb-3.5">
                                {therapist.sessionTypes.map((type) => {
                                    const Icon = sessionTypeIcons[type];
                                    return (
                                        <div key={type} className="flex items-center gap-1" title={sessionTypeLabels[type]}>
                                            <Icon className="w-2.5 h-2.5 text-white/20" />
                                            <span className="text-[9px] text-white/20">{sessionTypeLabels[type]}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.04]">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Clock className="w-2.5 h-2.5 text-emerald-400/50" />
                                        <span className="text-[10px] text-emerald-400/70 font-medium">{therapist.nextAvailable}</span>
                                    </div>
                                    <span className="text-[11px] text-white/50 font-semibold">₹{therapist.price.toLocaleString()}<span className="text-white/20 font-normal">/session</span></span>
                                </div>
                                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/60 hover:to-orange-800/30 text-white/80 font-semibold text-[11px] hover:text-white transition-all border border-amber-500/10 hover:border-amber-500/15 shadow-[0_0_30px_rgba(180,120,40,0.08)]">
                                    Book Now
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {therapists.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-[14px] text-white/30">No therapists found matching your criteria.</p>
                    <button
                        onClick={() => { onFilterChange('all'); onSearchChange(''); }}
                        className="mt-3 text-[12px] text-amber-500/60 hover:text-amber-400 transition-colors font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ History Panel ━━━━━━━━━━━━━━━━━━━━ */
function HistoryPanel({ sessions }: { sessions: PastSession[] }) {
    return (
        <div>
            {/* Session History Header */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-[12px] text-white/30">
                    <span className="text-white/50 font-semibold">{sessions.length}</span> recent sessions shown
                </p>
                <button className="text-[11px] text-amber-500/50 hover:text-amber-400 font-medium transition-colors">
                    View All History
                </button>
            </div>

            <div className="space-y-2">
                {sessions.map((session) => {
                    const SessionIcon = sessionTypeIcons[session.sessionType];
                    return (
                        <div
                            key={session.id}
                            className="rounded-[16px] p-4 bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.06] transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.06] flex-shrink-0">
                                    <img src={session.avatar} alt={session.therapistName} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[13px] font-semibold text-white/70">{session.therapistName}</h4>
                                        <span className="text-[9px] text-white/20">·</span>
                                        <span className="text-[10px] text-white/25">{session.date}</span>
                                    </div>
                                    <p className="text-[11px] text-white/30 mt-0.5 truncate">{session.topic}</p>
                                </div>

                                {/* Meta */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="hidden sm:flex items-center gap-1.5">
                                        <SessionIcon className="w-3 h-3 text-white/20" />
                                        <span className="text-[10px] text-white/25">{session.duration}</span>
                                    </div>

                                    {/* Rating */}
                                    {session.rating && (
                                        <div className="hidden sm:flex items-center gap-1">
                                            {Array.from({ length: session.rating }).map((_, i) => (
                                                <Star key={i} className="w-2.5 h-2.5 text-amber-400/50 fill-amber-400/50" />
                                            ))}
                                        </div>
                                    )}

                                    {/* Summary Button */}
                                    {session.hasSummary ? (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/40 hover:text-white/60 text-[10px] font-medium transition-all border border-white/[0.04]">
                                            <FileText className="w-3 h-3" />
                                            Summary
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1.5 rounded-full bg-white/[0.02] text-white/20 text-[10px] font-medium border border-white/[0.03]">
                                            No summary
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Monthly Summary Card */}
            <div className="mt-5 rounded-[18px] p-5 bg-gradient-to-br from-purple-900/10 to-blue-900/5 border border-purple-500/8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/[0.04] blur-[60px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <CircleDot className="w-3.5 h-3.5 text-purple-400/60" />
                        <span className="text-[11px] text-white/40 font-medium">February Summary</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <span className="text-[20px] font-bold text-purple-400/80">8</span>
                            <p className="text-[10px] text-white/25 mt-0.5">Sessions</p>
                        </div>
                        <div>
                            <span className="text-[20px] font-bold text-blue-400/80">6.4</span>
                            <p className="text-[10px] text-white/25 mt-0.5">Avg Hours</p>
                        </div>
                        <div>
                            <span className="text-[20px] font-bold text-amber-400/80">4.8</span>
                            <p className="text-[10px] text-white/25 mt-0.5">Avg Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
