import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Plus, X, Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';

interface MoodEntry {
  id: string;
  score: number;
  note: string | null;
  tags: string[];
  createdAt: string;
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Very Low', 2: 'Low', 3: 'Struggling', 4: 'Below Average', 5: 'Neutral',
  6: 'Okay', 7: 'Good', 8: 'Great', 9: 'Excellent', 10: 'Blissful',
};

const MOOD_COLORS: Record<number, string> = {
  1: '#ef4444', 2: '#f87171', 3: '#fb923c', 4: '#fbbf24',
  5: '#a3a3a3', 6: '#a3e635', 7: '#4ade80', 8: '#2dd4bf',
  9: '#22d3ee', 10: '#818cf8',
};

const COMMON_TAGS = ['anxious', 'calm', 'happy', 'sad', 'stressed', 'energetic', 'tired', 'hopeful', 'irritable', 'peaceful'];

/* ── Mini Trend Chart (SVG) ─────────────────────────────────── */
function MoodTrendChart({ entries }: { entries: MoodEntry[] }) {
  const recent = useMemo(() => [...entries].reverse().slice(0, 14), [entries]);
  if (recent.length < 2) return null;

  const maxH = 48;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/60 p-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-white/70">Recent Trend</span>
        <span className="text-[11px] text-white/25 ml-auto">Last {recent.length} entries</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        {recent.map((entry, i) => {
          const h = (entry.score / 10) * maxH;
          return (
            <motion.div
              key={entry.id}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-t-sm flex-1 min-w-0"
              style={{
                backgroundColor: MOOD_COLORS[entry.score] ?? '#666',
                opacity: 0.7 + (i / recent.length) * 0.3,
              }}
              title={`${MOOD_LABELS[entry.score]} — ${new Date(entry.createdAt).toLocaleDateString()}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-white/20">{new Date(recent[0].createdAt).toLocaleDateString()}</span>
        <span className="text-[10px] text-white/20">{new Date(recent[recent.length - 1].createdAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}

/* ── Average Score Badge ────────────────────────────────────── */
function AverageScoreBadge({ entries }: { entries: MoodEntry[] }) {
  if (entries.length === 0) return null;
  const avg = entries.reduce((s, e) => s + e.score, 0) / entries.length;
  const rounded = Math.round(avg * 10) / 10;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
      <TrendingUp className="w-3.5 h-3.5 text-accent" />
      <span className="text-xs text-white/50">Avg: <span className="text-white/80 font-semibold">{rounded}</span></span>
    </div>
  );
}

export default function MoodPage() {
  useDocumentTitle('Mood Tracker');
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadEntries = useCallback(async () => {
    setIsLoadingEntries(true);
    try {
      const res = await apiService.get<{ entries: MoodEntry[] }>('/health-tools/mood');
      if (res.success && res.data) setEntries(res.data.entries);
    } catch {
      toast.error('Failed to load mood entries');
    } finally {
      setIsLoadingEntries(false);
    }
  }, []);

  useEffect(() => { void loadEntries(); }, [loadEntries]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Optimistic: show it instantly
    const optimistic: MoodEntry = {
      id: `temp-${Date.now()}`,
      score,
      note: note || null,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [optimistic, ...prev]);
    toast.success('Mood logged!');
    const savedScore = score;
    const savedNote = note;
    const savedTags = [...selectedTags];
    setNote('');
    setSelectedTags([]);
    setScore(5);
    setShowForm(false);
    setIsSubmitting(false);

    // Persist in background
    try {
      const res = await apiService.post('/health-tools/mood', {
        mood: savedScore,
        notes: savedNote || undefined,
        activities: savedTags,
      });
      if (res.success) {
        void loadEntries();
      }
    } catch {
      // entry already shown optimistically
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Mood Tracker</h1>
          <p className="text-sm text-white/50 mt-1">Track your emotional state daily</p>
        </div>
        <div className="flex items-center gap-3">
          <AverageScoreBadge entries={entries} />
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log Mood
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-8 p-6 rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/80"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white/90 font-semibold">How are you feeling?</h3>
              <button onClick={() => setShowForm(false)} aria-label="Close form" className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-widest">Mood Level</span>
                <span className="text-lg font-semibold text-white">{score} — {MOOD_LABELS[score]}</span>
              </div>
              <input
                type="range" min={1} max={10} value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-[#2b2b2b] appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/50">1</span>
                <span className="text-[10px] text-white/50">10</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-5">
              <span className="text-xs text-white/50 uppercase tracking-widest block mb-3">Emotions</span>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag) ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              rows={3}
              className="w-full bg-[#111] border border-[#2b2b2b] rounded-2xl p-4 text-white/80 placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 resize-none mb-5"
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smile className="w-4 h-4" />}
              Save Mood
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trend Chart */}
      {!isLoadingEntries && entries.length >= 2 && <MoodTrendChart entries={entries} />}

      {/* Entries List */}
      <div aria-live="polite">
      {isLoadingEntries ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <Smile className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No mood logs yet. Start tracking to see patterns.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b]/60 flex items-start gap-4"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                style={{ backgroundColor: `${MOOD_COLORS[entry.score] ?? '#666'}20` }}
              >
                {entry.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-white/80">{MOOD_LABELS[entry.score] ?? entry.score}</span>
                  <span className="text-xs text-white/50 shrink-0">{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                {entry.note && <p className="text-sm text-white/50 mb-2">{entry.note}</p>}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] text-white/50">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
