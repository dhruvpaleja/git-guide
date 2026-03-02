import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
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
            className="relative w-full h-[320px] sm:h-[380px] bg-white/[0.015] backdrop-blur-sm border border-white/[0.05] rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer group hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-500"
        >
            {/* Ambient core glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-purple-500/[0.06] blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/[0.1] transition-all duration-1000" />

            {/* SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="wg-friction" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d93025" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="wg-harmony" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e8e3e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="wg-evolving" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
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
                            strokeWidth="0.35"
                            style={{ filter: `drop-shadow(0 0 4px ${conn.type === 'friction' ? '#d9302540' : conn.type === 'harmony' ? '#1e8e3e40' : '#a78bfa40'})` }}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.7 }}
                            transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {isLoading ? (
                <Loader2 className="w-5 h-5 text-white/15 animate-spin" />
            ) : (
                <div className="absolute inset-0 pointer-events-none">
                    {renderNodes.map((node, idx) => {
                        const catColor = CATEGORY_CONFIGS[node.category]?.color || '#555';
                        const nodeSize = idx === 0 ? 60 : 36 + node.size * 5;
                        return (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: idx * 0.06 }}
                                className="absolute flex flex-col items-center"
                                style={{
                                    left: `${node.px}%`,
                                    top: `${node.py}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {/* Pulse ring — center node only */}
                                {idx === 0 && (
                                    <motion.div
                                        className="absolute rounded-full"
                                        style={{
                                            width: nodeSize * 1.5,
                                            height: nodeSize * 1.5,
                                            backgroundColor: `${catColor}10`,
                                        }}
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}

                                {/* Core dot */}
                                <div
                                    className="relative rounded-full border"
                                    style={{
                                        width: nodeSize * 0.45,
                                        height: nodeSize * 0.45,
                                        backgroundColor: '#0a0a0a',
                                        borderColor: `${catColor}30`,
                                        boxShadow: `0 0 12px ${catColor}15`,
                                    }}
                                />

                                {/* Label */}
                                <span
                                    className="absolute text-white/35 whitespace-nowrap font-medium"
                                    style={{
                                        fontSize: idx === 0 ? 10 : 8,
                                        top: `calc(50% + ${nodeSize * 0.3}px)`,
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
            <div className="absolute top-5 left-6">
                <h2 className="text-[15px] font-semibold text-white/70 tracking-tight">
                    The Constellation
                </h2>
                <p className="text-[11px] text-white/30 mt-0.5">
                    {nodes.length > 0
                        ? `${nodes.length} nodes · ${connections.length} connections`
                        : 'Mapping your emotional landscape'}
                </p>
            </div>

            {/* Open CTA */}
            <div className="absolute top-5 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] text-[10px] text-white/25 group-hover:text-white/50 group-hover:bg-white/[0.06] transition-all border border-white/[0.04]">
                Open
                <ArrowUpRight className="w-3 h-3" />
            </div>

            {/* Legend */}
            <div className="absolute bottom-5 right-6 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]/70" />
                    <span className="text-[9px] text-white/25 uppercase tracking-wider">Harmony</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d93025]/70" />
                    <span className="text-[9px] text-white/25 uppercase tracking-wider">Friction</span>
                </div>
            </div>
        </div>
    );
}
