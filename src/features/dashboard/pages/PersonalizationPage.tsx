import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import apiService from '@/services/api.service';
import StepStruggles from '@/features/onboarding/components/steps/StepStruggles';
import StepTherapyHistory from '@/features/onboarding/components/steps/StepTherapyHistory';
import StepGoals from '@/features/onboarding/components/steps/StepGoals';
import StepTherapistPrefs from '@/features/onboarding/components/steps/StepTherapistPrefs';
import StepInterests from '@/features/onboarding/components/steps/StepInterests';
import StepEmergencyContact from '@/features/onboarding/components/steps/StepEmergencyContact';
import StepConfirmation from '@/features/onboarding/components/steps/StepConfirmation';

type StepPayload = Record<string, unknown>;
type StepDataMap = Record<number, StepPayload>;

type OnboardingProgress = {
  step: number;
  isComplete: boolean;
  data?: Record<string, unknown>;
};

const TOTAL_STEPS = 10;
const START_STEP = 4;
const OPTIONAL_STEPS = new Set([4, 5, 6, 7, 8, 9]);
const PERSONALIZATION_STEPS = [4, 5, 6, 7, 8, 9, 10] as const;

export default function PersonalizationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [stepData, setStepData] = useState<StepDataMap>({});
  const [submittingFinalStep, setSubmittingFinalStep] = useState(false);
  const [pendingSaves, setPendingSaves] = useState(0);
  const [hydrating, setHydrating] = useState(true);
  const [didHydrate, setDidHydrate] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const currentStep = useMemo(() => {
    const raw = Number.parseInt(searchParams.get('s') || String(START_STEP), 10);
    if (Number.isNaN(raw)) {
      return START_STEP;
    }

    return Math.min(TOTAL_STEPS, Math.max(START_STEP, raw));
  }, [searchParams]);

  const setStep = useCallback(
    (step: number) => {
      setSearchParams({ s: String(step) });
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (didHydrate) {
      return;
    }

    const hydrate = async () => {
      setHydrating(true);

      const response = await apiService.get<OnboardingProgress>('/users/onboarding');
      if (!response.success || !response.data) {
        setHydrating(false);
        setDidHydrate(true);
        return;
      }

      const data = response.data;
      if (data.data && typeof data.data === 'object') {
        const profile = data.data as Record<string, unknown>;
        const restored: StepDataMap = {
          4: Array.isArray(profile.struggles) ? { struggles: profile.struggles as string[] } : {},
          5: profile.therapyHistory ? { therapyHistory: profile.therapyHistory } : {},
          6: Array.isArray(profile.goals) ? { goals: profile.goals as string[] } : {},
          7: {
            therapistGenderPref: profile.therapistGenderPref,
            therapistLanguages: Array.isArray(profile.therapistLanguages)
              ? (profile.therapistLanguages as string[])
              : [],
            therapistApproach: profile.therapistApproach,
          },
          8: Array.isArray(profile.interests) ? { interests: profile.interests as string[] } : {},
          9: {
            emergencyName: profile.emergencyName || '',
            emergencyPhone: profile.emergencyPhone || '',
            emergencyRelation: profile.emergencyRelation || '',
          },
        };

        setStepData((prev) => ({ ...restored, ...prev }));
      }

      const hasExplicitStep = searchParams.get('s') !== null;
      if (!hasExplicitStep && data.step >= START_STEP) {
        setStep(Math.min(TOTAL_STEPS, Math.max(START_STEP, data.step)));
      }

      setHydrating(false);
      setDidHydrate(true);
    };

    void hydrate();
  }, [didHydrate, searchParams, setStep]);

  const persistStep = useCallback(async (step: number, data: StepPayload) => {
    const response = await apiService.post('/users/onboarding', { step, data });

    if (!response.success) {
      toast.error(response.error?.message || 'Could not save your answer. We will retry shortly.');
      return false;
    }

    return true;
  }, []);

  const submitStep = useCallback(
    async (step: number, data: StepPayload) => {
      setStepData((prev) => ({ ...prev, [step]: data }));

      // Final confirmation step: keep strict persistence before exit.
      if (step === TOTAL_STEPS) {
        if (submittingFinalStep) {
          return;
        }

        setSubmittingFinalStep(true);
        const saved = await persistStep(step, data);
        if (isMountedRef.current) {
          setSubmittingFinalStep(false);
        }

        if (!saved) {
          return;
        }

        navigate('/dashboard', { replace: true });
        return;
      }

      // Steps 4-9: instant UI progression, save in background.
      setStep(step + 1);
      setPendingSaves((count) => count + 1);

      void persistStep(step, data).finally(() => {
        if (isMountedRef.current) {
          setPendingSaves((count) => Math.max(0, count - 1));
        }
      });
    },
    [navigate, persistStep, setStep, submittingFinalStep],
  );

  const goBack = useCallback(() => {
    if (currentStep > START_STEP) {
      setStep(currentStep - 1);
    }
  }, [currentStep, setStep]);

  const skipStep = useCallback(() => {
    if (currentStep >= TOTAL_STEPS) {
      return;
    }

    void submitStep(currentStep, {});
  }, [currentStep, submitStep]);

  const updateStepData = useCallback((step: number, value: unknown) => {
    const payload = value && typeof value === 'object' ? (value as StepPayload) : {};
    setStepData((prev) => ({ ...prev, [step]: payload }));
  }, []);

  const renderStep = useCallback(
    (step: number) => {
      const props = {
        value: stepData[step] || {},
        onChange: (val: unknown) => updateStepData(step, val),
        onNext: () => void submitStep(step, stepData[step] || {}),
        onBack: step > START_STEP ? goBack : undefined,
        onSkip: OPTIONAL_STEPS.has(step) ? skipStep : undefined,
      };

      switch (step) {
        case 4:
          return <StepStruggles {...props} />;
        case 5:
          return <StepTherapyHistory {...props} />;
        case 6:
          return <StepGoals {...props} />;
        case 7:
          return <StepTherapistPrefs {...props} />;
        case 8:
          return <StepInterests {...props} />;
        case 9:
          return <StepEmergencyContact {...props} />;
        case 10:
          return <StepConfirmation value={{}} onChange={() => undefined} onNext={() => void submitStep(10, {})} />;
        default:
          return <StepStruggles {...props} />;
      }
    },
    [goBack, skipStep, stepData, submitStep, updateStepData],
  );

  const stepPosition = PERSONALIZATION_STEPS.indexOf(currentStep as (typeof PERSONALIZATION_STEPS)[number]) + 1;

  if (hydrating) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-1/3 bg-white animate-pulse" />
        </div>
        <p className="text-center text-white/40 mt-4 text-sm">Preparing your personalization...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 md:p-6">
      <div className="absolute right-[-180px] top-[-100px] w-[420px] h-[420px] opacity-30 pointer-events-none">
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
            filter: 'blur(64px)',
          }}
        />
      </div>

      <div className="max-w-md mx-auto mb-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <p className="text-white text-sm font-medium">Help us know you better ✨</p>
        <p className="text-white/50 text-xs mt-1">These quick answers personalize your dashboard and recommendations.</p>
      </div>

      <div className="h-1 bg-white/10 rounded-full max-w-md mx-auto overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${(stepPosition / PERSONALIZATION_STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <p className="text-center text-white/30 text-[11px] tracking-wider">
          QUESTION {stepPosition} OF {PERSONALIZATION_STEPS.length}
        </p>
        {(pendingSaves > 0 || submittingFinalStep) && <span className="text-[11px] text-white/45 animate-pulse">Saving...</span>}
      </div>

      <AnimatePresence mode="sync">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="min-h-[420px] md:min-h-[460px] flex flex-col justify-center px-2"
        >
          {renderStep(currentStep)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
