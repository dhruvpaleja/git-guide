import { motion } from 'framer-motion';

interface NodeProps {
    label: string;
    x: string;
    y: string;
    size?: number;
    pulseColor?: string;
    delay?: number;
}

const CosmicNode = ({ label, x, y, size = 60, pulseColor = "rgba(43, 43, 43, 0.5)", delay = 0 }: NodeProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay }}
        className="absolute flex flex-col items-center justify-center cursor-pointer group"
        style={{ left: x, top: y, width: size, height: size }}
    >
        <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: pulseColor }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
        />
        <div className="relative w-1/2 h-1/2 bg-[#1a1a1a] rounded-full border border-[#333] shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:border-white/40 transition-colors z-10" />
        <span className="absolute -bottom-6 text-xs font-medium tracking-wide text-white/50 group-hover:text-white/90 transition-colors pointer-events-none whitespace-nowrap">
            {label}
        </span>
    </motion.div>
);

export default function SoulConstellationMap() {
    return (
        <div className="relative w-full h-[400px] sm:h-[500px] bg-[#0c0c0c]/40 border border-[#2b2b2b]/50 rounded-[30px] overflow-hidden flex items-center justify-center dashboard-widget-glass">
            {/* Background ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />

            {/* SVG Connecting Lines (Simulated Data Map) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="grad-friction" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d93025" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="grad-harmony" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e8e3e" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Harmony Line */}
                <motion.path
                    d="M 30% 40% Q 50% 30% 70% 50%"
                    fill="none"
                    stroke="url(#grad-harmony)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="animate-pulse-glow"
                />

                {/* Friction Line - Warning state */}
                <motion.path
                    d="M 30% 40% Q 40% 70% 60% 70%"
                    fill="none"
                    stroke="url(#grad-friction)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 2, delay: 1 }}
                />

                {/* Neutral Line */}
                <motion.path
                    d="M 70% 50% Q 65% 65% 60% 70%"
                    fill="none"
                    stroke="#333"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: 1.5 }}
                />
            </svg>

            {/* Interactive Nodes */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
                <CosmicNode label="You" x="25%" y="30%" size={80} pulseColor="rgba(255,255,255,0.15)" delay={0.2} />
                <CosmicNode label="Career Burnout" x="65%" y="45%" size={60} pulseColor="rgba(20, 184, 166, 0.2)" delay={0.5} />
                <CosmicNode label="Tech Boss" x="55%" y="65%" size={70} pulseColor="rgba(217, 48, 37, 0.2)" delay={0.8} />
            </div>

            <div className="absolute top-6 left-8">
                <h2 className="text-xl font-semibold text-white/90 tracking-tight">The Constellation</h2>
                <p className="text-sm text-white/40 mt-1">Mapping your exact emotional resonance.</p>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 right-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1e8e3e] shadow-[0_0_8px_#1e8e3e]" />
                    <span className="text-[11px] text-white/40 uppercase tracking-widest">Harmony</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#d93025] shadow-[0_0_8px_#d93025]" />
                    <span className="text-[11px] text-white/40 uppercase tracking-widest">Friction</span>
                </div>
            </div>
        </div>
    );
}
