import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { therapyApi } from '@/services/therapy.api';
import { videoApi } from '@/services/video.api';
import type { SessionDetail, SessionStatus } from '@/types/therapy.types';
import VideoSDKRoom from '@/features/video/VideoSDKRoom';
import {
  ArrowLeft, Calendar, Clock, Star, MapPin, MessageCircle, X,
  Play, CheckCircle, UserX, Loader2, ExternalLink, AlertTriangle,
  Sparkles, Phone, FileText, Video,
} from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function relativeTime(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const mins = Math.floor(absDiff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return diff > 0 ? `in ${days} day${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
  if (hrs > 0) return diff > 0 ? `in ${hrs} hour${hrs > 1 ? 's' : ''}` : `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  if (mins > 0) return diff > 0 ? `in ${mins} min` : `${mins} min ago`;
  return 'just now';
}

function sessionTypeBadge(type: string, price: number, duration: number) {
  switch (type) {
    case 'discovery':
      return { label: `Free • ${duration} min`, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'pay_as_you_like':
      return { label: `Pay what you feel • ${duration} min`, className: 'bg-blue-50 text-blue-700 border-blue-200' };
    default:
      return { label: `₹${price} • ${duration} min`, className: 'bg-gray-50 text-gray-700 border-gray-200' };
  }
}

const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string; icon: typeof CheckCircle }> = {
  SCHEDULED: { label: 'Scheduled', className: 'bg-indigo-50 text-indigo-700', icon: Calendar },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-amber-50 text-amber-700', icon: Play },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-700', icon: X },
  NO_SHOW: { label: 'No Show', className: 'bg-gray-100 text-gray-600', icon: UserX },
};

function addToCalendarUrl(session: SessionDetail): string {
  const start = new Date(session.scheduledAt);
  const end = new Date(start.getTime() + session.duration * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = encodeURIComponent(`Soul Yatri — Call with ${session.therapist.name}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}`;
}

function isStartingSoon(scheduledAt: string): boolean {
  const diff = new Date(scheduledAt).getTime() - Date.now();
  return diff > 0 && diff <= 30 * 60 * 1000; // Within 30 minutes
}

/* ── Skeleton ────────────────────────────────────────────────── */

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="bg-white rounded-[20px] p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-10 w-40 bg-gray-200 rounded-full mt-4" />
      </div>
    </div>
  );
}

/* ── Inline Rating ───────────────────────────────────────────── */

