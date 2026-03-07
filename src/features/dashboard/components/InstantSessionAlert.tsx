import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User, Clock, Sparkles } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { therapyApi } from '@/services/therapy.api';
import type { NotificationWebSocketPayload } from '@contracts/websocket.contracts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InstantRequest {
  notificationId: string;
  sessionId: string;
  clientName: string;
  clientStruggles: string[];
  matchScore: number;
  expiresAt: string;
}

interface NotificationsResponse {
  notifications: NotificationWebSocketPayload[];
  unreadCount?: number;
  unread?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POLL_INTERVAL = 5_000; // 5 seconds
// TODO: Replace polling with WebSocket when available

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * InstantSessionAlert — therapist-side overlay that appears when a client
 * requests a "Talk Now" instant session. Polls the notifications endpoint
 * and surfaces any unexpired INSTANT_SESSION_REQUEST.
 *
 * Mount location: Always mounted in practitioner dashboard layout.
 */
export default function InstantSessionAlert() {
  const navigate = useNavigate();
  const [request, setRequest] = useState<InstantRequest | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Cleanup ─────────────────────────────────────────────────────────
  const clearCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // ── Parse notification data ─────────────────────────────────────────
  const parseInstantRequest = (
    notif: NotificationWebSocketPayload,
  ): InstantRequest | null => {
    const raw = notif.data;
    if (!raw || typeof raw !== 'object') return null;
    const d = raw as Record<string, unknown>;
    if (d.actionType !== 'INSTANT_SESSION_REQUEST') return null;

    const expiresAt = d.expiresAt as string | undefined;
    if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) return null;

    return {
      notificationId: notif.id,
      sessionId: d.sessionId as string,
      clientName: (d.clientName as string) ?? 'A client',
      clientStruggles: (d.clientStruggles as string[]) ?? [],
      matchScore: (d.matchScore as number) ?? 0,
      expiresAt,
    };
  };

  // ── Start countdown when request appears ────────────────────────────
  const startCountdown = useCallback(
    (expiresAt: string) => {
      clearCountdown();
      const updateCountdown = () => {
        const remaining = Math.max(
          0,
          Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000),
        );
        setCountdown(remaining);
        if (remaining <= 0) {
          clearCountdown();
          // Auto-decline on timeout
          setRequest(null);
          stopAudio();
        }
      };
      updateCountdown();
      countdownRef.current = setInterval(updateCountdown, 1000);
    },
    [clearCountdown, stopAudio],
  );

  // ── Play alert chime ────────────────────────────────────────────────
  const playChime = useCallback(() => {
    try {
      // Use Web Audio API for a simple tone since no audio file is bundled
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // Audio playback may be blocked by browser autoplay policies — silently continue
    }
  }, []);

  // ── Poll for notifications ──────────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      if (request) return; // Already showing an alert

      try {
        const res = await apiService.get<NotificationsResponse>('/notifications');
        if (res.data?.notifications) {
          for (const notif of res.data.notifications) {
            const parsed = parseInstantRequest(notif);
            if (parsed) {
              setRequest(parsed);
              startCountdown(parsed.expiresAt);
              playChime();
              break;
            }
          }
        }
      } catch {
        // Silently continue polling
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCountdown();
      stopAudio();
    };
  }, [clearCountdown, stopAudio]);

  // ── Accept handler ──────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!request || accepting) return;
    setAccepting(true);

    try {
      await therapyApi.startSession(request.sessionId);
      stopAudio();
      clearCountdown();
      setRequest(null);
      navigate(`/dashboard/sessions/${request.sessionId}`);
    } catch {
      setAccepting(false);
    }
  };

  // ── Decline handler ─────────────────────────────────────────────────
  const handleDecline = async () => {
    if (!request || declining) return;
    setDeclining(true);
    stopAudio();
    clearCountdown();
    setRequest(null);
    setDeclining(false);
  };

  // ── Render ──────────────────────────────────────────────────────────
  if (!request) return null;

  const urgencyColor =
    countdown <= 10
      ? 'text-red-400'
      : countdown <= 30
        ? 'text-amber-400'
        : 'text-white/70';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-[400px] bg-[#0e0e10]/95 border border-white/[0.08]
                     rounded-[24px] p-7 shadow-2xl overflow-hidden"
        >
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/[0.06] rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/[0.04] rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Header pulse */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-500/[0.1] border border-emerald-500/[0.12]
                              flex items-center justify-center">
                <Phone className="w-7 h-7 text-emerald-400/80" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-emerald-500/[0.25] animate-ping" />
            </div>

            <p className="text-[15px] font-semibold text-white/75">
              Instant Session Request
            </p>

            {/* Client info card */}
            <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-[16px] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.06]
                                flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-400/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-white/70 truncate">
                    {request.clientName}
                  </p>
                  {request.matchScore > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400/60" />
                      <span className="text-[11px] text-amber-400/60">
                        {request.matchScore}% match
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Struggles tags */}
              {request.clientStruggles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {request.clientStruggles.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.04]
                                 text-[11px] text-white/40"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${urgencyColor} transition-colors`} />
              <span className={`text-[22px] font-semibold tabular-nums ${urgencyColor} transition-colors`}>
                0:{countdown.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-[12px] text-white/35 -mt-3">
              Accept within {countdown} seconds
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleDecline}
                disabled={declining}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full
                           bg-white/[0.04] border border-white/[0.06] text-white/45
                           hover:bg-red-500/[0.08] hover:border-red-500/[0.08] hover:text-red-400/70
                           text-[13px] font-semibold transition-all active:scale-[0.97]"
              >
                <PhoneOff className="w-4 h-4" />
                Decline
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full
                           bg-emerald-500/[0.12] border border-emerald-500/[0.1] text-emerald-400/80
                           hover:bg-emerald-500/[0.2] text-[13px] font-semibold transition-all
                           active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-4 h-4" />
                {accepting ? 'Accepting…' : 'Accept'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
