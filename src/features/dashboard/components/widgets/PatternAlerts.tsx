import { AlertTriangle, Sparkles, Repeat, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Alert {
    id: string;
    type: 'warning' | 'insight' | 'pattern';
    label: string;
    message: string;
    highlight?: string;
    actionText: string;
    actionRoute: string;
    time: string;
}

const ALERTS: Alert[] = [
    {
        id: '1',
        type: 'warning',
        label: 'Loop Detected',
        message: 'You mentioned "Burnout" 3 days before every major deadline for the last 4 months. This mirrors your Q3 pattern exactly.',
        highlight: 'Burnout',
        actionText: 'View History',
        actionRoute: '/dashboard/constellation',
        time: '2h ago',
    },
    {
        id: '2',
        type: 'insight',
        label: 'Positive Shift',
        message: 'Anxiety intensity decreased 23% this week. Morning meditation correlates strongly with this improvement.',
        actionText: 'See Trend',
        actionRoute: '/dashboard/mood',
        time: '6h ago',
    },
    {
        id: '3',
        type: 'pattern',
        label: 'Weekly Pattern',
        message: 'Every Sunday evening, your stress node activates. 6 consecutive weeks. Consider preemptive journaling.',
        actionText: 'Set Reminder',
        actionRoute: '/dashboard/journal',
        time: '1d ago',
    },
];

const typeConfig = {
    warning: { icon: AlertTriangle, dotColor: 'bg-red-400/80', labelColor: 'text-red-400/70' },
    insight: { icon: Sparkles, dotColor: 'bg-emerald-400/80', labelColor: 'text-emerald-400/70' },
    pattern: { icon: Repeat, dotColor: 'bg-amber-400/80', labelColor: 'text-amber-400/70' },
};

export default function PatternAlerts() {
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const visibleAlerts = ALERTS.filter((a) => !dismissed.has(a.id));

    return (
        <div className="w-full h-full rounded-[20px] p-6 bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] text-white/70 font-semibold tracking-tight">Insights</h3>
                {visibleAlerts.length > 0 && (
                    <span className="text-[11px] font-medium text-white/25 bg-white/[0.04] px-2.5 py-1 rounded-full">
                        {visibleAlerts.length} new
                    </span>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {visibleAlerts.map((alert, idx) => {
                        const config = typeConfig[alert.type];
                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="rounded-2xl bg-white/[0.015] border border-white/[0.03] p-4 group hover:bg-white/[0.03] hover:border-white/[0.05] transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', config.dotColor)} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className={cn('text-[11px] font-semibold uppercase tracking-[0.06em]', config.labelColor)}>
                                                {alert.label}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-white/15 font-medium">{alert.time}</span>
                                                <button
                                                    onClick={() => setDismissed((s) => new Set(s).add(alert.id))}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3 text-white/15 hover:text-white/40" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-white/50 leading-[1.6]">
                                            {alert.highlight ? (
                                                <>
                                                    {alert.message.split(alert.highlight).map((part, i, arr) => (
                                                        <span key={i}>
                                                            {part}
                                                            {i < arr.length - 1 && (
                                                                <span className="text-white/80 font-medium">{alert.highlight}</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </>
                                            ) : (
                                                alert.message
                                            )}
                                        </p>
                                        <button
                                            onClick={() => navigate(alert.actionRoute)}
                                            className="mt-2.5 text-[11px] text-white/25 hover:text-white/55 transition-colors font-medium"
                                        >
                                            {alert.actionText} →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {visibleAlerts.length === 0 && (
                    <div className="py-8 text-center">
                        <p className="text-[12px] text-white/20">All clear. No active insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
