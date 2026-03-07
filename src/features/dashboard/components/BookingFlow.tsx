import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    X,
    Loader2,
    CheckCircle2,
    Calendar,
    Clock,
    Star,
    Sparkles,
    Shield,
    Users,
    ArrowLeft,
    ExternalLink,
    Zap,
} from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { TherapistCard, TimeSlot, TherapyJourney, SessionDetail } from '@/types/therapy.types';

/* ━━━━━━━━━━━━━━━━━━━━ Props ━━━━━━━━━━━━━━━━━━━━ */

export interface BookingFlowProps {
    /** Pre-selected therapist to book with */
    therapist: TherapistCard;
    /** Called when the modal closes (dismissed or after booking) */
    onClose: () => void;
    /** Called after a booking is successfully created */
    onBooked?: (session: SessionDetail) => void;
    /** If true, skip slot selection and do an instant booking */
    instant?: boolean;
}

/* ━━━━━━━━━━━━━━━━━━━━ Helpers ━━━━━━━━━━━━━━━━━━━━ */

function SkeletonPulse({ className }: { className?: string }) {
    return <div className={`bg-white/[0.06] animate-pulse rounded-md ${className ?? ''}`} />;
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

/** Build a Google Calendar "Add to Calendar" URL */
function buildCalendarUrl(therapistName: string, scheduledAt: string, durationMin: number): string {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + durationMin * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Soul Yatri · Session with ${therapistName}`,
        dates: `${fmt(start)}/${fmt(end)}`,
        details: `Your wellness session with ${therapistName} on Soul Yatri.`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

type Step = 'slots' | 'confirm' | 'done';

/* ━━━━━━━━━━━━━━━━━━━━ Component ━━━━━━━━━━━━━━━━━━━━ */

export default function BookingFlow({ therapist, onClose, onBooked, instant }: BookingFlowProps) {
    const navigate = useNavigate();

    /* ── State ── */
    const [step, setStep] = useState<Step>('slots');
    const [journey, setJourney] = useState<TherapyJourney | null>(null);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [slotsLoading, setSlotsLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [instantLoading, setInstantLoading] = useState(false);
    const [bookedSession, setBookedSession] = useState<SessionDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    /* ── Derived ── */
    const sessionType = journey?.pricingStage ?? 'discovery';
    const badge = getSessionTypeBadge(sessionType, therapist.pricePerSession);
    const durationMin = sessionType === 'discovery' ? 15 : 45;
    const availableSlots = slots.filter(s => !s.isBooked);

    // Group available slots by date for the calendar view
    const slotsByDate = availableSlots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
        const key = slot.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(slot);
        return acc;
    }, {});

    // Limit to 7 days
    const dateKeys = Object.keys(slotsByDate).sort().slice(0, 7);

    /* ── Fetch journey + slots on mount ── */
    const fetchData = useCallback(async () => {
        setSlotsLoading(true);
        setError(null);
        try {
            const [jrnRes, slotsRes] = await Promise.all([
                therapyApi.getUserJourney(),
                therapyApi.getTherapistSlots(therapist.therapistId, undefined, 7),
            ]);
            if (jrnRes.success && jrnRes.data) setJourney(jrnRes.data as TherapyJourney);
            if (slotsRes.success && slotsRes.data) setSlots(slotsRes.data as TimeSlot[]);
        } catch {
            setError('Unable to load available times. Please try again.');
        } finally {
            setSlotsLoading(false);
        }
    }, [therapist.therapistId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── Instant booking auto-trigger ── */
    useEffect(() => {
        if (!instant) return;
        let cancelled = false;

        const doInstant = async () => {
            setInstantLoading(true);
            try {
                const res = await therapyApi.bookInstantSession({ therapistId: therapist.therapistId });
                if (!cancelled && res.success && res.data) {
                    const session = res.data as SessionDetail;
                    setBookedSession(session);
                    setStep('done');
                    onBooked?.(session);
                }
            } catch {
                if (!cancelled) setError('Instant booking failed. Please try selecting a time slot instead.');
            } finally {
                if (!cancelled) setInstantLoading(false);
            }
        };

        doInstant();
        return () => { cancelled = true; };
    }, [instant, therapist.therapistId, onBooked]);

    /* ── Book session ── */
    const handleBook = async () => {
        if (!selectedSlot) return;
        setBookingLoading(true);
        setError(null);
        try {
            const res = await therapyApi.bookSession({
                therapistId: therapist.therapistId,
                scheduledAt: selectedSlot.startDateTime,
                sessionType: sessionType,
                bookingSource: 'booking_flow',
            });
            if (res.success && res.data) {
                const session = res.data as SessionDetail;
                setBookedSession(session);
                setStep('done');
                onBooked?.(session);
            } else {
                setError('Booking failed. The slot may no longer be available.');
            }
        } catch {
            setError('Booking failed. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    /* ── Instant booking overlay ── */
    if (instant && instantLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm rounded-[24px] bg-[#0c0c10] border border-white/[0.06] p-8 text-center shadow-2xl"
                >
                    <div className="relative mx-auto mb-5 w-16 h-16">
                        <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                        <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-[15px] font-semibold text-white/90 mb-1">Finding you the perfect guide…</p>
                    <p className="text-[12px] text-white/40">Connecting with {therapist.name}</p>
                </motion.div>
            </motion.div>
        );
    }

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
                {/* ── Header ── */}
                <div className="p-6 pb-4 border-b border-white/[0.04]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {step === 'confirm' && (
                                <button
                                    onClick={() => setStep('slots')}
                                    className="p-1 rounded-full hover:bg-white/[0.06] transition-colors mr-1"
                                >
                                    <ArrowLeft className="w-4 h-4 text-white/40" />
                                </button>
                            )}
                            <h2 className="text-[16px] font-semibold text-white/90">
                                {step === 'done' ? 'Session Booked!' : step === 'confirm' ? 'Confirm Booking' : 'Select a Time'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors">
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    </div>

                    {/* Therapist mini card */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-white/[0.06] flex-shrink-0">
                            {therapist.photoUrl ? (
                                <img src={therapist.photoUrl} alt={therapist.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center">
                                    <span className="text-[14px] font-bold text-amber-400/60">{therapist.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white/80">{therapist.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 text-amber-400/60 fill-amber-400/60" />
                                    <span className="text-[10px] text-white/50">{therapist.rating.toFixed(1)}</span>
                                </div>
                                {therapist.matchScore >= 70 && (
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5 text-amber-400/50" />
                                        <span className="text-[9px] text-amber-400/60 font-medium">{therapist.matchScore}% match</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Trust strip */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Users className="w-2.5 h-2.5 text-white/20" />
                            <span className="text-[9px] text-white/35">Helped {therapist.totalSessions}+ people</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5 text-white/20" />
                            <span className="text-[9px] text-white/35">{therapist.experience} yrs experience</span>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {/* Error banner */}
                    {error && (
                        <div className="mb-4 p-3 rounded-[12px] bg-red-500/10 border border-red-500/15 text-[12px] text-red-400/80">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Select Time */}
                    <AnimatePresence mode="wait">
                        {step === 'slots' && (
                            <motion.div key="slots" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                                {slotsLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i}>
                                                <SkeletonPulse className="h-4 w-24 mb-2" />
                                                <div className="flex gap-2">
                                                    <SkeletonPulse className="h-9 w-20 rounded-full" />
                                                    <SkeletonPulse className="h-9 w-20 rounded-full" />
                                                    <SkeletonPulse className="h-9 w-20 rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="w-8 h-8 text-white/15 mx-auto mb-3" />
                                        <p className="text-[13px] text-white/50">No available slots right now</p>
                                        <p className="text-[11px] text-white/30 mt-1">Check back later or try another guide</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {dateKeys.map((date) => (
                                            <div key={date}>
                                                <p className="text-[11px] text-white/40 font-medium mb-2.5 flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatSlotDate(date)}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {slotsByDate[date].map((slot) => {
                                                        const isSelected = selectedSlot?.startDateTime === slot.startDateTime;
                                                        return (
                                                            <button
                                                                key={slot.startDateTime}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                className={`px-4 py-2.5 rounded-full text-[11px] font-medium border transition-all duration-200 ${isSelected
                                                                    ? 'bg-amber-500/15 border-amber-500/20 text-amber-400 shadow-[0_0_16px_rgba(180,120,40,0.1)]'
                                                                    : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/[0.1]'
                                                                    }`}
                                                            >
                                                                <Clock className="w-3 h-3 inline-block mr-1.5 -mt-px" />
                                                                {slot.startTime}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2: Confirm */}
                        {step === 'confirm' && selectedSlot && (
                            <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                                <div className="space-y-4">
                                    <div className="rounded-[14px] p-4 bg-white/[0.03] border border-white/[0.04] space-y-3.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-white/40">Date</span>
                                            <span className="text-[12px] text-white/70 font-medium">{formatSlotDate(selectedSlot.date)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-white/40">Time</span>
                                            <span className="text-[12px] text-white/70 font-medium">{selectedSlot.startTime} – {selectedSlot.endTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-white/40">Duration</span>
                                            <span className="text-[12px] text-white/70 font-medium">{durationMin} min</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-white/40">Type</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${badge.cls}`}>{badge.label}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                                            <span className="text-[11px] text-white/40">Price</span>
                                            <span className="text-[13px] text-white/80 font-semibold">
                                                {sessionType === 'discovery' ? 'Free' : sessionType === 'pay_as_you_like' ? 'You choose' : `₹${therapist.pricePerSession.toLocaleString()}`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Reassurance micro-copy */}
                                    <div className="flex items-start gap-2.5 px-1">
                                        <Shield className="w-3.5 h-3.5 text-emerald-400/40 flex-shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-white/30 leading-relaxed">
                                            {sessionType === 'discovery'
                                                ? 'No payment required. This is a free call to see if it clicks.'
                                                : sessionType === 'pay_as_you_like'
                                                    ? 'Pay whatever feels right after the session. No minimums, no judgment.'
                                                    : 'You can cancel free of charge up to 2 hours before the session.'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Done */}
                        {step === 'done' && (
                            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                                <div className="text-center py-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <p className="text-[15px] font-semibold text-white/90 mb-1">You're all set!</p>
                                    <p className="text-[12px] text-white/50 max-w-xs mx-auto leading-relaxed">
                                        Your session with {therapist.name} has been booked. You'll receive a confirmation shortly.
                                    </p>

                                    {/* Add to Calendar */}
                                    {bookedSession && (
                                        <a
                                            href={buildCalendarUrl(therapist.name, bookedSession.scheduledAt, durationMin)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-white/50 hover:text-white/70 text-[11px] font-medium transition-all"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Add to Google Calendar
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Footer ── */}
                <div className="p-6 pt-4 border-t border-white/[0.04]">
                    {step === 'slots' && (
                        <button
                            onClick={() => setStep('confirm')}
                            disabled={!selectedSlot}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/60 hover:to-orange-800/30 text-white/80 font-semibold text-[13px] hover:text-white transition-all border border-amber-500/10 hover:border-amber-500/15 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    )}
                    {step === 'confirm' && (
                        <button
                            onClick={handleBook}
                            disabled={bookingLoading}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-600/40 to-emerald-700/20 hover:from-emerald-500/50 hover:to-emerald-600/30 text-white/90 font-semibold text-[13px] transition-all border border-emerald-500/15 hover:border-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {bookingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Confirm Booking
                        </button>
                    )}
                    {step === 'done' && (
                        <div className="flex gap-3">
                            {bookedSession && (
                                <button
                                    onClick={() => navigate(`/dashboard/sessions/${bookedSession.id}`)}
                                    className="flex-1 py-3 rounded-full bg-amber-900/20 hover:bg-amber-800/30 text-amber-400/80 hover:text-amber-400 font-semibold text-[13px] transition-all border border-amber-500/10 hover:border-amber-500/15"
                                >
                                    View Session
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white/70 font-semibold text-[13px] transition-all border border-white/[0.06]"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
