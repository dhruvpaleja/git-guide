/**
 * ConstellationPage
 * Full-screen AI-driven emotional mapping experience.
 * All nodes are created by AI from mood logs, journal entries, chat, onboarding,
 * therapy session transcripts, and Vedic astrology data.
 * Users do NOT add nodes manually — the constellation is a mirror, not a canvas.
 * Accessible at /dashboard/constellation
 */

import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Filter,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  Network,
  BookOpen,
  MessageCircle,
  Smile,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConstellation } from '../hooks/useConstellation.js';
import ConstellationCanvas from '../components/ConstellationCanvas.js';
import NodeDetailPanel from '../components/NodeDetailPanel.js';
import InsightsPanel from '../components/InsightsPanel.js';
import { CATEGORY_CONFIGS, NODE_SOURCE_LABELS, type NodeCategory } from '../types/index.js';
import { cn } from '@/lib/utils.js';

const filterCategories: { key: NodeCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Nodes' },
  ...Object.entries(CATEGORY_CONFIGS).map(([key, conf]) => ({
    key: key as NodeCategory,
    label: conf.label,
  })),
];

// ── AI source icon helpers — use canonical constant from types ────────────
// (Re-exported as prop for NodeDetailPanel)
const SOURCE_LABELS = NODE_SOURCE_LABELS;

// ── Empty state component ─────────────────────────────────────────────────

function EmptyConstellationPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="max-w-sm w-full mx-6 rounded-[28px] bg-white/[0.03] border border-white/[0.07] p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>

        <h2 className="text-base font-semibold text-white/90 mb-2">
          Your constellation is being mapped
        </h2>
        <p className="text-xs text-white/45 leading-relaxed mb-6">
          Your emotional universe takes shape as the AI learns from your daily interactions.
          No manual entry needed — just live your life on Soul Yatri.
        </p>

        {/* Source cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: BookOpen, label: 'Journal', sub: 'Write freely', to: '/dashboard/journal', color: 'from-violet-500/10 to-violet-500/5' },
            { icon: Smile,     label: 'Mood',    sub: 'Log today',   to: '/dashboard/mood',    color: 'from-amber-500/10 to-amber-500/5' },
            { icon: MessageCircle, label: 'SoulBot', sub: 'Chat',   to: '/dashboard/chat',    color: 'from-sky-500/10 to-sky-500/5' },
          ].map(({ icon: Icon, label, sub, to, color }) => (
            <Link
              key={label}
              to={to}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-b border border-white/[0.06] hover:border-white/15 transition-all group',
                color,
              )}
            >
              <Icon className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
              <span className="text-[11px] font-medium text-white/70">{label}</span>
              <span className="text-[10px] text-white/30">{sub}</span>
            </Link>
          ))}
        </div>

        <p className="text-[11px] text-white/30 flex items-center justify-center gap-1.5">
          <Info className="w-3 h-3" />
          Nodes appear within seconds of your next entry
        </p>
      </div>
    </motion.div>
  );
}

// ── AI generation hint banner ─────────────────────────────────────────────

function AiGenerationHint({ nodeCount }: { nodeCount: number }) {
  if (nodeCount >= 5) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 border border-accent/10 text-xs text-accent/70 mb-3 flex-shrink-0"
    >
      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
      <span>
        {nodeCount === 0
          ? 'Your constellation grows automatically from your journals, moods & chats.'
          : `${nodeCount} node${nodeCount !== 1 ? 's' : ''} mapped so far — keep journaling to discover more patterns.`}
      </span>
    </motion.div>
  );
}

export default function ConstellationPage() {
  useDocumentTitle('Soul Constellation');
  const {
    nodes,
    connections,
    insights,
    unreadInsightCount,
    isLoading,
    error,
    viewState,
    setSelectedNode,
    setHoveredNode,
    setZoom,
    setPan,
    setActiveFilter,
    toggleInsights,
    deleteNode,
    moveNode,
    updateNode,
    markInsightRead,
    selectedNode,
    filteredNodes,
    refetch,
  } = useConstellation();

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleInsightSelect = useCallback(
    (nodeIds: string[]) => {
      if (nodeIds.length > 0) {
        setSelectedNode(nodeIds[0]);
      }
    },
    [setSelectedNode],
  );

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan(0, 0);
    setSelectedNode(null);
    setActiveFilter('all');
  }, [setZoom, setPan, setSelectedNode, setActiveFilter]);

  // ── Loading state ────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center animate-pulse">
              <Network className="w-7 h-7 text-accent/50" />
            </div>
            <Loader2 className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm text-white/50">Loading your constellation...</p>
            <p className="text-xs text-white/25 mt-1">AI is mapping emotional patterns</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 p-8 rounded-[30px] bg-red-500/5 border border-red-500/15"
        >
          <AlertCircle className="w-10 h-10 text-red-400/60" />
          <p className="text-sm text-red-400/80">{error}</p>
          <button
            onClick={() => void refetch()}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/60 hover:text-white transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const isEmpty = nodes.length === 0;

  // ── Main Layout ──────────────────────────────────────────────────────

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-2 flex-shrink-0 px-1"
      >
        <div>
          <h1 className="text-xl font-semibold text-white/90 tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            The Constellation
          </h1>
          <p className="text-sm text-white/50 mt-1 ml-12">
            {nodes.length > 0 ? (
              <>
                {nodes.length} node{nodes.length !== 1 ? 's' : ''} &middot;{' '}
                {connections.length} connection{connections.length !== 1 ? 's' : ''} &middot;{' '}
                <span className="text-accent/60">AI-generated</span>
              </>
            ) : (
              <span className="text-white/30 italic">Awaiting your first entry…</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          {!isEmpty && (
            <div className="relative">
              <button
                onClick={() => {
                  const el = document.getElementById('filter-dropdown');
                  if (el) el.classList.toggle('hidden');
                }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                  viewState.activeFilter !== 'all'
                    ? 'bg-accent/10 border-accent/20 text-accent'
                    : 'bg-white/5 border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/10',
                )}
              >
                <Filter className="w-3.5 h-3.5" />
                {viewState.activeFilter === 'all'
                  ? 'Filter'
                  : CATEGORY_CONFIGS[viewState.activeFilter]?.label}
              </button>

              <div
                id="filter-dropdown"
                className="hidden absolute right-0 top-full mt-2 w-48 bg-[#111] border border-[#2a2a2a] rounded-2xl p-2 z-50 shadow-xl"
              >
                {filterCategories.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveFilter(key);
                      document.getElementById('filter-dropdown')?.classList.add('hidden');
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all',
                      viewState.activeFilter === key
                        ? 'bg-accent/10 text-accent'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                    )}
                  >
                    {key !== 'all' && (
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: CATEGORY_CONFIGS[key as NodeCategory]?.color }}
                      />
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Insights toggle */}
          {!isEmpty && (
            <button
              onClick={toggleInsights}
              className={cn(
                'relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                viewState.showInsights
                  ? 'bg-accent/10 border-accent/20 text-accent'
                  : 'bg-white/5 border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/10',
              )}
            >
              <Brain className="w-3.5 h-3.5" />
              Insights
              {unreadInsightCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadInsightCount}
                </span>
              )}
            </button>
          )}

          {/* Reset */}
          {!isEmpty && (
            <button
              onClick={handleResetView}
              aria-label="Reset view"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* AI hint banner (shown when <5 nodes, hidden when constellation is rich) */}
      <AiGenerationHint nodeCount={nodes.length} />

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* Canvas — always rendered; empty state overlays it */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0 relative"
        >
          {isEmpty ? (
            <EmptyConstellationPrompt />
          ) : (
            <ConstellationCanvas
              nodes={filteredNodes}
              connections={connections}
              viewState={viewState}
              onSelectNode={setSelectedNode}
              onHoverNode={setHoveredNode}
              onMoveNode={moveNode}
              onZoom={setZoom}
              onPan={setPan}
            />
          )}
        </motion.div>

        {/* Node Detail Panel — shown when node is selected */}
        <AnimatePresence>
          {selectedNode && (
            <NodeDetailPanel
              node={selectedNode}
              allNodes={nodes}
              connections={connections.filter(
                (c) =>
                  c.sourceId === selectedNode.id || c.targetId === selectedNode.id,
              )}
              sourceLabels={SOURCE_LABELS}
              onClose={() => setSelectedNode(null)}
              onDelete={deleteNode}
              onTogglePin={(nodeId, pinned) => void updateNode(nodeId, { isPinned: pinned })}
              onSelectNode={(id) => setSelectedNode(id)}
            />
          )}
        </AnimatePresence>

        {/* Insights Panel */}
        <InsightsPanel
          insights={insights}
          isOpen={viewState.showInsights && !isEmpty}
          onClose={toggleInsights}
          onMarkRead={markInsightRead}
          onSelectInsight={handleInsightSelect}
        />
      </div>

      {/* Floating Journal CTA — replaces the old "+" add node FAB */}
      <AnimatePresence>
        {!isEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Link
              to="/dashboard/journal"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-accent hover:bg-accent/90 shadow-[0_8px_30px_-4px] shadow-accent/30 text-white text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Add to Journal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

