import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Loader2 } from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: number | null;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
}

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    const res = await apiService.get<{ entries: JournalEntry[] }>('/health-tools/journal');
    if (res.success && res.data) setEntries(res.data.entries);
    setIsLoading(false);
  }, []);

  useEffect(() => { void loadEntries(); }, [loadEntries]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const res = await apiService.post('/health-tools/journal', {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      mood,
      isPrivate: true,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Journal entry saved!');
      setTitle('');
      setContent('');
      setMood(5);
      setShowForm(false);
      void loadEntries();
    } else {
      toast.error('Failed to save entry');
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Journal</h1>
          <p className="text-sm text-white/40 mt-1">Private thoughts, raw and unfiltered</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Entry
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
              <h3 className="text-white/90 font-semibold">New Journal Entry</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full bg-[#111] border border-[#2b2b2b] rounded-2xl px-4 py-3 text-white/80 placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 mb-3"
            />

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind? Write freely..."
              rows={8}
              className="w-full bg-[#111] border border-[#2b2b2b] rounded-2xl p-4 text-white/80 placeholder:text-white/30 text-sm focus:outline-none focus:border-white/20 resize-none mb-4"
            />

            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs text-white/40 uppercase tracking-widest shrink-0">Mood: {mood}</span>
              <input
                type="range" min={1} max={10} value={mood}
                onChange={e => setMood(Number(e.target.value))}
                className="flex-1 h-2 rounded-full bg-[#2b2b2b] appearance-none cursor-pointer accent-accent"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="w-full py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              Save Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No journal entries yet. Write your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b]/60 cursor-pointer hover:border-white/15 transition-colors"
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-white/80 font-medium text-sm truncate">{entry.title ?? 'Untitled'}</h4>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.mood && <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{entry.mood}/10</span>}
                  <span className="text-xs text-white/30">{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className={`text-sm text-white/50 leading-relaxed ${expandedId === entry.id ? '' : 'line-clamp-2'}`}>
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
