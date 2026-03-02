import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HumanMatchCard() {
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
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.06]">
                        <Sparkles className="w-3 h-3 text-amber-400/70" />
                        <span className="text-[11px] text-amber-400/80 font-semibold">98% Match</span>
                    </div>
                </div>

                {/* Context — why this match */}
                <div className="flex-1 mb-5">
                    <p className="text-[14px] text-white/55 leading-[1.7] mb-2.5">
                        Friction between <span className="text-white/80 font-medium">Career</span> and <span className="text-white/80 font-medium">Anxiety</span> nodes over 3 weeks.
                    </p>
                    <p className="text-[13px] text-white/40 leading-[1.7]">
                        <span className="text-white/65 font-medium">Dr. Aisha M.</span> specializes in high-functioning corporate anxiety and has helped 200+ professionals navigate similar patterns.
                    </p>
                </div>

                {/* Therapist Profile + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/15">
                                <img src="https://i.pravatar.cc/100?img=5" alt="Dr. Aisha" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#070709] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[13px] text-white/70 font-semibold">Dr. Aisha M.</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] text-white/30">Clinical Psychologist</p>
                                <div className="flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 text-amber-400/60 fill-amber-400/60" />
                                    <span className="text-[10px] text-white/30">4.9</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/dashboard/sessions"
                        className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/20 hover:from-amber-800/60 hover:to-orange-800/30 text-white/80 font-semibold text-[12px] hover:text-white transition-all border border-amber-500/10 hover:border-amber-500/15 shadow-[0_0_30px_rgba(180,120,40,0.08)] hover:shadow-[0_0_40px_rgba(180,120,40,0.15)]"
                    >
                        Connect
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