function InlineRating({
  sessionId,
  guideName,
  onRated,
}: {
  sessionId: string;
  guideName: string;
  onRated: (rating: number) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await therapyApi.rateSession(sessionId, { rating, feedback: feedback.trim() || undefined });
      setSubmitted(true);
      onRated(rating);
    } catch {
      // Error handled silently
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 rounded-[16px] border border-emerald-100 p-5">
        <p className="text-sm font-semibold text-emerald-800">Thank you for your feedback!</p>
        <p className="text-[13px] text-emerald-600 mt-1">
          {rating >= 4
            ? `Glad it went well! Book your next call with ${guideName}.`
            : "We hear you. We'll use this to improve your matches."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5 space-y-4">
      <p className="text-sm font-bold text-gray-900">How was your call with {guideName}?</p>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-8 h-8 ${(hover || rating) >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
      {/* Feedback */}
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Share your thoughts (optional)…"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
      />
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2C2F7A] text-white text-sm font-semibold hover:bg-[#24276B] transition-all shadow-sm disabled:opacity-50"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
        Submit Rating
      </button>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */

export default function SessionDetailPage() {
  useDocumentTitle('Session Details');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action states
  const [cancelling, setCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Video call states
  const [showVideo, setShowVideo] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Therapist action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [therapistNotes, setTherapistNotes] = useState('');

  const isTherapist = user?.role === 'practitioner';

  /* ── Fetch session ── */
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await therapyApi.getSession(id);
        if (!cancelled && res.data) {
          setSession(res.data as SessionDetail);
        }
      } catch {
        if (!cancelled) setError('Session not found or access denied.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  /* ── Cancel session ── */
  const handleCancel = useCallback(async () => {
    if (!session) return;
    setCancelling(true);
    try {
      const res = await therapyApi.cancelSession(session.id, cancelReason.trim() || undefined);
      if (res.data) setSession(res.data as SessionDetail);
      setCancelDialogOpen(false);
      setCancelReason('');
    } catch {
      // Error handled silently
    } finally {
      setCancelling(false);
    }
  }, [session, cancelReason]);

  /* ── Reschedule (navigate to booking flow) ── */
  const handleReschedule = useCallback(() => {
    if (!session) return;
    navigate(`/dashboard/sessions?reschedule=${session.id}&therapist=${session.therapistId}`);
  }, [session, navigate]);

  /* ── Start video call ── */
  const handleStartCall = useCallback(async () => {
    if (!session) return;
    try {
      setVideoError(null);
      // Start video session (creates room)
      await videoApi.startSession(session.id);
      setVideoStarted(true);
      setShowVideo(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setVideoError(error.message || 'Failed to start video call');
      console.error(err);
    }
  }, [session]);

  /* ── Leave video call ── */
  const handleLeaveCall = useCallback(() => {
    setShowVideo(false);
    setVideoStarted(false);
    // Refresh session data
    if (id) {
      therapyApi.getSession(id).then(res => {
        if (res.data) setSession(res.data as SessionDetail);
      });
    }
  }, [id]);

  /* ── Therapist actions ── */
  const handleTherapistAction = useCallback(async (action: 'start' | 'complete' | 'noshow') => {
    if (!session || !id) return;
    setActionLoading(action);
    try {
      let response;
      if (action === 'start') {
        response = await therapyApi.startSession(id);
      } else if (action === 'complete') {
        response = await therapyApi.completeSession(id, therapistNotes.trim() || undefined);
      } else if (action === 'noshow') {
        response = await therapyApi.markNoShow(id);
      }
      if (response?.data) {
        setSession(response.data as SessionDetail);
      }
    } catch {
      // Error handled silently — user sees stale state as indication
    } finally {
      setActionLoading(null);
    }
  }, [session, id, therapistNotes]);

  const handleRated = useCallback((rating: number) => {
    setSession(prev => prev ? { ...prev, userRating: rating } : prev);
  }, []);

  /* ── Render ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] px-4 py-6 md:px-8">
        <Skeleton />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-10 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || 'This session does not exist or you do not have access.'}</p>
          <Link to="/dashboard/sessions" className="px-6 py-2.5 rounded-full bg-[#2C2F7A] text-white text-sm font-semibold hover:bg-[#24276B] transition-all">
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[session.status];
  const StatusIcon = statusCfg.icon;
  const typeBadge = sessionTypeBadge(session.sessionType, session.priceAtBooking, session.duration);

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-4 py-6 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ─── Back nav ─── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* ─── Status + Type badges ─── */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusCfg.className}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusCfg.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${typeBadge.className}`}>
            {typeBadge.label}
          </span>
          <span className="text-xs text-gray-400 font-medium">{relativeTime(session.scheduledAt)}</span>
        </div>

        {/* ─── Therapist / Guide Card ─── */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            {session.therapist.photoUrl ? (
              <img
                src={session.therapist.photoUrl}
                alt={session.therapist.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xl font-bold text-indigo-600">
                {session.therapist.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{session.therapist.name}</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">
                {session.therapist.specializations.join(' • ')}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-700">{session.therapist.rating.toFixed(1)}</span>
                </div>
                {session.matchScore && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-semibold text-indigo-600">{session.matchScore}% match</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Session Details Grid ─── */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Session Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Date</p>
                <p className="text-sm font-semibold text-gray-800">{formatDate(session.scheduledAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Time</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatTime(session.scheduledAt)} • {session.duration} min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Booking Source</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{session.bookingSource.replace(/_/g, ' ')}</p>
              </div>
            </div>
            {session.userPaidAmount !== null && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <span className="text-base">₹</span>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Amount Paid</p>
                  <p className="text-sm font-semibold text-gray-800">₹{session.userPaidAmount}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Match Reasons ─── */}
        {session.matchReason && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-[20px] border border-indigo-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Why we matched you</h3>
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed">{session.matchReason}</p>
          </div>
        )}

        {/* ─── Actions (User View — based on status) ─── */}
        {!isTherapist && (
          <>
            {/* SCHEDULED actions */}
            {session.status === 'SCHEDULED' && (
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Actions</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Start Call button - shown when session is starting soon */}
                  {isStartingSoon(session.scheduledAt) && (
                    <button
                      onClick={handleStartCall}
                      disabled={videoStarted}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <Video className="w-4 h-4" />
                      {videoStarted ? 'Call Active' : 'Start Call'}
                    </button>
                  )}
                  
                  <a
                    href={addToCalendarUrl(session)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Add to Calendar
                  </a>
                  <button
                    onClick={handleReschedule}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => setCancelDialogOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-red-600 bg-red-50 text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
                
                {/* Video call error */}
                {videoError && (
                  <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-700">{videoError}</p>
                  </div>
                )}
              </div>
            )}

            {/* COMPLETED — not yet rated */}
            {session.status === 'COMPLETED' && !session.userRating && (
              <InlineRating
                sessionId={session.id}
                guideName={session.therapist.name}
                onRated={handleRated}
              />
            )}

            {/* COMPLETED — already rated */}
            {session.status === 'COMPLETED' && session.userRating && (
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Your Rating</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className={`w-6 h-6 ${s <= (session.userRating ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                {session.userFeedback && (
                  <div className="flex items-start gap-2 mt-3">
                    <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-[13px] text-gray-600 leading-relaxed">{session.userFeedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* CANCELLED */}
            {session.status === 'CANCELLED' && (
              <div className="bg-red-50/50 rounded-[20px] border border-red-100 p-6">
                <h3 className="text-sm font-bold text-red-800 mb-2">Session Cancelled</h3>
                {session.cancelReason && (
                  <p className="text-[13px] text-red-600 mb-4">Reason: {session.cancelReason}</p>
                )}
                <p className="text-[12px] text-gray-500 mb-4">
                  Cancelled {session.cancelledAt ? relativeTime(session.cancelledAt) : ''} by {session.cancelledBy === session.userId ? 'you' : 'your guide'}
                </p>
                <Link
                  to={`/dashboard/sessions`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C2F7A] text-white text-sm font-semibold hover:bg-[#24276B] transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Book Again
                </Link>
              </div>
            )}
          </>
        )}

        {/* ─── Therapist-Only View ─── */}
        {isTherapist && (
          <>
            {/* Session control actions */}
            {(session.status === 'SCHEDULED' || session.status === 'IN_PROGRESS') && (
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Session Controls</h3>

                {session.status === 'SCHEDULED' && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => handleTherapistAction('start')}
                      disabled={actionLoading !== null}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      Start Session
                    </button>
                    <button
                      onClick={() => handleTherapistAction('noshow')}
                      disabled={actionLoading !== null}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === 'noshow' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                      Mark No Show
                    </button>
                  </div>
                )}

                {session.status === 'IN_PROGRESS' && (
                  <div className="space-y-3">
                    <textarea
                      value={therapistNotes}
                      onChange={e => setTherapistNotes(e.target.value)}
                      maxLength={5000}
                      rows={4}
                      placeholder="Session notes (private — only visible to you)…"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTherapistAction('complete')}
                        disabled={actionLoading !== null}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C2F7A] text-white text-sm font-semibold hover:bg-[#24276B] transition-colors disabled:opacity-50"
                      >
                        {actionLoading === 'complete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Complete Session
                      </button>
                      <button
                        onClick={() => handleTherapistAction('noshow')}
                        disabled={actionLoading !== null}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === 'noshow' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                        No Show
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Astrologer notes (read-only placeholder) */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-[20px] border border-purple-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-gray-900">Astrologer Notes</h3>
              </div>
              <p className="text-[13px] text-gray-500 italic">
                No astrologer notes available yet. These will be populated once the constellation analysis is complete.
              </p>
            </div>
          </>
        )}

        {/* ─── Cancel Dialog ─── */}
        {cancelDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Cancel this session?</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone. Cancellations must be made at least 2 hours before the session.
              </p>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Reason for cancellation (optional)…"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              />
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setCancelDialogOpen(false)}
                  disabled={cancelling}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Keep Session
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Cancel Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Video Call Modal ─── */}
        {showVideo && videoStarted && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm">
            <div className="w-full h-full max-w-7xl mx-auto p-4">
              <VideoSDKRoom
                sessionId={session.id}
                userName={user?.name || 'User'}
                isTherapist={isTherapist}
                onLeave={handleLeaveCall}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
