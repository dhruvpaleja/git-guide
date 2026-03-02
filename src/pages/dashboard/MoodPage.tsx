import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Plus, X, Loader2 } from 'lucide-react';
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

const COMMON_TAGS = ['anxious', 'calm', 'happy', 'sad', 'stressed', 'energetic', 'tired', 'hopeful', 'irritable', 'peaceful'];

export default function MoodPage() {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadEntries = useCallback(async () => {
    setIsLoadingEntries(true);
    const res = await apiService.get<{ entries: MoodEntry[] }>('/health-tools/mood');
    if (res.success && res.data) setEntries(res.data.entries);
    setIsLoadingEntries(false);
  }, []);

  useEffect(() => { void loadEntries(); }, [loadEntries]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const res = await apiService.post('/health-tools/mood', {
      mood: score,
      notes: note || undefined,
      activities: selectedTags,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Mood logged!');
      setNote('');
      setSelectedTags([]);
      setScore(5);
      setShowForm(false);
      void loadEntries();
    } else {
      toast.error('Failed to log mood');
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Mood Tracker</h1>
          <p className="text-sm text-white/40 mt-1">Track your emotional state daily</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Mood
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white/90 font-semibold">How are you feeling?</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 uppercase tracking-widest">Mood Level</span>
                <span className="text-lg font-semibold text-white">{score} — {MOOD_LABELS[score]}</span>
              </div>
              <input
                type="range" min={1} max={10} value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-[#2b2b2b] appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/30">1</span>
                <span className="text-[10px] text-white/30">10</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-5">
              <span className="text-xs text-white/40 uppercase tracking-widest block mb-3">Emotions</span>
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

      {/* Entries List */}
      {isLoadingEntries ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <Smile className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No mood logs yet. Start tracking to see patterns.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b]/60 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">
                {entry.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-white/80">{MOOD_LABELS[entry.score] ?? entry.score}</span>
                  <span className="text-xs text-white/30 shrink-0">{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                {entry.note && <p className="text-sm text-white/50 mb-2">{entry.note}</p>}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 text-white/40 border border-white/10">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
