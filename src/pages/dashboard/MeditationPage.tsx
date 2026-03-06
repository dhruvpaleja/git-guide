import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, X, Loader2, Timer, Pause, Play, RotateCcw, Flame } from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

/* ── Quick Timer ────────────────────────────────────────────── */
function QuickTimer() {
  const [preset, setPreset] = useState(5);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRemaining(preset * 60);
    setRunning(true);
  };

  const toggle = () => setRunning(r => !r);
  const reset = () => { setRunning(false); setRemaining(0); };

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => setRemaining(r => r - 1), 1000);
    } else if (remaining <= 0 && running) {
      // Use setTimeout to avoid setting state directly in effect
      setTimeout(() => {
        setRunning(false);
        toast.success('Meditation complete!');
      }, 0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const progress = remaining > 0 ? 1 - remaining / (preset * 60) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/60 p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-white/70">Quick Timer</span>
      </div>

      {remaining === 0 && !running ? (
        <div className="flex items-center gap-3">
          {[3, 5, 10, 15, 20].map(m => (
            <button
              key={m}
              onClick={() => setPreset(m)}
              className={cn(
                'flex-1 py-2 rounded-xl text-sm font-medium transition-colors border',
                preset === m
                  ? 'bg-accent/10 text-accent border-accent/20'
                  : 'bg-white/[0.05] text-white/50 border-white/[0.06] hover:bg-white/[0.07]',
              )}
            >
              {m}m
            </button>
          ))}
          <button
            onClick={start}
            className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Start
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-3xl font-mono font-semibold text-white tracking-wider">{mm}:{ss}</div>
            <div className="h-1 rounded-full bg-white/[0.06] mt-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggle} aria-label={running ? 'Pause timer' : 'Play timer'} className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
              {running ? <Pause className="w-4 h-4 text-white/60" /> : <Play className="w-4 h-4 text-white/60" />}
            </button>
            <button onClick={reset} aria-label="Reset timer" className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
              <RotateCcw className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function MeditationPage() {
  useDocumentTitle('Meditation');
  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState(10);
  const [type, setType] = useState<typeof TYPES[number]>('guided');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<MeditationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await apiService.get<{ logs: MeditationLog[]; totalMinutes: number }>('/health-tools/meditation');
      if (res.success && res.data) {
        setLogs(res.data.logs);
        setTotalMinutes(res.data.totalMinutes);
      }
    } catch {
      setLoadError('Failed to load meditation logs');
      toast.error('Failed to load meditation logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadLogs(); }, [loadLogs]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Optimistic: show it instantly
    const optimistic: MeditationLog = {
      id: `temp-${Date.now()}`,
      duration,
      type: type.toUpperCase() as 'GUIDED' | 'UNGUIDED' | 'BREATHWORK',
      trackName: null,
      completed: true,
      createdAt: new Date().toISOString(),
    };
    setLogs((prev) => [optimistic, ...prev]);
    setTotalMinutes((prev) => prev + duration);
    toast.success('Meditation logged!');
    const savedDuration = duration;
    const savedType = type;
    setShowForm(false);
    setIsSubmitting(false);

    // Persist in background
    try {
      const res = await apiService.post('/health-tools/meditation', {
        duration: savedDuration,
        type: savedType.toUpperCase() as 'GUIDED' | 'UNGUIDED' | 'BREATHWORK',
      });
      if (res.success) {
        void loadLogs();
      }
    } catch {
      toast.error('Session may not have saved to server');
    }
  };

  return (
    <div className="w-full pb-20">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center">
            <Brain className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Meditation</h1>
            <p className="text-sm text-white/35 mt-0.5">
              {isLoading ? '—' : `${totalMinutes} total minutes`} · Your stillness log
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {logs.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-white/50">{logs.length} sessions</span>
            </div>
          )}
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log Session
          </button>
        </div>
      </motion.div>

      {/* Quick Timer */}
      <QuickTimer />

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
              <button onClick={() => setShowForm(false)} aria-label="Close form" className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-widest">Duration</span>
                <span className="text-lg font-semibold text-white">{duration} min</span>
              </div>
              <input
                type="range" min={1} max={60} value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-[#2b2b2b] appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/50">1 min</span>
                <span className="text-[10px] text-white/50">60 min</span>
              </div>
            </div>

            {/* Type */}
            <div className="mb-6">
              <span className="text-xs text-white/50 uppercase tracking-widest block mb-3">Type</span>
              <div className="flex gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-2xl text-sm font-medium transition-colors capitalize ${type === t ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}
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

      <div aria-live="polite">
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : loadError ? (
        <div className="text-center py-20">
          <p className="text-white/50 mb-3">{loadError}</p>
          <button onClick={() => void loadLogs()} className="text-sm text-accent underline">Try again</button>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20">
          <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No meditation sessions logged yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-5 rounded-[20px] bg-[#0c0c0c] border border-[#2b2b2b]/60 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center shrink-0">
                <Timer className="w-5 h-5 text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white/80 capitalize">{log.type} Meditation</span>
                  <span className="text-xs text-white/50 shrink-0">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">{formatSeconds(log.duration)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
