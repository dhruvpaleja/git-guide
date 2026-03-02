import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Loader2 } from 'lucide-react';
import constellationService from '@/features/constellation/services/constellation.service.js';
import { CATEGORY_CONFIGS } from '@/features/constellation/types/index.js';
import type { ConstellationNode, ConstellationConnection } from '@/features/constellation/types/index.js';

export default function SoulConstellationMap() {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState<ConstellationNode[]>([]);
    const [connections, setConnections] = useState<ConstellationConnection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        constellationService
            .getConstellation()
            .then((data) => {
                setNodes(data.nodes);
                setConnections(data.connections);
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    // Normalize node positions to fit the widget viewport (percentage-based)
    const renderNodes = useMemo(() => {
        if (nodes.length === 0) return [];
        const margin = 15;
        const xs = nodes.map((n) => n.x);
        const ys = nodes.map((n) => n.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        return nodes.map((n) => ({
            ...n,
            px: margin + ((n.x - minX) / rangeX) * (100 - margin * 2),
            py: margin + ((n.y - minY) / rangeY) * (100 - margin * 2),
        }));
    }, [nodes]);

    const connectionGrad = (type: string) => {
        if (type === 'harmony') return 'url(#wg-harmony)';
        if (type === 'friction') return 'url(#wg-friction)';
        if (type === 'evolving') return 'url(#wg-evolving)';
        return '#333';
    };

    return (
        <div
            onClick={() => navigate('/dashboard/constellation')}
            className="relative w-full h-[340px] sm:h-[420px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-[24px] overflow-hidden flex items-center justify-center cursor-pointer group hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-700 isolate"
        >
            {/* Ambient core glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 group-hover:blur-[100px] transition-all duration-1000" />
            <div className="absolute inset-0 bg-[#ffffff] opacity-[0.01] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            {/* SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="wg-friction" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d93025" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="wg-harmony" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e8e3e" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="wg-evolving" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {connections.map((conn) => {
                    const src = renderNodes.find((n) => n.id === conn.sourceId);
                    const tgt = renderNodes.find((n) => n.id === conn.targetId);
                    if (!src || !tgt) return null;
                    const mx = (src.px + tgt.px) / 2;
                    const my = (src.py + tgt.py) / 2 - 5;
                    return (
                        <motion.path
                            key={conn.id}
                            d={`M ${src.px} ${src.py} Q ${mx} ${my} ${tgt.px} ${tgt.py}`}
                            fill="none"
                            stroke={connectionGrad(conn.type)}
                            strokeWidth="0.4"
                            style={{ filter: `drop-shadow(0 0 6px ${conn.type === 'friction' ? '#d9302580' : conn.type === 'harmony' ? '#1e8e3e80' : '#a78bfa80'})` }}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {isLoading ? (
                <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
            ) : (
                <div className="absolute inset-0 pointer-events-none">
                    {renderNodes.map((node, idx) => {
                        const catColor = CATEGORY_CONFIGS[node.category]?.color || '#555';
                        const nodeSize = idx === 0 ? 70 : 40 + node.size * 6;
                        return (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: idx * 0.08 }}
                                className="absolute flex flex-col items-center"
                                style={{
                                    left: `${node.px}%`,
                                    top: `${node.py}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {/* Pulse ring — only for center node */}
                                {idx === 0 && (
                                    <motion.div
                                        className="absolute rounded-full"
                                        style={{
                                            width: nodeSize * 1.6,
                                            height: nodeSize * 1.6,
                                            backgroundColor: `${catColor}15`,
                                        }}
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.08, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}

                                {/* Core dot */}
                                <div
                                    className="relative rounded-full border"
                                    style={{
                                        width: nodeSize * 0.5,
                                        height: nodeSize * 0.5,
                                        backgroundColor: '#1a1a1a',
                                        borderColor: `${catColor}50`,
                                    }}
                                />

                                {/* Label */}
                                <span
                                    className="absolute text-white/50 whitespace-nowrap font-medium"
                                    style={{
                                        fontSize: idx === 0 ? 11 : 9,
                                        top: `calc(50% + ${nodeSize * 0.35}px)`,
                                    }}
                                >
                                    {node.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Title */}
            <div className="absolute top-6 left-8">
                <h2 className="text-xl font-semibold text-white/90 tracking-tight flex items-center gap-2">
                    The Constellation
                    <Sparkles className="w-4 h-4 text-accent/50" />
                </h2>
                <p className="text-sm text-white/40 mt-1">
                    {nodes.length > 0
                        ? `${nodes.length} nodes · ${connections.length} connections`
                        : 'Mapping your exact emotional resonance.'}
                </p>
            </div>

            {/* Open CTA */}
            <div className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-white/30 group-hover:text-white/60 group-hover:bg-white/10 transition-all">
                Open Map
                <ArrowUpRight className="w-3.5 h-3.5" />
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 right-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1e8e3e] shadow-[0_0_8px_#1e8e3e]" />
                    <span className="text-[11px] text-white/40 uppercase tracking-wider">Harmony</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#d93025] shadow-[0_0_8px_#d93025]" />
                    <span className="text-[11px] text-white/40 uppercase tracking-wider">Friction</span>
                </div>
            </div>
        </div>
    );
}
