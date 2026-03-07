import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect, useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Calendar,
    Clock,
    Star,
    Search,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Play,
    FileText,
    CalendarDays,
    Timer,
    Users,
    CircleDot,
    X,
    Zap,
    Shield,
    Loader2,
} from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { TherapistCard, SessionDetail, TherapyJourney, TimeSlot } from '@/types/therapy.types';

/* ━━━━━━━━━━━━━━━━━━━━ Helpers ━━━━━━━━━━━━━━━━━━━━ */
function SkeletonPulse({ className }: { className?: string }) {
    return <div className={`bg-white/[0.06] animate-pulse rounded-md ${className ?? ''}`} />;
}

function SkeletonCard() {
    return (
        <div className="rounded-[18px] p-5 bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-start gap-3.5 mb-3.5">
                <SkeletonPulse className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <SkeletonPulse className="h-4 w-32" />
                    <SkeletonPulse className="h-3 w-48" />
                    <SkeletonPulse className="h-3 w-20" />
                </div>
            </div>
            <div className="flex gap-1.5 mb-3">
                <SkeletonPulse className="h-5 w-16 rounded-full" />
                <SkeletonPulse className="h-5 w-20 rounded-full" />
                <SkeletonPulse className="h-5 w-14 rounded-full" />
            </div>
            <SkeletonPulse className="h-10 w-full rounded-full mt-4" />
        </div>
    );
}

/** Safely unwrap paginated API response — backend uses different property names */
function unwrapList<T>(payload: unknown): T[] {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload as T[];
    const obj = payload as Record<string, unknown>;
    for (const key of ['data', 'sessions', 'therapists', 'items']) {
        if (Array.isArray(obj[key])) return obj[key] as T[];
    }
    return [];
}

