import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Phone,
  Clock,
  CalendarPlus,
  AlertCircle,
  RefreshCw,
  Star,
  X,
  Sparkles,
} from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { SessionDetail } from '@/types/therapy.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TalkNowFlowProps {
  /** Optional pre-selected therapist */
  therapistId?: string;
  /** Called when user wants to close / go back */
  onClose: () => void;
  /** Called when user clicks "Schedule a call instead" */
  onSchedule?: () => void;
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

type FlowState = 'searching' | 'found' | 'countdown' | 'ready' | 'timeout' | 'error';

const POLL_INTERVAL = 5_000; // 5 seconds
const TIMEOUT_MS = 60_000; // 60 seconds before timeout
const COUNTDOWN_SECONDS = 300; // 5 minutes

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TalkNowFlow({
  therapistId,
  onClose,
  onSchedule,
}: TalkNowFlowProps) {
  const [state, setState] = useState<FlowState>('searching');
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [dots, setDots] = useState('');

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cleanup helper ──────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    pollRef.current = null;
    timeoutRef.current = null;
    countdownRef.current = null;
  }, []);

  // ── Animated dots for searching state ───────────────────────────────
  useEffect(() => {
    if (state !== 'searching') return;
    const id = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(id);
  }, [state]);

  // ── Start countdown timer when session found ────────────────────────
  const startCountdown = useCallback(() => {
    setState('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          setState('ready');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── Poll session status ─────────────────────────────────────────────
  // TODO: Replace polling with WebSocket when available
  const pollSession = useCallback(
    (sessionId: string) => {
      pollRef.current = setInterval(async () => {
        try {
          const res = await therapyApi.getSession(sessionId);
          if (res.data) {
            const s = res.data as SessionDetail;
            setSession(s);
            if (s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED') {
              // Therapist accepted or session confirmed — move to found → countdown
              if (pollRef.current) clearInterval(pollRef.current);
              pollRef.current = null;
              setState('found');
              // Brief pause on "found" then start countdown
              setTimeout(() => startCountdown(), 2000);
            }
          }
        } catch {
          // Silently continue polling
        }
      }, POLL_INTERVAL);
    },
    [startCountdown],
  );

  // ── Book instant session on mount ───────────────────────────────────
  const bookInstant = useCallback(async () => {
    setState('searching');
    clearTimers();

    try {
      const res = await therapyApi.bookInstantSession(
        therapistId ? { therapistId } : undefined,
      );

      if (res.data) {
        const s = res.data as SessionDetail;
        setSession(s);

        // If already matched / accepted immediately
        if (s.status === 'IN_PROGRESS') {
          setState('found');
          setTimeout(() => startCountdown(), 2000);
          return;
        }

        // Otherwise start polling + timeout
        pollSession(s.id);
        timeoutRef.current = setTimeout(() => {
          clearTimers();
          setState('timeout');
        }, TIMEOUT_MS);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }, [therapistId, clearTimers, pollSession, startCountdown]);

  useEffect(() => {
    bookInstant();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Formatting helpers ──────────────────────────────────────────────
  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── Render stages ───────────────────────────────────────────────────

  const searchingView = (
    <motion.div
      key="searching"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      {/* Pulsing search ring */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-amber-500/[0.06] border border-amber-500/[0.08] flex items-center justify-center">
          <Search className="w-8 h-8 text-amber-400/70" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full border border-amber-500/[0.15] animate-ping" />
      </div>
      <div>
        <p className="text-[15px] font-medium text-white/70">
          Finding you the perfect guide{dots}
        </p>
        <p className="text-[12px] text-white/35 mt-1.5">
          Matching with available soul guides nearby
        </p>
      </div>
    </motion.div>
  );

  const foundView = session && (
    <motion.div
      key="found"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-500/[0.08] border border-emerald-500/[0.1] flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-emerald-400/80" />
      </div>

      {/* Therapist mini-card */}
      <div className="flex flex-col items-center gap-2">
        {session.therapist.photoUrl ? (
          <img
            src={session.therapist.photoUrl}
            alt={session.therapist.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/[0.15]"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.08] flex items-center justify-center text-amber-400/70 text-lg font-semibold">
            {session.therapist.name.charAt(0)}
          </div>
        )}
        <p className="text-[14px] font-medium text-white/75">{session.therapist.name}</p>
        {session.therapist.specializations.length > 0 && (
          <p className="text-[11px] text-white/35">
            {session.therapist.specializations.slice(0, 3).join(' · ')}
          </p>
        )}
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[11px] text-white/45">{session.therapist.rating.toFixed(1)}</span>
        </div>
        {session.matchScore != null && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/[0.06] text-emerald-400/70">
            {session.matchScore}% match
          </span>
        )}
      </div>

      <p className="text-[13px] text-emerald-400/70 font-medium">
        Connecting in 5 min…
      </p>
    </motion.div>
  );

  const countdownView = session && (
    <motion.div
      key="countdown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      {/* Therapist avatar */}
      {session.therapist.photoUrl ? (
        <img
          src={session.therapist.photoUrl}
          alt={session.therapist.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/[0.15]"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.08] flex items-center justify-center text-amber-400/70 text-lg font-semibold">
          {session.therapist.name.charAt(0)}
        </div>
      )}

      <p className="text-[13px] text-white/50">
        Your guide is preparing for your call
      </p>

      {/* Countdown ring */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="rgba(245,158,11,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={2 * Math.PI * 42 * (1 - countdown / COUNTDOWN_SECONDS)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="flex flex-col items-center">
          <Clock className="w-4 h-4 text-amber-400/60 mb-1" />
          <span className="text-[20px] font-semibold text-white/70 tabular-nums">
            {formatCountdown(countdown)}
          </span>
        </div>
      </div>

      <p className="text-[12px] text-white/30">
        {session.therapist.name} · {session.therapist.specializations[0] ?? 'Wellness Guide'}
      </p>
    </motion.div>
  );

  const readyView = session && (
    <motion.div
      key="ready"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      {session.therapist.photoUrl ? (
        <img
          src={session.therapist.photoUrl}
          alt={session.therapist.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/[0.15]"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-emerald-500/[0.08] border border-emerald-500/[0.08] flex items-center justify-center text-emerald-400/70 text-lg font-semibold">
          {session.therapist.name.charAt(0)}
        </div>
      )}

      <p className="text-[14px] font-medium text-white/70">{session.therapist.name} is ready</p>

      {/* Start Call — disabled until BUILD 4 (Daily.co) */}
      <div className="relative group">
        <button
          type="button"
          disabled
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] text-white/25
                     border border-white/[0.04] cursor-not-allowed text-[13px] font-semibold"
        >
          <Phone className="w-4 h-4" />
          Start Call
        </button>
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/80 border border-white/[0.08]
                        text-[11px] text-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Coming Soon
        </div>
      </div>
    </motion.div>
  );

  const timeoutView = (
    <motion.div
      key="timeout"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center gap-5 py-8 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.04] flex items-center justify-center">
        <Clock className="w-6 h-6 text-white/30" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-white/60">
          No guides available right now
        </p>
        <p className="text-[12px] text-white/35 mt-1.5">
          All our soul guides are currently in sessions
        </p>
      </div>
      <button
        type="button"
        onClick={() => { onSchedule?.(); onClose(); }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/[0.1] text-amber-400/80
                   border border-amber-500/[0.08] hover:bg-amber-500/[0.16] text-[13px] font-semibold
                   transition-all active:scale-[0.97]"
      >
        <CalendarPlus className="w-4 h-4" />
        Schedule a call instead
      </button>
    </motion.div>
  );

  const errorView = (
    <motion.div
      key="error"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center gap-5 py-8 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-red-500/[0.06] border border-red-500/[0.06] flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-400/60" />
      </div>
      <p className="text-[14px] font-medium text-white/60">
        Something went wrong
      </p>
      <button
        type="button"
        onClick={bookInstant}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/[0.1] text-amber-400/80
                   border border-amber-500/[0.08] hover:bg-amber-500/[0.16] text-[13px] font-semibold
                   transition-all active:scale-[0.97]"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try again
      </button>
    </motion.div>
  );

  const stateViews: Record<FlowState, React.ReactNode> = {
    searching: searchingView,
    found: foundView,
    countdown: countdownView,
    ready: readyView,
    timeout: timeoutView,
    error: errorView,
  };

  // ── Main render ─────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && state !== 'searching') onClose();
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
          {/* Close button (hidden during searching) */}
          {state !== 'searching' && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08]
                         text-white/30 hover:text-white/55 transition-all z-20"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/[0.04] rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/[0.02] rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {stateViews[state]}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
