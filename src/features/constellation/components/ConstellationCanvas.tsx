/**
 * ConstellationCanvas
 * The interactive SVG-based star map with draggable nodes, animated connections,
 * zoom/pan controls, and real-time visual feedback.
 */

import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  ConstellationNode,
  ConstellationConnection,
  ConstellationViewState,
} from '../types/index.js';
import { CATEGORY_CONFIGS, EMOTION_CONFIGS } from '../types/index.js';

interface ConstellationCanvasProps {
  nodes: ConstellationNode[];
  connections: ConstellationConnection[];
  viewState: ConstellationViewState;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  onZoom: (zoom: number) => void;
  onPan: (x: number, y: number) => void;
}

// ── Connection line component ────────────────────────────────────────────

function ConnectionLine({
  connection,
  sourceNode,
  targetNode,
  isHighlighted,
  hoveredNodeId,
}: {
  connection: ConstellationConnection;
  sourceNode: ConstellationNode;
  targetNode: ConstellationNode;
  isHighlighted: boolean;
  hoveredNodeId: string | null;
}) {
  const sx = sourceNode.x;
  const sy = sourceNode.y;
  const tx = targetNode.x;
  const ty = targetNode.y;

  // Calculate a curved path using quadratic bezier
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  // Offset the midpoint perpendicular to the line for curve
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = Math.min(dist * 0.2, 8);
  const cx = mx + (-dy / dist) * offset;
  const cy = my + (dx / dist) * offset;

  const gradientId = `conn-grad-${connection.id}`;

  const connectionColors = {
    harmony: { start: '#1e8e3e', end: '#14b8a6' },
    friction: { start: '#d93025', end: '#fca5a5' },
    neutral: { start: '#555555', end: '#333333' },
    evolving: { start: '#a855f7', end: '#6366f1' },
  };

  const colors = connectionColors[connection.type];
  const isDimmed =
    hoveredNodeId !== null &&
    hoveredNodeId !== connection.sourceId &&
    hoveredNodeId !== connection.targetId;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1={`${sx}%`} y1={`${sy}%`} x2={`${tx}%`} y2={`${ty}%`}>
          <stop offset="0%" stopColor={colors.start} stopOpacity={isHighlighted ? 0.9 : 0.5} />
          <stop offset="100%" stopColor={colors.end} stopOpacity={isHighlighted ? 0.6 : 0.15} />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={isHighlighted ? connection.strength * 2.5 + 0.5 : connection.strength * 1.5 + 0.3}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: isDimmed ? 0.08 : isHighlighted ? 0.9 : 0.4,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ filter: isHighlighted ? `drop-shadow(0 0 4px ${colors.start})` : 'none' }}
      />
      {/* Connection label on hover */}
      {isHighlighted && connection.label && (
        <motion.text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          initial={{ opacity: 0, y: cy + 2 }}
          animate={{ opacity: 1, y: cy - 2 }}
          exit={{ opacity: 0 }}
          className="text-[2.5px] fill-white/60 font-medium pointer-events-none"
          style={{ fontSize: '2.5px' }}
        >
          {connection.label}
        </motion.text>
      )}
    </g>
  );
}

// ── Node component ───────────────────────────────────────────────────────

