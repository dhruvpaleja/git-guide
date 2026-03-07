import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import constellationService from '@/features/constellation/services/constellation.service.js';
import { CATEGORY_CONFIGS } from '@/features/constellation/types/index.js';
import type { ConstellationNode, ConstellationConnection } from '@/features/constellation/types/index.js';

type PositionedNode = ConstellationNode & { px: number; py: number };

type RenderConnection = {
    id: string;
    path: string;
    stroke: string;
    dropShadow: string;
};

const CONNECTION_STYLES: Record<string, { stroke: string; dropShadow: string }> = {
    harmony: { stroke: 'url(#wg-harmony)', dropShadow: '#1e8e3e30' },
    friction: { stroke: 'url(#wg-friction)', dropShadow: '#d9302530' },
    evolving: { stroke: 'url(#wg-evolving)', dropShadow: '#a78bfa30' },
};

export default function SoulConstellationMap() {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState<ConstellationNode[]>([]);
    const [connections, setConnections] = useState<ConstellationConnection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        constellationService
            .getConstellation()
            .then((data) => {
                setNodes(data.nodes);
                setConnections(data.connections);
            })
            .catch((err) => {
                console.error('Failed to load constellation:', err);
                setError('Could not load your constellation pattern. This is optional — your journey continues.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const renderNodes = useMemo<PositionedNode[]>(() => {
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

    const renderNodeMap = useMemo(() => {
        return new Map(renderNodes.map((node) => [node.id, node]));
    }, [renderNodes]);

    const renderConnections = useMemo<RenderConnection[]>(() => {
        return connections
            .map((conn) => {
                const src = renderNodeMap.get(conn.sourceId);
                const tgt = renderNodeMap.get(conn.targetId);

                if (!src || !tgt) {
                    return null;
                }

                const mx = (src.px + tgt.px) / 2;
                const my = (src.py + tgt.py) / 2 - 5;
                const style = CONNECTION_STYLES[conn.type] ?? { stroke: '#333', dropShadow: '#33333320' };

                return {
                    id: conn.id,
                    path: `M ${src.px} ${src.py} Q ${mx} ${my} ${tgt.px} ${tgt.py}`,
                    stroke: style.stroke,
                    dropShadow: style.dropShadow,
                };
            })
            .filter((connection): connection is RenderConnection => connection !== null);
    }, [connections, renderNodeMap]);

    return (
        <button
            type="button"
            onClick={() => navigate('/dashboard/constellation')}
            className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] bg-[#070709] border border-white/[0.04] rounded-[20px] overflow-hidden flex items-center justify-center cursor-pointer group hover:border-white/[0.07] transition-all duration-700 text-left"
            aria-label="Open Soul Constellation Map"
        >
            {/* ── Cinematic ambient glows ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-900/[0.08] blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-800/[0.12] transition-all duration-1000" />
            <div className="absolute top-[20%] left-[15%] w-[25%] h-[25%] bg-amber-900/[0.06] blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[15%] right-[10%] w-[20%] h-[20%] bg-teal-900/[0.04] blur-[70px] rounded-full pointer-events-none" />

            {/* Fine grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none constellation-grain" />

            {/* SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="wg-friction" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d93025" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.03" />
                    </linearGradient>
                    <linearGradient id="wg-harmony" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e8e3e" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.03" />
                    </linearGradient>
                    <linearGradient id="wg-evolving" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.03" />
                    </linearGradient>
                </defs>

                {renderConnections.map((connection) => {
                    return (
                        <motion.path
                            key={connection.id}
                            d={connection.path}
                            fill="none"
                            stroke={connection.stroke}
                            strokeWidth="0.3"
                            style={{ filter: `drop-shadow(0 0 6px ${connection.dropShadow})` }}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 3, delay: 0.5, ease: 'easeOut' }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {isLoading ? (
                <Loader2 className="w-5 h-5 text-white/10 animate-spin" />
            ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center max-w-xs">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                            <ArrowUpRight className="w-5 h-5 text-white/20" />
                        </div>
                        <p className="text-[12px] text-white/40 font-medium">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 pointer-events-none">
                    {renderNodes.map((node, idx) => {
                        const catColor = CATEGORY_CONFIGS[node.category]?.color || '#555';
                        const isCenter = idx === 0;
                        const nodeSize = isCenter ? 64 : 36 + node.size * 5;
                        return (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0.3 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute flex flex-col items-center"
                                style={{
                                    left: `${node.px}%`,
                                    top: `${node.py}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {/* Breathing pulse ring — center node */}
                                {isCenter && (
                                    <motion.div
                                        className="absolute rounded-full constellation-pulse-ring"
                                        style={{
                                            '--ring-size': `${nodeSize * 1.8}px`,
                                            '--ring-bg': `${catColor}08`,
                                            '--ring-border': `${catColor}08`,
                                        } as React.CSSProperties}
                                        animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.05, 0.25] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}

                                {/* Outer glow ring for all nodes */}
                                <div
                                    className="absolute rounded-full constellation-node-glow"
                                    style={{
                                        '--glow-size': `${nodeSize * 0.7}px`,
                                        '--glow-bg': `${catColor}06`,
                                        '--glow-blur': `blur(${isCenter ? 8 : 4}px)`,
                                    } as React.CSSProperties}
                                />

                                {/* Core dot */}
                                <div
                                    className="relative rounded-full border transition-all duration-500 group-hover:scale-110 constellation-node-core"
                                    style={{
                                        '--core-size': `${nodeSize * 0.38}px`,
                                        '--core-border': `${catColor}25`,
                                        '--core-shadow': `0 0 ${isCenter ? 20 : 10}px ${catColor}12, inset 0 0 ${isCenter ? 8 : 4}px ${catColor}08`,
                                    } as React.CSSProperties}
                                >
                                    {/* Inner bright core */}
                                    <div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full constellation-node-inner"
                                        style={{
                                            '--inner-bg': `${catColor}40`,
                                        } as React.CSSProperties}
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    className="absolute text-white/30 whitespace-nowrap font-medium group-hover:text-white/50 transition-colors duration-500 constellation-node-label"
                                    style={{
                                        '--label-size': `${isCenter ? 11 : 9}px`,
                                        '--label-top': `calc(50% + ${nodeSize * 0.28}px)`,
                                        '--label-spacing': isCenter ? '0.02em' : '0',
                                    } as React.CSSProperties}
                                >
                                    {node.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Top left — Title + meta */}
            <div className="absolute top-6 left-7">
                <h2 className="text-[16px] font-semibold text-white/65 tracking-[-0.02em]">
                    Your Constellation
                </h2>
                <p className="text-[11px] text-white/25 mt-1 font-medium">
                    {nodes.length > 0
                        ? `${nodes.length} life dimensions · ${connections.length} connections`
                        : 'Mapping your emotional landscape'}
                </p>
            </div>

            {/* Top right — Open CTA */}
            <div className="absolute top-6 right-7 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] text-[11px] text-white/20 group-hover:text-white/50 group-hover:bg-white/[0.06] transition-all duration-500 border border-white/[0.03] font-medium">
                Explore
                <ArrowUpRight className="w-3 h-3" />
            </div>

            {/* Bottom — Legend */}
            <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]/60" />
                        <span className="text-[9px] text-white/20 uppercase tracking-[0.06em] font-medium">Harmony</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d93025]/60" />
                        <span className="text-[9px] text-white/20 uppercase tracking-[0.06em] font-medium">Friction</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]/60" />
                        <span className="text-[9px] text-white/20 uppercase tracking-[0.06em] font-medium">Evolving</span>
                    </div>
                </div>

                <p className="text-[9px] text-white/12 font-medium tracking-wide">
                    TAP TO EXPAND
                </p>
            </div>

            {/* Edge vignette for cinematic depth */}
            <div className="absolute inset-0 pointer-events-none rounded-[24px] constellation-vignette" />
        </button>
    );
}
