import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HumanMatchCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full rounded-2xl p-5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] overflow-hidden group hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500"
        >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-[50px] pointer-events-none group-hover:bg-emerald-500/[0.06] transition-colors duration-700" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] uppercase tracking-[0.1em] text-emerald-400/70 font-semibold">
                            Match Found
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-white/25">
                        <Sparkles className="w-3 h-3 text-accent/40" />
                        <span>98% Synergy</span>
                    </div>
                </div>

                <p className="text-[13px] text-white/60 leading-relaxed mb-1">
                    Friction between <span className="text-white/80 font-medium">Career</span> and <span className="text-white/80 font-medium">Anxiety</span> nodes over 3 weeks.
                </p>
                <p className="text-[12px] text-white/40 leading-relaxed">
                    <span className="text-white/65 font-medium">Dr. Aisha M.</span> specializes in high-functioning corporate anxiety.
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/[0.06]">
                            <img src="https://i.pravatar.cc/100?img=5" alt="Dr. Aisha" className="w-full h-full object-cover opacity-60" />
                        </div>
                    </div>
                    <button className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] text-white/70 font-medium text-[12px] hover:bg-white/[0.12] hover:text-white transition-all border border-white/[0.06]">
                        Connect
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