function ConstellationNodeComponent({
  node,
  isSelected,
  isHovered,
  isDimmed,
  onSelect,
  onHover,
  onHoverEnd,
  onDragEnd,
}: {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onSelect: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
  onDragEnd: (x: number, y: number) => void;
}) {
  const config = CATEGORY_CONFIGS[node.category];
  const emotionConfig = EMOTION_CONFIGS[node.emotion];
  const baseSize = 3 * node.size;
  const emotionRingSize = baseSize + 1.2;
  // Deterministic delay based on node position
  const nodeDelay = ((node.x * 7 + node.y * 13) % 20) / 10;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isDimmed ? 0.2 : 1,
        scale: 1,
      }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ cursor: 'pointer' }}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      {/* Outer glow pulse */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={baseSize * 2.5}
        fill={config.glowColor}
        animate={{
          r: [baseSize * 2.2, baseSize * 3, baseSize * 2.2],
          opacity: [0.15, 0.05, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: nodeDelay,
        }}
      />

      {/* Emotion ring */}
      {(isSelected || isHovered) && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={emotionRingSize}
          fill="none"
          stroke={emotionConfig.color}
          strokeWidth={0.3}
          strokeDasharray="1 1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 0.6,
            scale: 1,
            rotate: 360,
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        />
      )}

      {/* Selection ring */}
      {isSelected && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={baseSize + 2}
          fill="none"
          stroke="white"
          strokeWidth={0.2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Core node */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={baseSize}
        fill={config.bgColor}
        stroke={isSelected ? 'white' : config.borderColor}
        strokeWidth={isSelected ? 0.4 : 0.2}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 6px ${config.color})`
            : isHovered
              ? `drop-shadow(0 0 4px ${config.color})`
              : `drop-shadow(0 0 2px ${config.glowColor})`,
        }}
        drag
        dragConstraints={{ left: 0, right: 100, top: 0, bottom: 100 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          // Use the offset to approximate position change
          const newX = node.x + info.offset.x * 0.1;
          const newY = node.y + info.offset.y * 0.1;
          onDragEnd(
            Math.max(5, Math.min(95, newX)),
            Math.max(5, Math.min(95, newY)),
          );
        }}
      />

      {/* Inner highlight dot */}
      <circle
        cx={node.x - baseSize * 0.25}
        cy={node.y - baseSize * 0.25}
        r={baseSize * 0.2}
        fill="white"
        opacity={0.15}
      />

      {/* Category icon indicator (small colored dot) */}
      <circle cx={node.x + baseSize * 0.6} cy={node.y - baseSize * 0.6} r={0.8} fill={config.color} />

      {/* Intensity dots */}
      {Array.from({ length: node.intensity }).map((_, i) => (
        <circle
          key={i}
          cx={node.x - ((node.intensity - 1) * 0.6) / 2 + i * 0.6}
          cy={node.y + baseSize + 1.5}
          r={0.25}
          fill={emotionConfig.color}
          opacity={0.7}
        />
      ))}

      {/* Node label */}
      <text
        x={node.x}
        y={node.y + baseSize + 3.5}
        textAnchor="middle"
        className="pointer-events-none select-none"
        style={{
          fontSize: isSelected || isHovered ? '2.8px' : '2.4px',
          fill: isSelected ? 'white' : isHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
          fontWeight: isSelected ? 600 : 500,
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '0.02em',
          transition: 'all 0.3s ease',
        }}
      >
        {node.label}
      </text>

      {/* Emotion emoji on hover */}
      {isHovered && (
        <motion.text
          x={node.x}
          y={node.y - baseSize - 2}
          textAnchor="middle"
          initial={{ opacity: 0, y: node.y - baseSize }}
          animate={{ opacity: 1, y: node.y - baseSize - 2 }}
          exit={{ opacity: 0 }}
          style={{ fontSize: '3px' }}
          className="pointer-events-none"
        >
          {emotionConfig.emoji}
        </motion.text>
      )}
    </motion.g>
  );
}

// ── Background particles ─────────────────────────────────────────────────

function BackgroundStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        cx: ((i * 37 + 13) % 100),
        cy: ((i * 53 + 7) % 100),
        r: 0.06 + (i % 4) * 0.04,
        delay: (i % 6) * 0.4,
        duration: 4 + (i % 3),
      })),
    [],
  );

  return (
    <g>
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="white"
          opacity={0.2}
          style={{
            animation: `starTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </g>
  );
}

// ── Main Component ───────────────────────────────────────────────────────

