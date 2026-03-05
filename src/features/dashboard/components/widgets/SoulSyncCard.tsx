import { ArrowRight, Fingerprint, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SoulSyncCardProps {
    type?: 'romantic' | 'platonic' | 'professional';
}

export default function SoulSyncCard({ type = 'platonic' }: SoulSyncCardProps) {

    const configs = {
        romantic: {
            color: "from-rose-500/20 to-purple-500/10",
            borderColor: "border-rose-500/30",
            iconColor: "text-rose-400",
            pillBg: "bg-rose-500/10",
            title: "Romantic Offset",
            label: "Karmic Balance Match",
            description: "Your Constellation shows you need extreme grounding right now. We found a user whose planetary transits perfectly counter-balance your current chaos. They are open to dating.",
            actionText: "Reveal Profile",
        },
        platonic: {
            color: "from-blue-500/20 to-cyan-500/10",
            borderColor: "border-blue-500/30",
            iconColor: "text-blue-400",
            pillBg: "bg-blue-500/10",
            title: "Shared Frequency",
            label: "Empathy Match",
            description: "A user just added a 'Grief' node identical to yours. Their backend chart shows high emotional compatibility for holding space.",
            actionText: "Send Support Pulse",
        },
        professional: {
            color: "from-amber-500/20 to-orange-500/10",
            borderColor: "border-amber-500/30",
            iconColor: "text-amber-400",
            pillBg: "bg-amber-500/10",
            title: "Synergy Node",
            label: "Professional Match",
            description: "You mapped 'Need an Editor' in your Work node 2 days ago. This user is a top-rated editor with matching communication styles.",
            actionText: "Connect Professionally",
        }
    };

    const c = configs[type];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative w-full rounded-[20px] p-6 bg-white/10 dark:bg-white/[0.04] backdrop-blur-md border border-white/10 dark:border-white/[0.06] shadow-lg overflow-hidden group hover:bg-white/[0.14] dark:hover:bg-white/[0.06] transition-all isolate"
        >
            {/* Background glow */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none transition-opacity duration-700 group-hover:opacity-40 blur-xl", c.color)} />

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", c.pillBg, c.borderColor)}>
                            <Fingerprint className={cn("w-5 h-5", c.iconColor)} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold tracking-tight">{c.title}</h3>
                            <p className="text-xs text-white/50 uppercase tracking-wider font-medium">{c.label}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
                        <MapPin className="w-3 h-3" />
                        <span>4 miles away</span>
                    </div>
                </div>

                <div className="mt-5 mb-6">
                    <p className="text-white/80 text-[15px] leading-relaxed">
                        {c.description}
                    </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 mt-auto">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full bg-black/50 border-2 border-black/40 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-gray-600 blur-[2px]" />
                        </div>
                    </div>
                    <button className={cn(
                        "group/btn flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg",
                        "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    )}>
                        {c.actionText}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
