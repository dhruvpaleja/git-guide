import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Star, UserRound, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { therapyApi } from '@/services/therapy.api';
import type { TherapistCard } from '@/types/therapy.types';

function SkeletonPulse({ className }: { className?: string }) {
    return <div className={`bg-white/[0.06] animate-pulse rounded-md ${className ?? ''}`} />;
}

function formatAvailability(nextSlot: string | null): { label: string; urgent: boolean } {
    if (!nextSlot) return { label: '', urgent: false };
    const diff = new Date(nextSlot).getTime() - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (hours <= 0) return { label: 'Available now', urgent: true };
    if (hours <= 24) return { label: 'Available today', urgent: true };
    if (hours <= 48) return { label: 'Available tomorrow', urgent: false };
    return { label: `Next slot in ${Math.ceil(hours / 24)} days`, urgent: false };
}

export default function HumanMatchCard() {
    const [guide, setGuide] = useState<TherapistCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchGuide = () => {
        setLoading(true);
        setError(false);
        therapyApi.getRecommendedTherapists()
            .then((res) => {
                if (res.success && res.data && res.data.length > 0) {
                    setGuide(res.data[0]);
                } else {
                    setGuide(null);
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchGuide(); }, []);

    const availability = guide ? formatAvailability(guide.nextAvailableSlot) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full h-full rounded-[20px] p-6 bg-white/[0.02] border border-white/[0.04] overflow-hidden group hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-500"
        >
            {/* Warm ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/[0.04] rounded-full blur-[70px] pointer-events-none group-hover:bg-amber-500/[0.06] transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/[0.02] rounded-full blur-[50px] pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
                        <h3 className="text-[15px] text-white/70 font-semibold tracking-tight">Recommended For You</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        {guide && (
                            <motion.div
                                key="badge"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.06]"
                            >
                                <Sparkles className="w-3 h-3 text-amber-400/70" />
                                <span className="text-[11px] text-amber-400/80 font-semibold">
                                    {Math.round(guide.matchScore)}% Match
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex-1 flex flex-col gap-3 mb-5">
                        <SkeletonPulse className="h-4 w-4/5" />
                        <SkeletonPulse className="h-4 w-3/5" />
                        <SkeletonPulse className="h-3 w-full mt-1" />
                        <SkeletonPulse className="h-3 w-2/3" />
                        <div className="flex-1" />
                        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                            <SkeletonPulse className="w-11 h-11 rounded-full" />
                            <div className="flex flex-col gap-1.5">
                                <SkeletonPulse className="h-3 w-24" />
                                <SkeletonPulse className="h-2.5 w-16" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                        <p className="text-[13px] text-white/40">Something went wrong</p>
                        <button
                            onClick={fetchGuide}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white/80 text-[12px] font-medium transition-all border border-white/[0.06]"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && !guide && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-2">
                        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-1">
                            <UserRound className="w-5 h-5 text-white/25" />
                        </div>
                        <p className="text-[14px] text-white/55 font-medium">No matches yet</p>
                        <p className="text-[12px] text-white/35 leading-relaxed">
                            Complete your profile for personalized Soul Guide matches
                        </p>
                        <Link
                            to="/dashboard/personalize"
                            className="mt-2 px-4 py-2 rounded-full bg-amber-500/[0.08] hover:bg-amber-500/[0.14] text-amber-400/80 text-[12px] font-semibold border border-amber-500/[0.06] transition-all"
                        >
                            Complete Profile
                        </Link>
                    </div>
                )}

                {/* Matched guide */}
                {!loading && !error && guide && (
                    <>
                        {/* Context — why this match */}
                        <div className="flex-1 mb-5">
                            {guide.matchReasons.length > 0 ? (
                                <p className="text-[14px] text-white/55 leading-[1.7] mb-2.5">
                                    {guide.matchReasons[0]}
                                </p>
                            ) : (
                                <p className="text-[14px] text-white/55 leading-[1.7] mb-2.5">
                                    {Math.round(guide.matchScore)}% match with your emotional pattern
                                </p>
                            )}
                            <p className="text-[13px] text-white/50 leading-[1.7]">
                                <span className="text-white/65 font-medium">{guide.name}</span>{' '}
                                specializes in {guide.specializations.slice(0, 2).join(' & ')} and has helped{' '}
                                <span className="text-white/65 font-medium">{guide.totalSessions}+ people</span> like you.
                            </p>

                            {/* Trust signals row */}
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                {availability && availability.label && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                        availability.urgent
                                            ? 'text-emerald-400/90 bg-emerald-500/[0.08] border-emerald-500/[0.1]'
                                            : 'text-white/50 bg-white/[0.04] border-white/[0.06]'
                                    }`}>
                                        {availability.label}
                                    </span>
                                )}
                                {guide.totalReviews > 0 && (
                                    <span className="text-[10px] text-white/40">
                                        {guide.totalReviews} reviews
                                    </span>
                                )}
                                {guide.experience > 0 && (
                                    <span className="text-[10px] text-white/40">
                                        {guide.experience}+ yrs exp
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Therapist Profile + CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/15">
                                        {guide.photoUrl ? (
                                            <img
                                                src={guide.photoUrl}
                                                alt={guide.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-amber-900/30 flex items-center justify-center">
                                                <span className="text-[16px] font-bold text-amber-400/60">
                                                    {guide.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Online indicator */}
                                    {guide.isOnline && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#070709] flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[13px] text-white/70 font-semibold">{guide.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[10px] text-white/50">
                                            {guide.specializations[0] ?? 'Soul Guide'}
                                        </p>
                                        <div className="flex items-center gap-0.5">
                                            <Star className="w-2.5 h-2.5 text-amber-400/60 fill-amber-400/60" />
                                            <span className="text-[10px] text-white/50">
                                                {guide.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    {guide.isOnline && guide.isAcceptingNow && (
                                        <p className="text-[9px] text-emerald-400/70 font-medium mt-0.5">
                                            Available Now
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Link
                                to={`/dashboard/sessions?guide=${guide.therapistId}`}
                                className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/60 hover:to-orange-800/30 text-white/80 font-semibold text-[12px] hover:text-white transition-all border border-amber-500/10 hover:border-amber-500/15 shadow-[0_0_30px_rgba(180,120,40,0.08)] hover:shadow-[0_0_40px_rgba(180,120,40,0.15)]"
                            >
                                Connect
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {/* Free call micro-copy */}
                        <p className="text-[10px] text-white/30 text-center mt-3">
                            15 min free call — no commitment
                        </p>
                    </>
                )}
            </div>
        </motion.div>
    );
}