export default function ConstellationCanvas({
  nodes,
  connections,
  viewState,
  onSelectNode,
  onHoverNode,
  onMoveNode,
  onZoom,
  onPan,
}: ConstellationCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Zoom with mouse wheel
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoom(viewState.zoom + delta);
    },
    [viewState.zoom, onZoom],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Pan with mouse drag on background
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as Element).closest('circle, text, path') && !(e.target as Element).closest('[data-bg]')) return;
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: viewState.panX, panY: viewState.panY };
    },
    [viewState.panX, viewState.panY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      onPan(panStartRef.current.panX + dx, panStartRef.current.panY + dy);
    },
    [isPanning, onPan],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Click on background to deselect
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as Element) === svgRef.current || (e.target as Element).hasAttribute('data-bg')) {
        onSelectNode(null);
      }
    },
    [onSelectNode],
  );

  // Build node map for fast lookups
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- interactive canvas with role="application" */
    <div
      ref={containerRef}
      role="application"
      aria-label="Soul Constellation interactive canvas"
      tabIndex={0}
      className="relative w-full h-full rounded-[30px] overflow-hidden bg-[#060608] border border-[#1a1a1a]/60"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      {/* Star twinkle keyframe — one CSS animation shared by all stars */}
      <style>{`@keyframes starTwinkle{0%,100%{opacity:.1}50%{opacity:.4}}`}</style>

      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.005] rounded-full blur-[80px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleBackgroundClick}
        style={{
          transform: `scale(${viewState.zoom}) translate(${viewState.panX / 10}px, ${viewState.panY / 10}px)`,
          transformOrigin: 'center',
          transition: isPanning ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* Background rectangle for click detection */}
        <rect data-bg="true" x="0" y="0" width="100" height="100" fill="transparent" />

        {/* Background stars */}
        <BackgroundStars />

        {/* Connection lines (render below nodes) */}
        <AnimatePresence>
          {connections.map((conn) => {
            const source = nodeMap.get(conn.sourceId);
            const target = nodeMap.get(conn.targetId);
            if (!source || !target) return null;

            const isHighlighted =
              viewState.selectedNodeId === conn.sourceId ||
              viewState.selectedNodeId === conn.targetId ||
              viewState.hoveredNodeId === conn.sourceId ||
              viewState.hoveredNodeId === conn.targetId;

            return (
              <ConnectionLine
                key={conn.id}
                connection={conn}
                sourceNode={source}
                targetNode={target}
                isHighlighted={isHighlighted}
                hoveredNodeId={viewState.hoveredNodeId}
              />
            );
          })}
        </AnimatePresence>

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((node) => {
            const isSelected = viewState.selectedNodeId === node.id;
            const isHovered = viewState.hoveredNodeId === node.id;
            const isDimmed =
              viewState.hoveredNodeId !== null &&
              viewState.hoveredNodeId !== node.id &&
              !connections.some(
                (c) =>
                  (c.sourceId === viewState.hoveredNodeId && c.targetId === node.id) ||
                  (c.targetId === viewState.hoveredNodeId && c.sourceId === node.id),
              );

            return (
              <ConstellationNodeComponent
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                isDimmed={isDimmed}
                onSelect={() => onSelectNode(node.id)}
                onHover={() => onHoverNode(node.id)}
                onHoverEnd={() => onHoverNode(null)}
                onDragEnd={(x, y) => onMoveNode(node.id, x, y)}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
        <button
          onClick={() => onZoom(viewState.zoom + 0.2)}
          aria-label="Zoom in"
          className="w-9 h-9 rounded-xl bg-[#111]/80 border border-[#2b2b2b] flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1a1a1a] transition-all backdrop-blur-sm text-lg font-light"
        >
          +
        </button>
        <button
          onClick={() => onZoom(viewState.zoom - 0.2)}
          aria-label="Zoom out"
          className="w-9 h-9 rounded-xl bg-[#111]/80 border border-[#2b2b2b] flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1a1a1a] transition-all backdrop-blur-sm text-lg font-light"
        >
          −
        </button>
        <button
          onClick={() => {
            onZoom(1);
            onPan(0, 0);
          }}
          aria-label="Center view"
          className="w-9 h-9 rounded-xl bg-[#111]/80 border border-[#2b2b2b] flex items-center justify-center text-white/50 hover:text-white hover:bg-[#1a1a1a] transition-all backdrop-blur-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
      </div>

      {/* Zoom level indicator */}
      {viewState.zoom !== 1 && (
        <div className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full bg-[#111]/60 border border-[#2b2b2b] backdrop-blur-sm">
          <span className="text-xs text-white/50 font-mono">{Math.round(viewState.zoom * 100)}%</span>
        </div>
      )}
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}
