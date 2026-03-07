/**
 * NodeDetailPanel
 * Slide-out panel showing AI-generated node details, origin provenance,
 * intensity nudge controls, connections, and user actions.
 * Note: Nodes are AI-generated. Users can adjust intensity (+/-1), pin,
 * hide, add a note, or provide accuracy feedback — but cannot "edit" the node
 * in the traditional CRUD sense.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Pin,
  PinOff,
  Clock,
  Tag,
  MessageSquare,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  EyeOff,
  Minus,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils.js';
import type { ConstellationNode, ConstellationConnection, NodeGenerationSource, NodeSourceLabel } from '../types/index.js';
import { CATEGORY_CONFIGS, EMOTION_CONFIGS, NODE_SOURCE_LABELS } from '../types/index.js';

interface NodeDetailPanelProps {
  node: ConstellationNode | null;
  connections: ConstellationConnection[];
  allNodes: ConstellationNode[];
  /** Optional override for source label map — defaults to NODE_SOURCE_LABELS */
  sourceLabels?: Partial<Record<NodeGenerationSource, NodeSourceLabel>>;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  onTogglePin: (nodeId: string, pinned: boolean) => void;
  onSelectNode: (nodeId: string) => void;
  /** Adjust node intensity by ±1 (AI-first: users nudge, not free-set) */
  onNudgeIntensity?: (nodeId: string, delta: 1 | -1) => void;
  /** Submit RLHF feedback on a node's accuracy */
  onFeedback?: (nodeId: string, accurate: boolean) => void;
}

