import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Loader2, Search, Feather, ChevronLeft, ChevronRight,
  Lock, Calendar, PenTool,
} from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/* ── Types ────────────────────────────────────────────────────────── */

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: number | null;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
}

/* ── Constants ────────────────────────────────────────────────────── */

const MOODS = ['😔', '😕', '😐', '🙂', '😊', '😄', '🥰', '✨', '🔥', '💫'];
const ENTRIES_PER_PAGE = 3;
const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };

/** Repeating horizontal ruled-notebook lines */
const ruledLines: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(transparent, transparent 31px, rgba(180,155,120,0.16) 31px, rgba(180,155,120,0.16) 32px)',
  backgroundPositionY: '10px',
};

/** Warm parchment gradient shared by both pages */
const parchment =
  'bg-gradient-to-br from-[#FAF6F0] via-[#F5EFE6] to-[#F0E8DA]';

/* ══════════════════════════════════════════════════════════════════ */
/*  JournalPage                                                      */
/* ══════════════════════════════════════════════════════════════════ */

export default function JournalPage() {
  useDocumentTitle('Journal');
  /* ── State ──────────────────────────────────────────────────── */
  const [activeView, setActiveView] = useState<'write' | 'read'>('read');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  /* ── Derived ────────────────────────────────────────────────── */
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [entries, searchQuery]);

  const totalWords = useMemo(
    () => entries.reduce((sum, e) => sum + e.content.split(/\s+/).filter(Boolean).length, 0),
    [entries],
  );

  const paginatedEntries = useMemo(() => {
    const start = currentPage * ENTRIES_PER_PAGE;
    return filteredEntries.slice(start, start + ENTRIES_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ENTRIES_PER_PAGE));

  /* ── API ────────────────────────────────────────────────────── */
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await apiService.get<{ entries: JournalEntry[] }>('/health-tools/journal');
      if (res.success && res.data) setEntries(res.data.entries);
    } catch {
      setLoadError('Failed to load journal entries');
      toast.error('Failed to load journal entries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadEntries(); }, [loadEntries]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);

    // Optimistic: add entry to UI immediately so it feels instant
    const optimisticEntry: JournalEntry = {
      id: `temp-${Date.now()}`,
      title: title.trim() || 'Untitled',
      content: content.trim(),
      mood,
      tags: [],
      isPrivate: true,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [optimisticEntry, ...prev]);
    toast.success('Sealed in your journal ✨');
    const savedTitle = title;
    const savedContent = content;
    const savedMood = mood;
    setTitle('');
    setContent('');
    setMood(7);
    setActiveView('read');
    setCurrentPage(0);
    setIsSubmitting(false);

    // Fire-and-forget: persist to backend in background
    try {
      const res = await apiService.post('/health-tools/journal', {
        title: savedTitle.trim() || 'Untitled',
        content: savedContent.trim(),
        mood: savedMood,
        isPrivate: true,
      });
      if (res.success) {
        void loadEntries(); // sync with real IDs
      } else {
        toast.error('Entry may not have saved to server');
      }
    } catch {
      toast.error('Entry may not have saved to server');
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  /* ── Shared page pieces ─────────────────────────────────────── */

  const writePage = (
    <div
      className={cn('relative min-h-[560px] sm:min-h-[640px]', parchment)}
      style={ruledLines}
    >
      {/* Red margin line */}
      <div className="absolute left-12 sm:left-16 top-0 bottom-0 w-[1px] bg-red-400/25" />

      {/* Three-hole punch decoration */}
      <div className="absolute left-3 sm:left-5 top-[22%] w-3 h-3 rounded-full border-2 border-stone-300/40" />
      <div className="absolute left-3 sm:left-5 top-[50%] w-3 h-3 rounded-full border-2 border-stone-300/40" />
      <div className="absolute left-3 sm:left-5 top-[78%] w-3 h-3 rounded-full border-2 border-stone-300/40" />

      {/* Content area */}
      <div className="relative z-10 pl-16 sm:pl-20 pr-5 sm:pr-8 pt-6 pb-6 flex flex-col h-full">
        {/* Date line */}
        <div className="flex items-center justify-between mb-0 leading-[32px]">
          <p className="text-stone-400/80 text-[13px] italic" style={playfair}>
            {dateStr}
          </p>
          <div className="flex items-center gap-1.5 text-stone-400/50">
            <Lock className="w-3 h-3" />
            <span className="text-[9px] uppercase tracking-[0.18em]">Private</span>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title this page..."
          className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-bold text-stone-800 placeholder:text-stone-300/70 leading-[32px] py-0"
          style={playfair}
        />

        {/* Horizontal rule under title */}
        <div className="w-16 h-[1px] bg-amber-400/30 my-3" />

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dear diary..."
          className="flex-1 w-full bg-transparent border-none outline-none text-stone-700/90 placeholder:text-stone-300/60 text-[15px] leading-[32px] resize-none min-h-[260px]"
        />

        {/* Footer: Mood + Word count + Save */}
        <div className="mt-4 pt-4 border-t border-stone-300/25">
          {/* Mood row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-stone-400 uppercase tracking-[0.18em] shrink-0" style={playfair}>
              Mood
            </span>
            <div className="flex items-center gap-0.5 flex-wrap">
              {MOODS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i + 1)}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-200',
                    mood === i + 1
                      ? 'bg-amber-200/80 scale-[1.25] shadow-md shadow-amber-300/30 ring-2 ring-amber-400/30'
                      : 'hover:bg-stone-200/50 opacity-40 hover:opacity-80',
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Save row */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-stone-400/60 italic tabular-nums">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-lg',
                content.trim()
                  ? 'bg-stone-800 text-amber-50 hover:bg-stone-700 shadow-stone-900/30 active:scale-95'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none',
              )}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Feather className="w-4 h-4" />}
              {isSubmitting ? 'Sealing...' : 'Seal Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const readPage = (
    <div className={cn('relative min-h-[560px] sm:min-h-[640px]', parchment)}>
      <div className="relative z-10 px-5 sm:px-8 pt-6 pb-6 flex flex-col h-full">

        {/* Search */}
        {entries.length > 0 && (
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
              placeholder="Search your diary..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-stone-200/80 text-stone-700 text-sm placeholder:text-stone-400/70 focus:outline-none focus:border-amber-400/40 focus:bg-white/70 transition-all"
              style={playfair}
            />
          </div>
        )}

        {/* Entries */}
        <div aria-live="polite">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
          </div>
        ) : loadError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
            <p className="text-stone-500 italic text-lg mb-3" style={playfair}>
              {loadError}
            </p>
            <button
              onClick={() => void loadEntries()}
              className="text-sm text-amber-700 hover:text-amber-600 underline underline-offset-4 decoration-amber-400/30 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <Feather className="w-10 h-10 text-stone-300 mb-4" />
            <p className="text-stone-400 italic text-lg mb-1" style={playfair}>
              Your journal awaits its first page...
            </p>
            <button
              onClick={() => setActiveView('write')}
              className="mt-3 text-sm text-amber-700 hover:text-amber-600 underline underline-offset-4 decoration-amber-400/30 transition-colors lg:hidden"
            >
              Begin writing →
            </button>
          </div>
        ) : (
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {paginatedEntries.map((entry, i) => (
                  <DiaryEntryCard
                    key={entry.id}
                    entry={entry}
                    index={i}
                    isExpanded={expandedId === entry.id}
                    onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  />
                ))}
                {paginatedEntries.length === 0 && searchQuery && (
                  <p className="text-center text-stone-400/70 italic py-16" style={playfair}>
                    No entries match &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-stone-200/50">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              aria-label="Previous page"
              className="p-1.5 rounded-full hover:bg-stone-200/50 disabled:opacity-25 transition-colors text-stone-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentPage ? 'w-5 h-2 bg-amber-600/80' : 'w-2 h-2 bg-stone-300 hover:bg-stone-400',
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next page"
              className="p-1.5 rounded-full hover:bg-stone-200/50 disabled:opacity-25 transition-colors text-stone-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-[11px] text-stone-400 italic ml-1" style={playfair}>
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Render ─────────────────────────────────────────────────── */

  return (
    <div className="w-full pb-20">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          {/* Diary icon */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-900/30 to-amber-800/10 border border-amber-700/20 flex items-center justify-center shadow-lg shadow-amber-900/10">
            <BookOpen className="w-5 h-5 text-amber-400/80" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500/50 blur-[6px]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white/90 tracking-tight" style={playfair}>
              My Journal
            </h1>
            <p className="text-sm text-amber-200/25 mt-0.5 italic" style={playfair}>
              {entries.length > 0
                ? `${entries.length} pages · ${totalWords.toLocaleString()} words written`
                : 'Where your story unfolds...'}
            </p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setActiveView('read')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeView === 'read'
                ? 'bg-amber-900/30 text-amber-300 border border-amber-700/25 shadow-inner shadow-amber-900/10'
                : 'text-white/35 hover:text-white/55',
            )}
          >
            <BookOpen className="w-4 h-4" />
            Read
          </button>
          <button
            onClick={() => setActiveView('write')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeView === 'write'
                ? 'bg-amber-900/30 text-amber-300 border border-amber-700/25 shadow-inner shadow-amber-900/10'
                : 'text-white/35 hover:text-white/55',
            )}
          >
            <Feather className="w-4 h-4" />
            Write
          </button>
        </div>
      </motion.div>

      {/* ═══ The Open Diary Book ══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Ambient warm glow beneath the book */}
        <div className="absolute -inset-6 bg-gradient-to-b from-amber-700/[0.04] via-amber-800/[0.03] to-transparent blur-3xl rounded-3xl pointer-events-none" />

        {/* Book container */}
        <div
          className="relative rounded-[14px] overflow-hidden"
          style={{
            boxShadow:
              '0 25px 60px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(180,140,80,0.08), 0 0 80px -20px rgba(100,70,30,0.08)',
          }}
        >
          {/* Bookmark ribbon */}
          <div
            className="absolute top-0 right-8 sm:right-12 w-5 h-14 z-30 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, #8B2252 0%, #6B1A3E 100%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
              filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.35))',
            }}
          />

          {/* ─── Desktop: Two-page spread ─────────────────────── */}
          <div className="hidden lg:grid lg:grid-cols-2 relative">
            {/* Left page — Write */}
            {writePage}

            {/* Book spine */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[5px] z-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-800/50 via-amber-700/60 to-amber-800/50" />
              {/* Spine stitching dots */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-40">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="w-[2px] h-[2px] rounded-full bg-amber-300/70" />
                ))}
              </div>
              {/* Spine shadow */}
              <div className="absolute -left-3 top-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-black/[0.06]" />
              <div className="absolute -right-3 top-0 bottom-0 w-3 bg-gradient-to-l from-transparent to-black/[0.06]" />
            </div>

            {/* Right page — Read */}
            {readPage}
          </div>

          {/* ─── Mobile: Single page with tabs ────────────────── */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {activeView === 'write' ? (
                <motion.div
                  key="write-mobile"
                  initial={{ opacity: 0, rotateY: -4 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 4 }}
                  transition={{ duration: 0.35 }}
                >
                  {writePage}
                </motion.div>
              ) : (
                <motion.div
                  key="read-mobile"
                  initial={{ opacity: 0, rotateY: 4 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -4 }}
                  transition={{ duration: 0.35 }}
                >
                  {readPage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stacked-pages edge at the bottom */}
          <div className="relative z-10">
            <div className="h-[3px] bg-gradient-to-r from-transparent via-[#E8DFD3]/50 to-transparent" />
            <div className="h-[2px] mx-2 bg-gradient-to-r from-transparent via-[#E0D5C6]/30 to-transparent" />
            <div className="h-[1px] mx-4 bg-gradient-to-r from-transparent via-[#D8CCBD]/20 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* ═══ Stats Footer ════════════════════════════════════════ */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Total Pages', value: entries.length, icon: BookOpen },
            { label: 'Words Written', value: totalWords.toLocaleString(), icon: PenTool },
            {
              label: 'This Week',
              value: entries.filter((e) => {
                const weekAgo = new Date(Date.now() - 7 * 86_400_000);
                return new Date(e.createdAt) >= weekAgo;
              }).length,
              icon: Calendar,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="p-4 rounded-2xl bg-[#0c0c0c] border border-amber-900/10 flex items-center gap-3 hover:border-amber-800/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-900/15 border border-amber-800/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-amber-500/50" />
              </div>
              <div>
                <p className="text-lg font-bold text-white/80 tabular-nums">{value}</p>
                <p className="text-[10px] text-amber-200/20 uppercase tracking-[0.14em]">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  DiaryEntryCard                                                   */
/* ══════════════════════════════════════════════════════════════════ */

function DiaryEntryCard({
  entry,
  index,
  isExpanded,
  onToggle,
}: {
  entry: JournalEntry;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const d = new Date(entry.createdAt);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={onToggle}
      className="relative group cursor-pointer"
    >
      <div
        className={cn(
          'relative rounded-xl overflow-hidden transition-all duration-300',
          isExpanded
            ? 'bg-white shadow-xl shadow-stone-400/20 ring-1 ring-amber-300/20'
            : 'bg-white/70 shadow-md shadow-stone-300/15 hover:shadow-lg hover:bg-white/90',
        )}
      >
        {/* Faint ruled lines on card */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={ruledLines}
        />

        {/* Faint red margin */}
        <div className="absolute left-[52px] top-0 bottom-0 w-[1px] bg-red-400/10 pointer-events-none" />

        <div className="relative z-10 flex gap-3.5 p-4 sm:p-5">
          {/* Wax-seal date badge */}
          <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-amber-700/90 to-amber-900/95 flex flex-col items-center justify-center shadow-md shadow-amber-900/25 ring-[1.5px] ring-amber-600/20">
            <span className="text-amber-100 text-[13px] font-bold leading-none">{day}</span>
            <span className="text-amber-200/50 text-[8px] uppercase tracking-wider leading-none mt-[1px]">{month}</span>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-stone-800 font-semibold text-[15px] truncate" style={playfair}>
                {entry.title ?? 'Untitled'}
              </h3>
              {entry.mood != null && (
                <span className="text-sm shrink-0 leading-none mt-0.5">
                  {MOODS[Math.min(Math.max(entry.mood - 1, 0), 9)]}
                </span>
              )}
            </div>

            <p
              className={cn(
                'text-stone-600/90 text-[13px] leading-relaxed',
                !isExpanded && 'line-clamp-2',
              )}
            >
              {entry.content}
            </p>

            {/* Tags (expanded) */}
            {isExpanded && entry.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-1.5 mt-3"
              >
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100/80 text-amber-800 border border-amber-200/50 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] text-stone-400/80 italic tabular-nums">
                {entry.content.split(/\s+/).filter(Boolean).length} words
              </span>
              {entry.isPrivate && (
                <span className="flex items-center gap-1 text-[10px] text-stone-400/60">
                  <Lock className="w-2.5 h-2.5" />
                  Private
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Page-corner fold */}
        <div
          className="absolute top-0 right-0 w-5 h-5 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none"
          style={{ background: 'linear-gradient(135deg, transparent 50%, #DDD5C8 50%)' }}
        />
      </div>
    </motion.div>
  );
}
