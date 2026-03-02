/**
 * ConstellationPage
 * Full-screen interactive emotional mapping experience
 * Accessible at /dashboard/constellation
 */

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Brain,
  Filter,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  Network,
} from 'lucide-react';
import { useConstellation } from '../hooks/useConstellation.js';
import ConstellationCanvas from '../components/ConstellationCanvas.js';
import NodeDetailPanel from '../components/NodeDetailPanel.js';
import AddNodeModal from '../components/AddNodeModal.js';
import InsightsPanel from '../components/InsightsPanel.js';
import { CATEGORY_CONFIGS, type NodeCategory } from '../types/index.js';
import { cn } from '@/lib/utils.js';

const filterCategories: { key: NodeCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Nodes' },
  ...Object.entries(CATEGORY_CONFIGS).map(([key, conf]) => ({
    key: key as NodeCategory,
    label: conf.label,
  })),
];

export default function ConstellationPage() {
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
    setIsAddingNode,
    setActiveFilter,
    toggleInsights,
    createNode,
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
            <p className="text-xs text-white/25 mt-1">Mapping emotional patterns</p>
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

  // ── Main Layout ──────────────────────────────────────────────────────

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 flex-shrink-0 px-1"
      >
        <div>
          <h1 className="text-xl font-semibold text-white/90 tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            The Constellation
          </h1>
          <p className="text-sm text-white/30 mt-1 ml-12">
            {nodes.length} node{nodes.length !== 1 ? 's' : ''} &middot;{' '}
            {connections.length} connection{connections.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
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

          {/* Insights toggle */}
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

          {/* Reset */}
          <button
            onClick={handleResetView}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0"
        >
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
        </motion.div>

        {/* Node Detail Panel */}
        <NodeDetailPanel
          node={selectedNode}
          allNodes={nodes}
          connections={connections.filter(
            (c) =>
              selectedNode &&
              (c.sourceId === selectedNode.id || c.targetId === selectedNode.id),
          )}
          onClose={() => setSelectedNode(null)}
          onEdit={() => { setIsAddingNode(true); }}
          onDelete={deleteNode}
          onTogglePin={(nodeId, pinned) => void updateNode(nodeId, { isPinned: pinned })}
          onSelectNode={(id) => setSelectedNode(id)}
        />

        {/* Insights Panel */}
        <InsightsPanel
          insights={insights}
          isOpen={viewState.showInsights}
          onClose={toggleInsights}
          onMarkRead={markInsightRead}
          onSelectInsight={handleInsightSelect}
        />
      </div>

      {/* Floating Add Node Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddingNode(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-[0_8px_30px_-4px] shadow-accent/30 flex items-center justify-center z-50 transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Add Node Modal */}
      <AddNodeModal
        isOpen={viewState.isAddingNode}
        onClose={() => setIsAddingNode(false)}
        onSubmit={createNode}
      />
    </div>
  );
}
