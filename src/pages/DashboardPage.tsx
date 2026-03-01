import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '@/services/api.service';

type OnboardingProgress = {
  step: number;
  isComplete: boolean;
};

export default function DashboardPage() {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await apiService.get<OnboardingProgress>('/users/onboarding');
      if (response.success && response.data) {
        setProgress(response.data);
      }
      setLoading(false);
    };

    void load();
  }, []);

  const shouldShowNudge = useMemo(() => {
    if (loading || dismissed) {
      return false;
    }

    if (!progress) {
      return true;
    }

    return !progress.isComplete;
  }, [dismissed, loading, progress]);

  return (
    <div className="space-y-4">
      {shouldShowNudge && (
        <div className="relative rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-white/40 hover:text-white/70 text-sm"
            aria-label="Dismiss personalization nudge"
          >
            ✕
          </button>

          <p className="text-[12px] text-white/40 tracking-wider uppercase">Personalization</p>
          <h2 className="text-white text-lg font-semibold mt-1">Help us know you better</h2>
          <p className="text-white/50 text-sm mt-1 max-w-2xl">
            Answer a few quick questions to personalize your healing experience, therapist suggestions, and dashboard recommendations.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/dashboard/personalization?s=4"
              className="inline-flex items-center justify-center bg-white text-black rounded-full h-[42px] px-5 text-sm font-semibold"
            >
              Personalize Now
            </Link>
            <span className="text-white/30 text-xs">Takes under 2 minutes</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/50">Welcome to Soul Yatri. Your authenticated session is active.</p>
      </div>
    </div>
  );
}
