/**
 * NodeDetailPanel
 * Slide-out panel showing selected node details, emotion history,
 * connections, and actions (edit/delete/connect)
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Edit3,
  Trash2,
  Pin,
  PinOff,
  Clock,
  Tag,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils.js';
import type { ConstellationNode, ConstellationConnection } from '../types/index.js';
import { CATEGORY_CONFIGS, EMOTION_CONFIGS } from '../types/index.js';

interface NodeDetailPanelProps {
  node: ConstellationNode | null;
  connections: ConstellationConnection[];
  allNodes: ConstellationNode[];
  onClose: () => void;
  onEdit: (node: ConstellationNode) => void;
  onDelete: (nodeId: string) => void;
  onTogglePin: (nodeId: string, pinned: boolean) => void;
  onSelectNode: (nodeId: string) => void;
}

export default function NodeDetailPanel({
  node,
  connections,
  allNodes,
  onClose,
  onEdit,
  onDelete,
  onTogglePin,
  onSelectNode,
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
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}
              >
                <span className="text-lg">{emotionConfig.emoji}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-white tracking-tight truncate">{node.label}</h2>
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

        {/* Description */}
        <p className="text-[15px] text-white/70 leading-relaxed mb-5">{node.description}</p>

        {/* Intensity meter */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Intensity</span>
            <span className="text-xs font-semibold" style={{ color: emotionConfig.color }}>
              {node.intensity}/5
            </span>
          </div>
          <div className="flex gap-1.5">
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
        </div>

        {/* Note */}
        {node.note && (
          <div className="mb-5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs text-white/50 uppercase tracking-wider">Note</span>
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
        <div className="flex items-center gap-4 mb-6 text-xs text-white/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>Created {formatDate(node.createdAt)}</span>
          </div>
          <span>·</span>
          <span>Updated {formatDate(node.updatedAt)}</span>
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onEdit(node)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onTogglePin(node.id, !node.isPinned)}
            aria-label={node.isPinned ? 'Unpin node' : 'Pin node'}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all',
              node.isPinned
                ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent/20'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10',
            )}
          >
            {node.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(node.id)}
            aria-label="Delete node"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
