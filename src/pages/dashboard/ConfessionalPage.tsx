import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowUp, CheckCircle2, Loader2, Shield, Lock, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiService from '@/services/api.service';
import { toast } from 'sonner';

interface ConfessionEntry {
  id: string;
  content: string;
  createdAt: string;
}

export default function ConfessionalPage() {
  useDocumentTitle('The Confessional');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [entries, setEntries] = useState<ConfessionEntry[]>([]);

  // Load previous confessional entries (journal entries with title "Confessional")
  useEffect(() => {
    let cancelled = false;
    apiService.get<{ entries: Array<{ id: string; title?: string; content: string; createdAt: string }> }>('/health-tools/journal')
      .then((res) => {
        if (!cancelled && res.success && res.data?.entries) {
          const confessions = res.data.entries
            .filter((e) => e.title === 'Confessional')
            .map((e) => ({ id: e.id, content: e.content, createdAt: e.createdAt }));
          setEntries(confessions);
        }
      })
      .catch(() => {/* silent */})
      .finally(() => { if (!cancelled) { /* done */ } });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!text.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await apiService.post('/health-tools/journal', {
        title: 'Confessional',
        content: text.trim(),
        isPrivate: true,
      });
      setEntries((prev) => [
        { id: crypto.randomUUID(), content: text.trim(), createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setSubmitted(true);
      setText('');
      setTimeout(() => setSubmitted(false), 2500);
    } catch {
      // silently handle — the safe room never judges
    } finally {
      setIsSubmitting(false);
    }
  }, [text, isSubmitting]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white/90 tracking-tight">The Confessional</h1>
            <p className="text-sm text-white/50">Your safe room. Nothing leaves here.</p>
          </div>
        </div>

        {/* Trust badges */}
        <p className="text-xs text-white/25 mt-3 ml-[52px] flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>
          <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3" /> No judgment</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Always open</span>
        </p>
      </motion.div>

      {/* Main Confession Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div
          className={cn(
            'relative w-full rounded-[24px] border transition-all duration-500 overflow-hidden flex flex-col',
            isFocused
              ? 'bg-[#111] border-white/10 min-h-[280px]'
              : 'bg-[#0c0c0c] border-[#2b2b2b] min-h-[160px] hover:bg-[#111] hover:border-white/10',
          )}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <span className="text-white/70 text-base font-medium">
                  Received. The constellation updates.
                </span>
              </motion.div>
            ) : (
              <motion.div key="input" className="flex-1 flex flex-col">
                <textarea
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    if (!text) setIsFocused(false);
                  }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Spill. What generated that friction today?"
                  className="flex-1 w-full bg-transparent resize-none p-6 text-white/90 placeholder:text-white/30 focus:outline-none text-lg tracking-[-0.01em] leading-relaxed hide-scrollbar min-h-[120px]"
                />

                {/* Bottom action bar */}
                <div className="h-14 px-4 pb-4 w-full flex items-center justify-between mt-auto">
                  <button
                    className="flex items-center gap-2 group px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
                    title="Voice Vent (3 min max)"
                    type="button"
                    onClick={() => toast.info('Voice Vent coming soon — type it out for now.')}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                        isFocused
                          ? 'bg-accent/10'
                          : 'bg-white/5 group-hover:bg-white/[0.08]',
                      )}
                    >
                      <Mic
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isFocused ? 'text-accent' : 'text-white/50 group-hover:text-white/80',
                        )}
                      />
                    </div>
                    {isFocused && (
                      <span className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors">
                        Voice Vent
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {text.length > 0 && isFocused && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        type="button"
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ArrowUp className="w-5 h-5" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ambient warm glow */}
          {isFocused && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-accent/10 blur-[40px] pointer-events-none rounded-full" />
          )}
        </div>
      </motion.div>

      {/* Previous confessions (this session) */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <h3 className="text-white/50 uppercase tracking-wider text-xs font-semibold mb-4 ml-2">
            Previous confessions
          </h3>

          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1a1a1a]"
              >
                <p className="text-sm text-white/50 leading-relaxed">{entry.content}</p>
                <p className="text-[11px] text-white/50 mt-2">
                  {new Date(entry.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