function formatAvailability(nextSlot: string | null): { label: string; urgent: boolean } {
    if (!nextSlot) return { label: 'Check availability', urgent: false };
    const diff = new Date(nextSlot).getTime() - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (hours <= 0) return { label: 'Available now', urgent: true };
    if (hours <= 24) {
        const d = new Date(nextSlot);
        return { label: `Available today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, urgent: true };
    }
    if (hours <= 48) return { label: 'Available tomorrow', urgent: false };
    return { label: `Next slot in ${Math.ceil(hours / 24)} days`, urgent: false };
}

function formatCountdown(scheduledAt: string): string {
    const diff = new Date(scheduledAt).getTime() - Date.now();
    if (diff <= 0) return 'Starting now';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Starts in ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Starts in ${hours}h ${mins % 60}m`;
    const days = Math.floor(hours / 24);
    return `In ${days} day${days > 1 ? 's' : ''}`;
}

function isStartingSoonSession(scheduledAt: string): boolean {
    const diff = new Date(scheduledAt).getTime() - Date.now();
    return diff > 0 && diff <= 30 * 60 * 1000;
}

function getSessionTypeBadge(type: string, price: number) {
    switch (type) {
        case 'discovery':
            return { label: 'Free · 15 min', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' };
        case 'pay_as_you_like':
            return { label: 'Pay what you feel · 45 min', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/15' };
        default:
            return { label: `₹${price.toLocaleString()} · 45 min`, cls: 'bg-white/[0.04] text-white/60 border-white/[0.06]' };
    }
}

function formatSlotDate(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

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
type Tab = 'find' | 'upcoming' | 'history';

/* ━━━━━━━━━━━━━━━━━━━━ Main Component ━━━━━━━━━━━━━━━━━━━━ */
export default function SessionsPage() {
    useDocumentTitle('Sessions');
    const navigate = useNavigate();

    /* ── API data ── */
    const [recommended, setRecommended] = useState<TherapistCard[]>([]);
    const [availableNow, setAvailableNow] = useState<TherapistCard[]>([]);
    const [allTherapists, setAllTherapists] = useState<TherapistCard[]>([]);
    const [scheduled, setScheduled] = useState<SessionDetail[]>([]);
    const [completed, setCompleted] = useState<SessionDetail[]>([]);
    const [journey, setJourney] = useState<TherapyJourney | null>(null);
    const [loading, setLoading] = useState(true);

    /* ── UI state ── */
    const [activeTab, setActiveTab] = useState<Tab>('find');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    /* ── Booking flow ── */
    const [bookingTherapist, setBookingTherapist] = useState<TherapistCard | null>(null);
    const [bookingSlots, setBookingSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [bookingStep, setBookingStep] = useState<'slots' | 'confirm' | 'done'>('slots');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [talkNowLoading, setTalkNowLoading] = useState(false);

    /* ── Data fetching ── */
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [recRes, nowRes, schedRes, compRes, jrnRes] = await Promise.all([
                therapyApi.getRecommendedTherapists(),
                therapyApi.getAvailableNowTherapists(),
                therapyApi.listSessions({ status: 'SCHEDULED', pageSize: 50 }),
                therapyApi.listSessions({ status: 'COMPLETED', pageSize: 50 }),
                therapyApi.getUserJourney(),
            ]);
            if (recRes.success && recRes.data) setRecommended(recRes.data as TherapistCard[]);
            if (nowRes.success && nowRes.data) setAvailableNow(nowRes.data as TherapistCard[]);
            if (schedRes.success && schedRes.data) setScheduled(unwrapList<SessionDetail>(schedRes.data));
            if (compRes.success && compRes.data) setCompleted(unwrapList<SessionDetail>(compRes.data));
            if (jrnRes.success && jrnRes.data) setJourney(jrnRes.data as TherapyJourney);
        } catch { /* sections show empty states */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* ── Filtered therapist fetch (debounced) ── */
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const params: Record<string, string | number> = { pageSize: 20 };
                if (selectedFilter) params.specialization = selectedFilter;
                const res = await therapyApi.listTherapists(params);
                if (res.success && res.data) {
                    let items = unwrapList<TherapistCard>(res.data);
                    if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        items = items.filter(t =>
                            t.name.toLowerCase().includes(q) ||
                            t.specializations.some(s => s.toLowerCase().includes(q))
                        );
                    }
                    setAllTherapists(items);
                }
            } catch { /* */ }
        }, 300);
        return () => clearTimeout(timer);
    }, [selectedFilter, searchQuery]);

    /* ── Booking handlers ── */
    const openBooking = async (therapist: TherapistCard) => {
        setBookingTherapist(therapist);
        setBookingStep('slots');
        setSelectedSlot(null);
        setBookingSlots([]);
        setSlotsLoading(true);
        try {
            const res = await therapyApi.getTherapistSlots(therapist.therapistId);
            if (res.success && res.data) setBookingSlots(res.data as TimeSlot[]);
        } catch { /* */ }
        finally { setSlotsLoading(false); }
    };

    const confirmBooking = async () => {
        if (!bookingTherapist || !selectedSlot) return;
        setBookingLoading(true);
        try {
            const res = await therapyApi.bookSession({
                therapistId: bookingTherapist.therapistId,
                scheduledAt: selectedSlot.startDateTime,
                sessionType: journey?.pricingStage ?? 'discovery',
                bookingSource: 'sessions_page',
            });
            if (res.success) {
                setBookingStep('done');
                const schedRes = await therapyApi.listSessions({ status: 'SCHEDULED', pageSize: 50 });
                if (schedRes.success && schedRes.data) setScheduled(unwrapList<SessionDetail>(schedRes.data));
            }
        } catch { /* */ }
        finally { setBookingLoading(false); }
    };

    const handleTalkNow = async () => {
        setTalkNowLoading(true);
        try {
            const res = await therapyApi.bookInstantSession();
            if (res.success && res.data) {
                const session = res.data as SessionDetail;
                navigate(`/dashboard/sessions/${session.id}`);
            }
        } catch { /* */ }
        finally { setTalkNowLoading(false); }
    };

    const closeBooking = () => {
        setBookingTherapist(null);
        setBookingSlots([]);
        setSelectedSlot(null);
        setBookingStep('slots');
    };

    const isDiscoveryEligible = !journey || journey.completedSessionCount === 0;
    const isPAYLStage = journey?.pricingStage === 'pay_as_you_like' && (journey?.completedSessionCount ?? 0) > 0;

    const filters = ['Anxiety', 'Depression', 'Relationships', 'Stress', 'Burnout', 'Mindfulness', 'Self-Esteem'];

    const tabs: { key: Tab; label: string; icon: typeof Calendar; count?: number }[] = [
        { key: 'find', label: 'Find a Guide', icon: Users },
        { key: 'upcoming', label: 'Upcoming', icon: CalendarDays, count: scheduled.length },
        { key: 'history', label: 'History', icon: Clock, count: completed.length },
    ];

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="w-full pb-16"
        >
            {/* ── Discovery Banner ── */}
            {!loading && isDiscoveryEligible && (
                <motion.div variants={fadeUp} className="mb-5 rounded-[20px] p-5 sm:p-6 bg-gradient-to-r from-emerald-900/15 via-emerald-900/8 to-teal-900/5 border border-emerald-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/[0.04] blur-[80px] rounded-full pointer-events-none" />
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-white/90 mb-1">Your first call is free</h3>
                            <p className="text-[12px] text-white/50 leading-relaxed max-w-md">
                                15 minutes to see if it clicks. No commitment, no payment — just a genuine conversation with a Soul Guide who gets it.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── PAYL Conversion Banner ── */}
            {!loading && isPAYLStage && (
                <motion.div variants={fadeUp} className="mb-5 rounded-[20px] p-5 sm:p-6 bg-gradient-to-r from-blue-900/15 via-blue-900/8 to-indigo-900/5 border border-blue-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/[0.04] blur-[80px] rounded-full pointer-events-none" />
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-white/90 mb-1">Want to go deeper?</h3>
                            <p className="text-[12px] text-white/50 leading-relaxed max-w-md">
                                Your next call is pay-what-you-feel. You choose the price — we believe in making support accessible.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── Header ── */}
            <motion.div variants={fadeUp} className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-[26px] sm:text-[30px] font-bold text-white/90 tracking-[-0.03em] mb-1.5">
                        Sessions
                    </h1>
                    <p className="text-[13px] text-white/35 max-w-lg leading-relaxed">
                        Connect with a Soul Guide, manage upcoming sessions, and review your journey.
                    </p>
                </div>
                <button
                    onClick={handleTalkNow}
                    disabled={talkNowLoading}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600/30 to-emerald-700/15 hover:from-emerald-500/40 hover:to-emerald-600/25 text-emerald-400 font-semibold text-[12px] transition-all border border-emerald-500/15 hover:border-emerald-500/25 shadow-[0_0_30px_rgba(16,185,129,0.08)] disabled:opacity-50"
                >
                    {talkNowLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Talk Now
                </button>
            </motion.div>

            {/* ── Quick Stats ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                {[
                    { label: 'Upcoming', value: loading ? '—' : String(scheduled.length), icon: CalendarDays, accent: 'text-emerald-400', bg: 'from-emerald-900/15 to-emerald-900/5', border: 'border-emerald-500/8' },
                    { label: 'Completed', value: loading ? '—' : String(journey?.completedSessionCount ?? completed.length), icon: CheckCircle2, accent: 'text-blue-400', bg: 'from-blue-900/15 to-blue-900/5', border: 'border-blue-500/8' },
                    { label: 'Active Guides', value: loading ? '—' : String(journey?.activeTherapistCount ?? 0), icon: Users, accent: 'text-amber-400', bg: 'from-amber-900/15 to-amber-900/5', border: 'border-amber-500/8' },
                    { label: 'Invested', value: loading ? '—' : `₹${(journey?.totalSpent ?? 0).toLocaleString()}`, icon: Timer, accent: 'text-purple-400', bg: 'from-purple-900/15 to-purple-900/5', border: 'border-purple-500/8' },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-[16px] p-4 bg-gradient-to-br ${stat.bg} border ${stat.border} relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] blur-[30px] rounded-full" />
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-3.5 h-3.5 ${stat.accent} opacity-70`} />
                            <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">{stat.label}</span>
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
                            : 'text-white/50 hover:text-white/60 hover:bg-white/[0.03]'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-white/[0.05] text-white/50'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </motion.div>

            {/* ── Panel Content ── */}
            <AnimatePresence mode="wait">
                {activeTab === 'find' && (
                    <motion.div key="find" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        <FindGuidePanel
                            recommended={recommended}
                            availableNow={availableNow}
                            allTherapists={allTherapists}
                            filters={filters}
                            selectedFilter={selectedFilter}
                            searchQuery={searchQuery}
                            onFilterChange={setSelectedFilter}
                            onSearchChange={setSearchQuery}
                            onSelectTherapist={openBooking}
                            isDiscoveryEligible={isDiscoveryEligible}
                            loading={loading}
                        />
                    </motion.div>
                )}

                {activeTab === 'upcoming' && (
                    <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        <UpcomingPanel
                            sessions={scheduled}
                            loading={loading}
                            onBookNew={() => setActiveTab('find')}
                        />
                    </motion.div>
                )}

                {activeTab === 'history' && (
                    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        <HistoryPanel sessions={completed} loading={loading} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Booking Modal ── */}
            <AnimatePresence>
                {bookingTherapist && (
                    <BookingModal
                        therapist={bookingTherapist}
                        slots={bookingSlots}
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                        step={bookingStep}
                        onConfirm={() => { setBookingStep('confirm'); }}
                        onBook={confirmBooking}
                        onClose={closeBooking}
                        loading={bookingLoading}
                        slotsLoading={slotsLoading}
                        journey={journey}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ Therapist Card (shared) ━━━━━━━━━━━━━━━━━━━━ */
function TherapistCardUI({ therapist, onSelect, isDiscoveryEligible }: { therapist: TherapistCard; onSelect: (t: TherapistCard) => void; isDiscoveryEligible: boolean }) {
    const avail = formatAvailability(therapist.nextAvailableSlot);
    const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(therapist);
        }
    };
    return (
        <div
            className="relative rounded-[18px] p-5 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.035] hover:border-white/[0.07] transition-all duration-400 group overflow-hidden hover:-translate-y-0.5 cursor-pointer"
            onClick={() => onSelect(therapist)}
            onKeyDown={handleCardKeyDown}
            role="button"
            tabIndex={0}
        >
            {/* Match Badge */}
            {therapist.matchScore >= 70 && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.06]">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400/70" />
                    <span className="text-[9px] text-amber-400/80 font-semibold">{therapist.matchScore}% Match</span>
                </div>
            )}

            {/* Discovery Badge */}
            {isDiscoveryEligible && (
                <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-[8px] text-emerald-400 font-semibold">Free 15 min call</span>
                </div>
            )}

            {/* Avatar + Info */}
            <div className={`flex items-start gap-3.5 mb-3.5 ${isDiscoveryEligible ? 'mt-5' : ''}`}>
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/[0.06]">
                        {therapist.photoUrl ? (
                            <img src={therapist.photoUrl} alt={therapist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center">
                                <span className="text-[16px] font-bold text-amber-400/60">{therapist.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    {therapist.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#070709] flex items-center justify-center">
                            <div className="relative">
                                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/40 animate-ping" />
                                <span className="block w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-white/85">{therapist.name}</h3>
                    <p className="text-[10px] text-white/35 mt-0.5">{therapist.experience} yrs experience · {therapist.approach}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-2.5 h-2.5 text-amber-400/60 fill-amber-400/60" />
                        <span className="text-[10px] text-white/50 font-medium">{therapist.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-white/20">({therapist.totalReviews})</span>
                    </div>
                </div>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
                {therapist.specializations.slice(0, 4).map((spec) => (
                    <span key={spec} className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.04] text-[9px] text-white/50 font-medium">
                        {spec}
                    </span>
                ))}
            </div>

            {/* Social Proof + Trust */}
            <div className="flex items-center gap-3 mb-3.5 flex-wrap">
                <div className="flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-white/20" />
                    <span className="text-[9px] text-white/40">Helped {therapist.totalSessions}+ people</span>
                </div>
                {therapist.totalSessions > 0 && (
                    <div className="flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5 text-white/20" />
                        <span className="text-[9px] text-white/40">{Math.min(98, Math.round((therapist.totalReviews / Math.max(1, therapist.totalSessions)) * 100))}% return rate</span>
                    </div>
                )}
                {therapist.qualifications.length > 0 && (
                    <span className="text-[9px] text-white/25 truncate max-w-[120px]">{therapist.qualifications[0]}</span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.04]">
                <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Clock className={`w-2.5 h-2.5 ${avail.urgent ? 'text-emerald-400/50' : 'text-white/20'}`} />
                        <span className={`text-[10px] font-medium ${avail.urgent ? 'text-emerald-400/70' : 'text-white/40'}`}>{avail.label}</span>
                    </div>
                    {isDiscoveryEligible ? (
                        <span className="text-[11px] text-emerald-400/80 font-semibold">Free Discovery Call</span>
                    ) : (
                        <span className="text-[11px] text-white/50 font-semibold">₹{therapist.pricePerSession.toLocaleString()}<span className="text-white/20 font-normal">/session</span></span>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(therapist); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/60 hover:to-orange-800/30 text-white/80 font-semibold text-[11px] hover:text-white transition-all border border-amber-500/10 hover:border-amber-500/15 shadow-[0_0_30px_rgba(180,120,40,0.08)]"
                >
                    Connect
                    <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ Find Guide Panel ━━━━━━━━━━━━━━━━━━━━ */
function FindGuidePanel({
    recommended,
    availableNow,
    allTherapists,
    filters,
    selectedFilter,
    searchQuery,
    onFilterChange,
    onSearchChange,
    onSelectTherapist,
    isDiscoveryEligible,
    loading,
}: {
    recommended: TherapistCard[];
    availableNow: TherapistCard[];
    allTherapists: TherapistCard[];
    filters: string[];
    selectedFilter: string;
    searchQuery: string;
    onFilterChange: (f: string) => void;
    onSearchChange: (q: string) => void;
    onSelectTherapist: (t: TherapistCard) => void;
    isDiscoveryEligible: boolean;
    loading: boolean;
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
                    <button onClick={() => onSearchChange('')} title="Clear search" aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-3.5 h-3.5 text-white/20 hover:text-white/40 transition-colors" />
                    </button>
                )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto hide-scrollbar pb-1">
                <button
                    onClick={() => onFilterChange('')}
                    className={`px-4 py-2 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all duration-300 ${!selectedFilter
                        ? 'bg-amber-500/10 border-amber-500/15 text-amber-400/90'
                        : 'bg-white/[0.02] border-white/[0.04] text-white/50 hover:text-white/60 hover:bg-white/[0.04]'
                        }`}
                >
                    All
                </button>
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f === selectedFilter ? '' : f)}
                        className={`px-4 py-2 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all duration-300 ${selectedFilter === f
                            ? 'bg-amber-500/10 border-amber-500/15 text-amber-400/90'
                            : 'bg-white/[0.02] border-white/[0.04] text-white/50 hover:text-white/60 hover:bg-white/[0.04]'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <>
                    {/* Available Now Strip */}
                    {availableNow.length > 0 && !selectedFilter && !searchQuery && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative">
                                    <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />
                                    <span className="block w-2 h-2 rounded-full bg-emerald-400" />
                                </div>
                                <h3 className="text-[13px] font-semibold text-white/70">Available Now</h3>
                                <span className="text-[10px] text-white/25">· connect instantly</span>
                            </div>
                            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                                {availableNow.slice(0, 5).map((t) => (
                                    <button
                                        key={t.therapistId}
                                        onClick={() => onSelectTherapist(t)}
                                        className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-[14px] bg-emerald-900/[0.06] border border-emerald-500/[0.06] hover:bg-emerald-900/[0.12] hover:border-emerald-500/[0.12] transition-all"
                                    >
                                        <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/20 flex-shrink-0">
                                            {t.photoUrl ? (
                                                <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-emerald-900/30 flex items-center justify-center">
                                                    <span className="text-[12px] font-bold text-emerald-400/60">{t.name.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[12px] font-semibold text-white/80 whitespace-nowrap">{t.name}</p>
                                            <p className="text-[9px] text-emerald-400/60">{t.specializations[0] ?? 'Wellness Guide'}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommended for You */}
                    {recommended.length > 0 && !selectedFilter && !searchQuery && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
                                <h3 className="text-[13px] font-semibold text-white/70">Recommended for You</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {recommended.slice(0, 4).map((t) => (
                                    <TherapistCardUI key={t.therapistId} therapist={t} onSelect={onSelectTherapist} isDiscoveryEligible={isDiscoveryEligible} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All / Filtered Guides */}
                    {allTherapists.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-3.5 h-3.5 text-white/30" />
                                <h3 className="text-[13px] font-semibold text-white/70">
                                    {selectedFilter || searchQuery ? 'Results' : 'Browse Wellness Guides'}
                                </h3>
                                <span className="text-[10px] text-white/25">· {allTherapists.length} guide{allTherapists.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {allTherapists.map((t) => (
                                    <TherapistCardUI key={t.therapistId} therapist={t} onSelect={onSelectTherapist} isDiscoveryEligible={isDiscoveryEligible} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {allTherapists.length === 0 && recommended.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-[14px] text-white/50">No Wellness Guides found matching your criteria.</p>
                            <button
                                onClick={() => { onFilterChange(''); onSearchChange(''); }}
                                className="mt-3 text-[12px] text-amber-500/60 hover:text-amber-400 transition-colors font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ Upcoming Panel ━━━━━━━━━━━━━━━━━━━━ */
function UpcomingPanel({ sessions, loading, onBookNew }: { sessions: SessionDetail[]; loading: boolean; onBookNew: () => void }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-[18px] p-5 bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-4 mb-4">
                            <SkeletonPulse className="w-14 h-14 rounded-full" />
                            <div className="space-y-2 flex-1"><SkeletonPulse className="h-4 w-40" /><SkeletonPulse className="h-3 w-32" /></div>
                        </div>
                        <SkeletonPulse className="h-10 w-full rounded-full" />
                    </div>
                ))}
            </div>
        );
    }

    // Sort: soonest first
    const sorted = [...sessions].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    const startingSoon = sorted.filter(s => isStartingSoonSession(s.scheduledAt));
    const other = sorted.filter(s => !startingSoon.includes(s));

    return (
        <div className="space-y-3">
            {/* Starting Soon — hero cards */}
            {startingSoon.map(session => {
                const badge = getSessionTypeBadge(session.sessionType, session.priceAtBooking);
                return (
                    <div
                        key={session.id}
                        className="relative rounded-[20px] p-6 bg-gradient-to-br from-emerald-900/[0.12] via-emerald-900/[0.06] to-transparent border border-emerald-500/[0.08] overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/[0.04] blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-emerald-500/[0.02] blur-[50px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex items-center justify-center">
                                        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Session Starting Soon</span>
                                </div>
                                <span className="text-[12px] text-white/50 font-medium">{formatCountdown(session.scheduledAt)}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/20 flex-shrink-0">
                                    {session.therapist.photoUrl ? (
                                        <img src={session.therapist.photoUrl} alt={session.therapist.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-900/30 flex items-center justify-center">
                                            <span className="text-[18px] font-bold text-emerald-400/60">{session.therapist.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[16px] font-semibold text-white/90">{session.therapist.name}</h3>
                                    <p className="text-[12px] text-white/50">{session.therapist.specializations.join(', ')}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                                        <div className="flex items-center gap-1.5">
                                            <Timer className="w-3 h-3 text-white/25" />
                                            <span className="text-[10px] text-white/50">{session.duration} min</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
            {other.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {other.map(session => {
                        const badge = getSessionTypeBadge(session.sessionType, session.priceAtBooking);
                        const countdown = formatCountdown(session.scheduledAt);
                        const date = new Date(session.scheduledAt);
                        return (
                            <div
                                key={session.id}
                                className="rounded-[18px] p-5 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.035] hover:border-white/[0.07] transition-all duration-400 group hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-between mb-3.5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                                    <span className="text-[11px] text-white/50 font-medium">{formatSlotDate(session.scheduledAt)}</span>
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.06] flex-shrink-0">
                                        {session.therapist.photoUrl ? (
                                            <img src={session.therapist.photoUrl} alt={session.therapist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center">
                                                <span className="text-[13px] font-bold text-amber-400/60">{session.therapist.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-semibold text-white/80">{session.therapist.name}</h4>
                                        <p className="text-[10px] text-white/50">{session.therapist.specializations.slice(0, 2).join(', ')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-white/20" />
                                        <span className="text-[11px] text-white/50">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Timer className="w-3 h-3 text-white/20" />
                                        <span className="text-[11px] text-white/50">{session.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays className="w-3 h-3 text-amber-400/30" />
                                        <span className="text-[10px] text-amber-400/60 font-medium">{countdown}</span>
                                    </div>
                                </div>

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
            )}

            {/* Empty State */}
            {sessions.length === 0 && (
                <div className="py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="w-5 h-5 text-white/20" />
                    </div>
                    <p className="text-[14px] text-white/50 mb-1">No upcoming sessions</p>
                    <p className="text-[12px] text-white/30 mb-4">Book a session with a Wellness Guide to get started</p>
                </div>
            )}

            {/* Book New CTA */}
            <div className="mt-2">
                <button
                    onClick={onBookNew}
                    className="w-full rounded-[16px] p-4 bg-white/[0.015] border border-dashed border-white/[0.06] hover:border-amber-500/15 hover:bg-white/[0.025] transition-all flex items-center justify-center gap-2 text-white/50 hover:text-amber-400/70 group"
                >
                    <span className="w-6 h-6 rounded-full bg-white/[0.04] group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[12px] font-medium">Connect with a Soul Guide</span>
                </button>
            </div>
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ History Panel ━━━━━━━━━━━━━━━━━━━━ */
function HistoryPanel({ sessions, loading }: { sessions: SessionDetail[]; loading: boolean }) {
    if (loading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-[16px] p-4 bg-white/[0.015] border border-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <SkeletonPulse className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2"><SkeletonPulse className="h-3 w-40" /><SkeletonPulse className="h-3 w-56" /></div>
                            <SkeletonPulse className="h-7 w-20 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Compute summary stats
    const avgRating = sessions.length > 0
        ? sessions.filter(s => s.userRating).reduce((sum, s) => sum + (s.userRating ?? 0), 0) / Math.max(1, sessions.filter(s => s.userRating).length)
        : 0;
    const totalHours = sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0) / 60;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-[12px] text-white/50">
                    <span className="text-white/50 font-semibold">{sessions.length}</span> completed session{sessions.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="space-y-2">
                {sessions.map((session) => {
                    const badge = getSessionTypeBadge(session.sessionType, session.priceAtBooking);
                    const date = new Date(session.scheduledAt);
                    return (
                        <div
                            key={session.id}
                            className="rounded-[16px] p-4 bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.06] transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.06] flex-shrink-0">
                                    {session.therapist.photoUrl ? (
                                        <img src={session.therapist.photoUrl} alt={session.therapist.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center">
                                            <span className="text-[13px] font-bold text-amber-400/40">{session.therapist.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[13px] font-semibold text-white/70">{session.therapist.name}</h4>
                                        <span className="text-[9px] text-white/20">·</span>
                                        <span className="text-[10px] text-white/25">{date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                                        <span className="text-[10px] text-white/25">{session.duration} min</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {session.userRating && (
                                        <div className="hidden sm:flex items-center gap-1">
                                            {Array.from({ length: session.userRating }).map((_, i) => (
                                                <Star key={i} className="w-2.5 h-2.5 text-amber-400/50 fill-amber-400/50" />
                                            ))}
                                        </div>
                                    )}

                                    {session.userFeedback ? (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/60 text-[10px] font-medium transition-all border border-white/[0.04]">
                                            <FileText className="w-3 h-3" />
                                            Notes
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1.5 rounded-full bg-white/[0.02] text-white/20 text-[10px] font-medium border border-white/[0.03]">
                                            No notes
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {sessions.length === 0 && (
                <div className="py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-5 h-5 text-white/20" />
                    </div>
                    <p className="text-[14px] text-white/50">No sessions yet</p>
                    <p className="text-[12px] text-white/30 mt-1">Your session history will appear here</p>
                </div>
            )}

            {/* Monthly Summary Card */}
            {sessions.length > 0 && (
                <div className="mt-5 rounded-[18px] p-5 bg-gradient-to-br from-purple-900/10 to-blue-900/5 border border-purple-500/8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/[0.04] blur-[60px] rounded-full pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <CircleDot className="w-3.5 h-3.5 text-purple-400/60" />
                            <span className="text-[11px] text-white/50 font-medium">Your Journey</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <span className="text-[20px] font-bold text-purple-400/80">{sessions.length}</span>
                                <p className="text-[10px] text-white/25 mt-0.5">Sessions</p>
                            </div>
                            <div>
                                <span className="text-[20px] font-bold text-blue-400/80">{totalHours.toFixed(1)}</span>
                                <p className="text-[10px] text-white/25 mt-0.5">Hours</p>
                            </div>
                            <div>
                                <span className="text-[20px] font-bold text-amber-400/80">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                                <p className="text-[10px] text-white/25 mt-0.5">Avg Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━ Booking Modal ━━━━━━━━━━━━━━━━━━━━ */
function BookingModal({
    therapist,
    slots,
    selectedSlot,
    onSelectSlot,
    step,
    onConfirm,
    onBook,
    onClose,
    loading,
    slotsLoading,
    journey,
}: {
    therapist: TherapistCard;
    slots: TimeSlot[];
    selectedSlot: TimeSlot | null;
    onSelectSlot: (s: TimeSlot) => void;
    step: 'slots' | 'confirm' | 'done';
    onConfirm: () => void;
    onBook: () => void;
    onClose: () => void;
    loading: boolean;
    slotsLoading: boolean;
    journey: TherapyJourney | null;
}) {
    const availableSlots = slots.filter(s => !s.isBooked);
    const sessionType = journey?.pricingStage ?? 'discovery';
    const badge = getSessionTypeBadge(sessionType, therapist.pricePerSession);

    // Group slots by date
    const slotsByDate = availableSlots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
        const key = slot.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(slot);
        return acc;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-[24px] bg-[#0c0c10] border border-white/[0.06] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/[0.04]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[16px] font-semibold text-white/90">
                            {step === 'done' ? 'Session Booked!' : step === 'confirm' ? 'Confirm Booking' : 'Select a Time'}
                        </h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors">
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    </div>

                    {/* Therapist mini card */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.06]">
                            {therapist.photoUrl ? (
                                <img src={therapist.photoUrl} alt={therapist.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center">
                                    <span className="text-[13px] font-bold text-amber-400/60">{therapist.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-white/80">{therapist.name}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {step === 'slots' && (
                        <>
                            {slotsLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i}><SkeletonPulse className="h-4 w-24 mb-2" /><div className="flex gap-2"><SkeletonPulse className="h-9 w-20 rounded-full" /><SkeletonPulse className="h-9 w-20 rounded-full" /><SkeletonPulse className="h-9 w-20 rounded-full" /></div></div>
                                    ))}
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-[13px] text-white/50">No available slots right now</p>
                                    <p className="text-[11px] text-white/30 mt-1">Check back later or try another guide</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                                        <div key={date}>
                                            <p className="text-[11px] text-white/40 font-medium mb-2">{formatSlotDate(date)}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {dateSlots.map((slot) => {
                                                    const isSelected = selectedSlot?.startDateTime === slot.startDateTime;
                                                    return (
                                                        <button
                                                            key={slot.startDateTime}
                                                            onClick={() => onSelectSlot(slot)}
                                                            className={`px-4 py-2 rounded-full text-[11px] font-medium border transition-all ${isSelected
                                                                ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                                                                : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white/80'
                                                                }`}
                                                        >
                                                            {slot.startTime}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {step === 'confirm' && selectedSlot && (
                        <div className="space-y-4">
                            <div className="rounded-[14px] p-4 bg-white/[0.03] border border-white/[0.04] space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/40">Date</span>
                                    <span className="text-[12px] text-white/70 font-medium">{formatSlotDate(selectedSlot.date)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/40">Time</span>
                                    <span className="text-[12px] text-white/70 font-medium">{selectedSlot.startTime} – {selectedSlot.endTime}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/40">Type</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/40">Price</span>
                                    <span className="text-[12px] text-white/70 font-medium">
                                        {sessionType === 'discovery' ? 'Free' : sessionType === 'pay_as_you_like' ? 'You choose' : `₹${therapist.pricePerSession.toLocaleString()}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'done' && (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <p className="text-[15px] font-semibold text-white/90 mb-1">You're all set!</p>
                            <p className="text-[12px] text-white/50">Your session with {therapist.name} has been booked. You'll receive a confirmation shortly.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-white/[0.04]">
                    {step === 'slots' && (
                        <button
                            onClick={onConfirm}
                            disabled={!selectedSlot}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/60 hover:to-orange-800/30 text-white/80 font-semibold text-[13px] hover:text-white transition-all border border-amber-500/10 hover:border-amber-500/15 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    )}
                    {step === 'confirm' && (
                        <button
                            onClick={onBook}
                            disabled={loading}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-600/40 to-emerald-700/20 hover:from-emerald-500/50 hover:to-emerald-600/30 text-white/90 font-semibold text-[13px] transition-all border border-emerald-500/15 hover:border-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Confirm Booking
                        </button>
                    )}
                    {step === 'done' && (
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white/70 font-semibold text-[13px] transition-all border border-white/[0.06]"
                        >
                            Done
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
