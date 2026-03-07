import { Star, X, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { therapyApi } from '@/services/therapy.api';
import type { NudgeItem } from '@/types/therapy.types';

// ── Nudge type → visual config mapping ──────────────────────────────────────

interface NudgeConfig {
    label: string;
    message: (nudge: NudgeItem) => string;
    highlight?: (nudge: NudgeItem) => string | undefined;
    dotColor: string;
    labelColor: string;
    actionText: string;
    actionRoute: string | ((nudge: NudgeItem) => string);
    /** Optional special background for cosmic/mystic styles */
    cardClass?: string;
}

/** Helper: resolve action route for nudges that point to a specific session */
function nudgeSessionRoute(nudge: NudgeItem): string {
    const sessionId = nudge.nudgeData?.sessionId as string | undefined;
    return sessionId ? `/dashboard/sessions/${sessionId}` : '/dashboard/sessions';
}

const NUDGE_CONFIG: Record<string, NudgeConfig> = {
    low_mood_streak: {
        label: 'Gentle Check-In',
        message: () =>
            "We noticed you've been going through a rough patch lately. Talking to someone who understands can make all the difference.",
        dotColor: 'bg-red-400/80',
        labelColor: 'text-red-400/70',
        actionText: 'Talk to a Soul Guide',
        actionRoute: '/dashboard/sessions',
    },
    first_session_free: {
        label: 'Your Free Call',
        message: () =>
            'Your first 15-minute call is completely free — no commitment, no obligations. Just a safe space to be heard.',
        dotColor: 'bg-emerald-400/80',
        labelColor: 'text-emerald-400/70',
        actionText: 'Book Free Call',
        actionRoute: '/dashboard/sessions',
    },
    constellation_pattern: {
        label: 'Pattern Insight',
        message: (nudge) => {
            const pattern = nudge.nudgeData?.pattern as string | undefined;
            return pattern
                ? `Your emotional constellation reveals a recurring "${pattern}" pattern. Your guide specializes in exactly this.`
                : 'Your emotional constellation reveals a recurring pattern. A guide could help you break through it.';
        },
        highlight: (nudge) => nudge.nudgeData?.pattern as string | undefined,
        dotColor: 'bg-purple-400/80',
        labelColor: 'text-purple-400/70',
        actionText: 'Explore With a Guide',
        actionRoute: '/dashboard/sessions',
    },
    session_reminder: {
        label: 'Upcoming Session',
        message: (nudge) => {
            const guideName = nudge.nudgeData?.therapistName as string | undefined;
            return guideName
                ? `Your session with ${guideName} is coming up soon. Take a quiet moment to prepare.`
                : "You have an upcoming session. Take a quiet moment to prepare.";
        },
        dotColor: 'bg-blue-400/80',
        labelColor: 'text-blue-400/70',
        actionText: 'View Session',
        actionRoute: '/dashboard/sessions',
    },
    session_gap_reminder: {
        label: "It's Been a While",
        message: () =>
            "It's been a couple of weeks since your last session. A quick check-in could help you stay on track.",
        dotColor: 'bg-blue-400/80',
        labelColor: 'text-blue-400/70',
        actionText: 'Schedule a Call',
        actionRoute: '/dashboard/sessions',
    },
    post_session_rate: {
        label: 'How Was It?',
        message: (nudge) => {
            const guideName = nudge.nudgeData?.therapistName as string | undefined;
            return guideName
                ? `Your recent call with ${guideName} — we'd love your feedback. It helps us match you better.`
                : "Your recent call ended — we'd love your feedback. It helps us match you better.";
        },
        dotColor: 'bg-amber-400/80',
        labelColor: 'text-amber-400/70',
        actionText: 'Rate Session',
        actionRoute: nudgeSessionRoute,
    },
    astrology_interest: {
        label: 'Cosmic Insight',
        message: () =>
            'Your birth chart reveals patterns your guide should see. Vedic wisdom and modern guidance, together.',
        dotColor: 'bg-purple-400/80',
        labelColor: 'text-purple-400/80',
        actionText: 'Talk to a Vedic Guide',
        actionRoute: '/dashboard/sessions',
        cardClass: 'bg-gradient-to-br from-purple-900/[0.08] to-amber-900/[0.06] border-purple-500/[0.08] hover:border-purple-500/[0.12]',
    },
    pay_as_you_like_return: {
        label: 'Welcome Back',
        message: () =>
            'Your next call is pay-what-you-feel. No pressure, no minimum. Just come as you are.',
        dotColor: 'bg-amber-400/80',
        labelColor: 'text-amber-400/70',
        actionText: 'Book a Call',
        actionRoute: '/dashboard/sessions',
    },
};

/** Get resolved config for a nudge, falling back to a sensible default */
function resolveConfig(nudge: NudgeItem): NudgeConfig & { resolvedRoute: string } {
    const config = NUDGE_CONFIG[nudge.nudgeType];
    if (!config) {
        // Unknown nudge type — generic style
        return {
            label: 'Insight',
            message: () => (nudge.nudgeData?.message as string) ?? 'You have a new insight waiting.',
            dotColor: 'bg-white/40',
            labelColor: 'text-white/50',
            actionText: 'View',
            actionRoute: '/dashboard',
            resolvedRoute: '/dashboard',
        };
    }
    const route =
        typeof config.actionRoute === 'function'
            ? config.actionRoute(nudge)
            : config.actionRoute;
    return { ...config, resolvedRoute: route };
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function SkeletonPulse({ className }: { className?: string }) {
    return <div className={`bg-white/[0.06] animate-pulse rounded-md ${className ?? ''}`} />;
}

export default function PatternAlerts() {
    const [nudges, setNudges] = useState<NudgeItem[]>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [actingOn, setActingOn] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchNudges = useCallback(() => {
        setLoading(true);
        setError(false);
        therapyApi.getNudges()
            .then((res) => {
                if (res.success && Array.isArray(res.data)) {
                    setNudges(res.data);
                } else {
                    setNudges([]);
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const id = window.setTimeout(() => {
            fetchNudges();
        }, 0);
        return () => window.clearTimeout(id);
    }, [fetchNudges]);

    const handleDismiss = (id: string) => {
        setDismissed((s) => new Set(s).add(id));
        therapyApi.dismissNudge(id).catch(() => {
            // Revert optimistic dismiss on failure
            setDismissed((s) => {
                const next = new Set(s);
                next.delete(id);
                return next;
            });
        });
    };

    const handleAction = (nudge: NudgeItem, route: string) => {
        setActingOn(nudge.id);
        therapyApi.markNudgeActed(nudge.id)
            .then(() => {
                setDismissed((s) => new Set(s).add(nudge.id));
                navigate(route);
            })
            .catch(() => {
                // Still navigate even on failure — user experience first
                navigate(route);
            })
            .finally(() => setActingOn(null));
    };

    const visibleNudges = nudges.filter((n) => !dismissed.has(n.id));

    return (
        <div className="w-full h-full rounded-[20px] p-6 bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] text-white/70 font-semibold tracking-tight">Insights</h3>
                {!loading && visibleNudges.length > 0 && (
                    <span className="text-[11px] font-medium text-white/25 bg-white/[0.04] px-2.5 py-1 rounded-full">
                        {visibleNudges.length} new
                    </span>
                )}
            </div>

            <div className="space-y-3" aria-live="polite">
                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl bg-white/[0.015] border border-white/[0.03] p-4">
                                <div className="flex items-start gap-3">
                                    <SkeletonPulse className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonPulse className="h-3 w-20" />
                                        <SkeletonPulse className="h-3 w-full" />
                                        <SkeletonPulse className="h-3 w-3/4" />
                                        <SkeletonPulse className="h-3 w-16 mt-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="py-8 flex flex-col items-center gap-3 text-center">
                        <p className="text-[13px] text-white/40">Couldn't load insights</p>
                        <button
                            onClick={fetchNudges}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white/80 text-[12px] font-medium transition-all border border-white/[0.06]"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Nudge list */}
                {!loading && !error && (
                    <AnimatePresence>
                        {visibleNudges.map((nudge, idx) => {
                            const config = resolveConfig(nudge);
                            const isActing = actingOn === nudge.id;
                            const isCta = nudge.nudgeType === 'first_session_free';

                            return (
                                <motion.div
                                    key={nudge.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className={cn(
                                        'rounded-2xl border p-4 group transition-all duration-300',
                                        config.cardClass
                                            ? config.cardClass
                                            : 'bg-white/[0.015] border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.05]',
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', config.dotColor)} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <span className={cn('text-[11px] font-semibold uppercase tracking-[0.06em]', config.labelColor)}>
                                                    {config.label}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-white/15 font-medium">
                                                        {timeAgo(nudge.createdAt)}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDismiss(nudge.id)}
                                                        title="Dismiss"
                                                        aria-label="Dismiss insight"
                                                        className="h-9 w-9 flex items-center justify-center rounded-full opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white/[0.05] transition-opacity"
                                                    >
                                                        <X className="w-3 h-3 text-white/15 hover:text-white/40" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-[13px] text-white/50 leading-[1.6]">
                                                {(() => {
                                                    const msg = config.message(nudge);
                                                    const hl = config.highlight?.(nudge);
                                                    if (!hl) return msg;
                                                    return msg.split(hl).map((part, i, arr) => (
                                                        <span key={i}>
                                                            {part}
                                                            {i < arr.length - 1 && (
                                                                <span className="text-white/80 font-medium">{hl}</span>
                                                            )}
                                                        </span>
                                                    ));
                                                })()}
                                            </p>

                                            {/* CTA button */}
                                            {isCta ? (
                                                <button
                                                    onClick={() => handleAction(nudge, config.resolvedRoute)}
                                                    disabled={isActing}
                                                    className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/[0.12] hover:bg-emerald-500/[0.2] text-emerald-400/90 text-[12px] font-semibold border border-emerald-500/[0.1] transition-all disabled:opacity-50"
                                                >
                                                    {isActing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Star className="w-3 h-3" />}
                                                    {config.actionText}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(nudge, config.resolvedRoute)}
                                                    disabled={isActing}
                                                    className="mt-2.5 inline-flex min-h-[36px] items-center gap-1 text-[11px] text-white/25 hover:text-white/55 transition-colors font-medium disabled:opacity-50"
                                                >
                                                    {isActing && <Loader2 className="w-3 h-3 animate-spin" />}
                                                    {config.actionText} →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
