import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Heart, MessageCircle, X } from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SessionRatingProps {
  sessionId: string;
  guideName: string;
  /** Inline = embedded in page; modal = overlay triggered externally */
  mode?: 'inline' | 'modal';
  /** Called after successful submission */
  onRated?: (rating: number, feedback?: string) => void;
  /** Called when user closes the modal (mode="modal" only) */
  onClose?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`bg-white/[0.06] animate-pulse rounded-md ${className ?? ''}`} />;
}

const starLabels = ['', 'Not helpful', 'Below expectations', 'Okay', 'Great', 'Wonderful'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SessionRating({
  sessionId,
  guideName,
  mode = 'inline',
  onRated,
  onClose,
}: SessionRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const activeStar = hoveredStar || rating;

  // ── Submit handler ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    setError(false);

    try {
      await therapyApi.rateSession(sessionId, {
        rating,
        feedback: feedback.trim() || undefined,
      });
      setSubmitted(true);
      onRated?.(rating, feedback.trim() || undefined);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Thank-you view ──────────────────────────────────────────────────
  const thankYouContent = (
    <motion.div
      key="thanks"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-amber-500/[0.1] border border-amber-500/[0.08] flex items-center justify-center">
        <Heart className="w-5 h-5 text-amber-400/80" />
      </div>
      <p className="text-[14px] font-medium text-white/70">Thank you for your feedback</p>
      {rating >= 4 ? (
        <p className="text-[13px] text-white/45 max-w-[260px]">
          Glad it went well! Book your next call with {guideName}
        </p>
      ) : (
        <p className="text-[13px] text-white/45 max-w-[260px]">
          We hear you. We&rsquo;ll use this to improve your matches.
        </p>
      )}
    </motion.div>
  );

  // ── Form view ───────────────────────────────────────────────────────
  const formContent = (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col gap-5"
    >
      {/* Prompt */}
      <p className="text-[14px] font-medium text-white/65 text-center">
        How was your call with {guideName}?
      </p>

      {/* Star rating */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-8 h-8 transition-colors duration-200 ${
                  star <= activeStar
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-white/15'
                }`}
              />
            </button>
          ))}
        </div>
        {/* Star label */}
        <AnimatePresence mode="wait">
          {activeStar > 0 && (
            <motion.span
              key={activeStar}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="text-[12px] text-white/40 h-4"
            >
              {starLabels[activeStar]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback textarea */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[12px] text-white/35">
            Share more (optional)
          </span>
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, 2000))}
          placeholder="What could be improved? What went well?"
          rows={3}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3
                     text-[13px] text-white/70 placeholder:text-white/20 resize-none
                     focus:outline-none focus:border-amber-500/[0.15] focus:bg-white/[0.04]
                     transition-all"
        />
        <span className="text-[11px] text-white/20 text-right">
          {feedback.length}/2000
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-[12px] text-red-400/70 text-center">
          Something went wrong. Please try again.
        </p>
      )}

      {/* Submit button */}
      <button
        type="button"
        disabled={rating === 0 || submitting}
        onClick={handleSubmit}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13px]
                    font-semibold transition-all duration-300
                    ${
                      rating === 0 || submitting
                        ? 'bg-white/[0.04] text-white/25 border border-white/[0.04] cursor-not-allowed'
                        : 'bg-amber-500/[0.1] text-amber-400/80 border border-amber-500/[0.08] hover:bg-amber-500/[0.16] active:scale-[0.97]'
                    }`}
      >
        {submitting ? (
          <>
            <SkeletonPulse className="w-4 h-4 rounded-full" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Submit Rating
          </>
        )}
      </button>
    </motion.div>
  );

  // ── Render ──────────────────────────────────────────────────────────
  const inner = (
    <AnimatePresence mode="wait">
      {submitted ? thankYouContent : formContent}
    </AnimatePresence>
  );

  // Inline: simple container matching glass card style
  if (mode === 'inline') {
    return (
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-[20px] p-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/[0.03] rounded-full blur-[60px] pointer-events-none" />
        {inner}
      </div>
    );
  }

  // Modal: full overlay
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-[380px] bg-[#0e0e10]/95 border border-white/[0.06]
                     rounded-[24px] p-6 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08]
                       text-white/30 hover:text-white/55 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/[0.04] rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/[0.02] rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10">{inner}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
