import { ArrowRight, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HumanMatchCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full rounded-[24px] p-6 bg-[#0c0c0c] border border-[#2b2b2b]/60 overflow-hidden group hover:border-[#1e8e3e]/40 transition-colors"
        >
            {/* Subtle organic gradient matching the AI vibe */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#1e8e3e]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#1e8e3e]/10 transition-colors duration-700" />

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1e8e3e]/10 flex items-center justify-center border border-[#1e8e3e]/20">
                        <BrainCircuit className="w-5 h-5 text-[#1e8e3e]" />
                    </div>
                    <div>
                        <h3 className="text-white/90 font-semibold tracking-tight">Constellation Match</h3>
                        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Professional Guidance</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                    <Sparkles className="w-3 h-3 text-accent animate-pulse-glow" />
                    <span>98% Synergy</span>
                </div>
            </div>

            <div className="mt-5 mb-6">
                <p className="text-white/80 text-[15px] leading-relaxed">
                    You've mapped severe friction between the <span className="text-white font-medium">Tech Career</span> and <span className="text-white font-medium">Anxiety</span> nodes over the last 3 weeks.
                </p>
                <p className="text-white/50 text-[15px] leading-relaxed mt-3">
                    We have found <span className="text-white font-medium">Dr. Aisha M.</span>, a clinical counselor who specializes precisely in high-functioning corporate panic. She personally transitioned out of a FAANG company before her practice.
                </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-2 border-[#0c0c0c] flex items-center justify-center overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=5" alt="Dr. Aisha" className="w-full h-full object-cover opacity-70" />
                    </div>
                </div>
                <button className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors">
                    Connect Now
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
