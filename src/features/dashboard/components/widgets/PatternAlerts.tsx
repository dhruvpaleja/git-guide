import { AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatternAlerts() {
    return (
        <div className="w-full rounded-[30px] p-6 bg-[#0c0c0c] border border-red-500/20 shadow-[0_4px_30px_rgba(217,48,37,0.05)]">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-white/90 font-semibold tracking-tight text-sm">System Intelligence</h3>
            </div>

            <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-4 rounded-2xl bg-[#111] border border-red-500/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-red-400" />
                        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">Behavioral Loop Detected</span>
                    </div>
                    <p className="text-[14px] text-white/80 leading-relaxed font-['Manrope']">
                        Warning: You have mentioned <span className="text-white font-medium">"Burnout"</span> precisely 3 days before every major deadline for the last 4 months. You are self-sabotaging the exact same way you did with the Q3 Deliverables.
                    </p>
                    <div className="mt-3 flex justify-end">
                        <button className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-2">View Constellation History</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
