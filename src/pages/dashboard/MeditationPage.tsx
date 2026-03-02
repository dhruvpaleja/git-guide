import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, X, Loader2, Timer } from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';

interface MeditationLog {
  id: string;
  duration: number;
  type: string;
  trackName: string | null;
  completed: boolean;
  createdAt: string;
}

const TYPES = ['guided', 'unguided', 'breathwork'] as const;

function formatSeconds(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s > 0 ? s + 's' : ''}` : `${s}s`;
}

export default function MeditationPage() {
  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState(10);
  const [type, setType] = useState<typeof TYPES[number]>('guided');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<MeditationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    const res = await apiService.get<{ logs: MeditationLog[]; totalMinutes: number }>('/health-tools/meditation');
    if (res.success && res.data) {
      setLogs(res.data.logs);
      setTotalMinutes(res.data.totalMinutes);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { void loadLogs(); }, [loadLogs]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const res = await apiService.post('/health-tools/meditation', {
      duration,
      type: type.toUpperCase() as 'GUIDED' | 'UNGUIDED' | 'BREATHWORK',
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Meditation logged!');
      setShowForm(false);
      void loadLogs();
    } else {
      toast.error('Failed to log meditation');
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Meditation</h1>
          <p className="text-sm text-white/40 mt-1">
            {isLoading ? '—' : `${totalMinutes} total minutes`} · Your stillness log
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Session
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-8 p-6 rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/80"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white/90 font-semibold">Log Meditation Session</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 uppercase tracking-widest">Duration</span>
                <span className="text-lg font-semibold text-white">{duration} min</span>
              </div>
              <input
                type="range" min={1} max={60} value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-[#2b2b2b] appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/30">1 min</span>
                <span className="text-[10px] text-white/30">60 min</span>
              </div>
            </div>

            {/* Type */}
            <div className="mb-6">
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-3">Type</span>
              <div className="flex gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-2xl text-sm font-medium transition-colors capitalize ${type === t ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              Save Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20">
          <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No meditation sessions logged yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {logs.map(log => (
            <div key={log.id} className="p-4 rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b]/60 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Timer className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white/80 capitalize">{log.type} Meditation</span>
                  <span className="text-xs text-white/30 shrink-0">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{formatSeconds(log.duration)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
