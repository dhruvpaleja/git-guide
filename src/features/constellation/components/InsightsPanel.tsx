/**
 * InsightsPanel
 * AI-powered pattern recognition and suggestions sidebar
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  Trophy,
  Lightbulb,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils.js';
import type { ConstellationInsight } from '../types/index.js';

interface InsightsPanelProps {
  insights: ConstellationInsight[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onSelectInsight: (nodeIds: string[]) => void;
}

const insightIcons = {
  pattern: Brain,
  warning: AlertTriangle,
  suggestion: Lightbulb,
  milestone: Trophy,
};

const insightStyles = {
  pattern: {
    bg: 'bg-purple-500/[0.06]',
    border: 'border-purple-500/15',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400',
  },
  warning: {
    bg: 'bg-red-500/[0.06]',
    border: 'border-red-500/15',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    badge: 'bg-red-500/10 text-red-400',
  },
  suggestion: {
    bg: 'bg-blue-500/[0.06]',
    border: 'border-blue-500/15',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  milestone: {
    bg: 'bg-amber-500/[0.06]',
    border: 'border-amber-500/15',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400',
  },
};

const severityDots: Record<string, string> = {
  info: 'bg-blue-400',
  low: 'bg-green-400',
  medium: 'bg-amber-400',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

export default function InsightsPanel({
  insights,
  isOpen,
  onClose,
  onMarkRead,
  onSelectInsight,
}: InsightsPanelProps) {
  const unreadCount = insights.filter((i) => !i.isRead).length;
  const sortedInsights = [...insights].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full overflow-hidden flex-shrink-0"
        >
          <div className="w-[380px] h-full rounded-[30px] bg-[#0c0c0c] border border-[#1a1a1a] p-6 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">System Intelligence</h3>
                  <p className="text-xs text-white/30">
                    {unreadCount > 0 ? `${unreadCount} new insight${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Insights List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3">
              {sortedInsights.map((insight, idx) => {
                const Icon = insightIcons[insight.type];
                const style = insightStyles[insight.type];

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={cn(
                      'relative p-4 rounded-2xl border transition-all',
                      style.bg,
                      style.border,
                      insight.isRead ? 'opacity-60' : 'opacity-100',
                    )}
                  >
                    {/* Unread dot */}
                    {!insight.isRead && (
                      <div className={cn('absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse', severityDots[insight.severity])} />
                    )}

                    <div className="flex items-start gap-3">
                      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', style.iconBg)}>
                        <Icon className={cn('w-4 h-4', style.iconColor)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider', style.badge)}>
                            {insight.type}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-white/90 mb-1">{insight.title}</h4>
                        <p className="text-xs text-white/50 leading-relaxed">{insight.description}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {insight.actionLabel && (
                            <button
                              onClick={() => onSelectInsight(insight.relatedNodeIds)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/[0.08] text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            >
                              {insight.actionLabel}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {!insight.isRead && (
                            <button
                              onClick={() => onMarkRead(insight.id)}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {insights.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-sm text-white/40">No insights yet</p>
                  <p className="text-xs text-white/20 mt-1">Add more nodes to unlock pattern detection</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