export default function NodeDetailPanel({
  node,
  connections,
  allNodes,
  sourceLabels,
  onClose,
  onDelete,
  onTogglePin,
  onSelectNode,
  onNudgeIntensity,
  onFeedback,
}: NodeDetailPanelProps) {
  if (!node) return null;

  const config = CATEGORY_CONFIGS[node.category];
  const emotionConfig = EMOTION_CONFIGS[node.emotion];

  // Find connected nodes
  const connectedNodes = connections.map((conn) => {
    const otherNodeId = conn.sourceId === node.id ? conn.targetId : conn.sourceId;
    const otherNode = allNodes.find((n) => n.id === otherNodeId);
    return { connection: conn, otherNode };
  }).filter((c) => c.otherNode);

  const harmonyCount = connectedNodes.filter((c) => c.connection.type === 'harmony').length;
  const frictionCount = connectedNodes.filter((c) => c.connection.type === 'friction').length;

  // Display label (user may have renamed the AI label)
  const displayLabel = node.userRenamedLabel ?? node.label;

  // Generation source — merge canonical labels with any caller overrides
  const mergedSourceLabels = { ...NODE_SOURCE_LABELS, ...sourceLabels };
  const sourceInfo = node.generationSource
    ? (mergedSourceLabels[node.generationSource] ?? { emoji: '✨', label: 'AI' })
    : { emoji: '✨', label: 'AI' };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}
              >
                <span className="text-lg">{emotionConfig.emoji}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-white tracking-tight truncate">{displayLabel}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-medium" style={{ color: config.color }}>
                    {config.label}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/50">{emotionConfig.label}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* AI origin badge */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/5 border border-accent/10">
            <Sparkles className="w-3 h-3 text-accent/60" />
            <span className="text-[10px] font-medium text-accent/70 uppercase tracking-wider">AI-generated</span>
          </div>
          {node.generationSource && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px]">{sourceInfo.emoji}</span>
              <span className="text-[10px] text-white/40">{sourceInfo.label}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[15px] text-white/70 leading-relaxed mb-5">{node.description}</p>

        {/* Intensity meter + nudge controls */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Intensity</span>
            <span className="text-xs font-semibold" style={{ color: emotionConfig.color }}>
              {node.intensity}/5
            </span>
          </div>
          <div className="flex gap-1.5 mb-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{
                  backgroundColor: i < node.intensity ? emotionConfig.color : 'rgba(255,255,255,0.06)',
                  opacity: i < node.intensity ? 0.8 : 1,
                }}
              />
            ))}
          </div>
          {/* Nudge buttons — user can adjust AI intensity by ±1 */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 flex-1">Adjust AI estimate:</span>
            <button
              aria-label="Decrease intensity"
              disabled={node.intensity <= 1}
              onClick={() => onNudgeIntensity?.(node.id, -1)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3 text-white/60" />
            </button>
            <button
              aria-label="Increase intensity"
              disabled={node.intensity >= 5}
              onClick={() => onNudgeIntensity?.(node.id, 1)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3 text-white/60" />
            </button>
          </div>
        </div>

        {/* Note */}
        {node.note && (
          <div className="mb-5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs text-white/50 uppercase tracking-wider">Your note</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed italic">"{node.note}"</p>
          </div>
        )}

        {/* Connection summary */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 p-3 rounded-2xl bg-[#1e8e3e]/[0.06] border border-[#1e8e3e]/10">
            <p className="text-2xl font-semibold text-[#1e8e3e]">{harmonyCount}</p>
            <p className="text-xs text-white/50 mt-0.5">Harmony</p>
          </div>
          <div className="flex-1 p-3 rounded-2xl bg-[#d93025]/[0.06] border border-[#d93025]/10">
            <p className="text-2xl font-semibold text-[#d93025]">{frictionCount}</p>
            <p className="text-xs text-white/50 mt-0.5">Friction</p>
          </div>
          <div className="flex-1 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-2xl font-semibold text-white/70">{connectedNodes.length}</p>
            <p className="text-xs text-white/50 mt-0.5">Total Links</p>
          </div>
        </div>

        {/* Connected nodes list */}
        {connectedNodes.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs text-white/50 uppercase tracking-wider font-medium mb-3">Connected Nodes</h3>
            <div className="space-y-2">
              {connectedNodes.map(({ connection, otherNode }) => {
                if (!otherNode) return null;
                const otherConfig = CATEGORY_CONFIGS[otherNode.category];
                const connectionColors = {
                  harmony: 'text-[#1e8e3e]',
                  friction: 'text-[#d93025]',
                  neutral: 'text-white/50',
                  evolving: 'text-purple-400',
                };
                return (
                  <button
                    key={connection.id}
                    onClick={() => onSelectNode(otherNode.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: otherConfig.bgColor, border: `1px solid ${otherConfig.borderColor}` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: otherConfig.color }} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm text-white/80 font-medium truncate">{otherNode.label}</p>
                      <p className={cn('text-xs capitalize', connectionColors[connection.type])}>
                        {connection.type} · {connection.label || 'linked'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {node.tags.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Tag className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs text-white/50 uppercase tracking-wider">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {node.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/[0.06] text-xs text-white/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center gap-4 mb-5 text-xs text-white/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>Detected {formatDate(node.createdAt)}</span>
          </div>
          <span>·</span>
          <span>Updated {formatDate(node.updatedAt)}</span>
        </div>

        {/* RLHF feedback — "Was this accurate?" */}
        <div className="mb-5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <p className="text-xs text-white/40 mb-2.5">Was this node accurately detected?</p>
          <div className="flex gap-2">
            <button
              aria-label="Yes, accurate"
              onClick={() => onFeedback?.(node.id, true)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all',
                node.feedbackAccurate === true
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-white/3 border-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/5',
              )}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Accurate
            </button>
            <button
              aria-label="Not accurate"
              onClick={() => onFeedback?.(node.id, false)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all',
                node.feedbackAccurate === false
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-white/3 border-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/5',
              )}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Not quite
            </button>
          </div>
        </div>

        {/* Secondary actions */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onTogglePin(node.id, !node.isPinned)}
            aria-label={node.isPinned ? 'Unpin node' : 'Pin node'}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl border text-sm font-medium transition-all',
              node.isPinned
                ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent/20'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10',
            )}
          >
            {node.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            {node.isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={() => onDelete(node.id)}
            aria-label="Hide node"
            title="Hide this node from view (AI may re-detect it if the pattern persists)"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white/60 hover:bg-white/10 transition-all text-sm font-medium"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

