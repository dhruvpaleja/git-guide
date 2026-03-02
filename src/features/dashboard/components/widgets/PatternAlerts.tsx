import { AlertTriangle, Clock, TrendingDown, Repeat, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
        label: 'Behavioral Loop Detected',
        message: 'You mentioned "Burnout" precisely 3 days before every major deadline for the last 4 months. You are self-sabotaging the exact same way you did with the Q3 Deliverables.',
        highlight: 'Burnout',
        actionText: 'View Constellation History',
        actionRoute: '/dashboard/constellation',
        time: '2h ago',
    },
    {
        id: '2',
        type: 'insight',
        label: 'Positive Shift Detected',
        message: 'Your anxiety node intensity has decreased 23% over the past week. Morning meditation sessions correlate strongly with this improvement.',
        actionText: 'See Trend',
        actionRoute: '/dashboard/mood',
        time: '6h ago',
    },
    {
        id: '3',
        type: 'pattern',
        label: 'Recurring Frequency',
        message: 'Every Sunday evening, your stress node activates. This pattern has repeated for 6 consecutive weeks. Consider preemptive journaling.',
        actionText: 'Set Reminder',
        actionRoute: '/dashboard/journal',
        time: '1d ago',
    },
];

const typeConfig = {
    warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/10', dotColor: 'bg-red-500' },
    insight: { icon: Sparkles, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/10', dotColor: 'bg-accent' },
    pattern: { icon: Repeat, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10', dotColor: 'bg-amber-500' },
};

export default function PatternAlerts() {
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const visibleAlerts = ALERTS.filter((a) => !dismissed.has(a.id));

    return (
        <div className="w-full rounded-[24px] p-5 bg-[#0c0c0c] border border-[#2b2b2b]/60">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center">
                        <TrendingDown className="w-4 h-4 text-white/50" />
                    </div>
                    <h3 className="text-white/90 font-semibold tracking-tight text-sm">System Intelligence</h3>
                </div>
                {visibleAlerts.length > 0 && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10">
                        <span className="text-[11px] font-semibold text-red-400">{visibleAlerts.length}</span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {visibleAlerts.map((alert, idx) => {
                    const config = typeConfig[alert.type];
                    const Icon = config.icon;
                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className={cn('p-4 rounded-2xl bg-[#111]/80 border', config.border)}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className={cn('w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5', config.bg)}>
                                    <Icon className={cn('w-3.5 h-3.5', config.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className={cn('text-[11px] font-semibold uppercase tracking-wider', config.color)}>
                                            {alert.label}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-white/20">
                                            <Clock className="w-2.5 h-2.5" />
                                            {alert.time}
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-white/70 leading-relaxed">
                                        {alert.highlight ? (
                                            <>
                                                {alert.message.split(alert.highlight).map((part, i, arr) => (
                                                    <span key={i}>
                                                        {part}
                                                        {i < arr.length - 1 && (
                                                            <span className="text-white font-medium">{alert.highlight}</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </>
                                        ) : (
                                            alert.message
                                        )}
                                    </p>
                                    <div className="mt-2.5 flex items-center justify-between">
                                        <button
                                            onClick={() => navigate(alert.actionRoute)}
                                            className="text-[11px] text-white/30 hover:text-white/60 transition-colors underline underline-offset-2"
                                        >
                                            {alert.actionText}
                                        </button>
                                        <button
                                            onClick={() => setDismissed((s) => new Set(s).add(alert.id))}
                                            className="text-[10px] text-white/15 hover:text-white/40 transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {visibleAlerts.length === 0 && (
                    <div className="py-6 text-center">
                        <Sparkles className="w-5 h-5 text-white/10 mx-auto mb-2" />
                        <p className="text-[12px] text-white/25">All clear. No active alerts.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
