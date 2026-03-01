import { useMemo } from 'react';
import type { StepProps } from './types';

type TherapistPrefs = {
  therapistGenderPref?: string;
  therapistLanguages?: string[];
  therapistApproach?: string;
};

const languageOptions = ['english', 'hindi', 'marathi', 'tamil', 'telugu', 'bengali', 'kannada', 'malayalam', 'gujarati'];

export default function StepTherapistPrefs({ value, onChange, onNext, onBack, onSkip }: StepProps) {
  const prefs = useMemo<TherapistPrefs>(() => {
    if (!value || typeof value !== 'object') {
      return { therapistLanguages: [] };
    }

    const raw = value as TherapistPrefs;
    return {
      therapistGenderPref: typeof raw.therapistGenderPref === 'string' ? raw.therapistGenderPref : undefined,
      therapistApproach: typeof raw.therapistApproach === 'string' ? raw.therapistApproach : undefined,
      therapistLanguages: Array.isArray(raw.therapistLanguages)
        ? raw.therapistLanguages.filter((item): item is string => typeof item === 'string')
        : [],
    };
  }, [value]);

  const update = (patch: TherapistPrefs) => {
    onChange({ ...prefs, ...patch });
  };

  const toggleLanguage = (lang: string) => {
    const current = prefs.therapistLanguages || [];
    const next = current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang];
    update({ therapistLanguages: next });
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">Therapist Preferences</h2>
      <p className="text-[14px] text-white/50 mt-2">Optional preferences for better matching</p>

      <div className="mt-8 space-y-6 text-left">
        <div>
          <p className="text-white/70 text-sm mb-3">Preferred gender</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'no-preference', label: 'No Preference' },
            ].map((item) => {
              const selected = prefs.therapistGenderPref === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => update({ therapistGenderPref: item.value })}
                  className={`px-3 py-3 rounded-xl border text-sm transition-all
                    ${selected ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-3">Languages</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languageOptions.map((lang) => {
              const selected = (prefs.therapistLanguages || []).includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-2 rounded-xl border text-sm capitalize transition-all
                    ${selected ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20'}`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-3">Preferred approach</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { value: 'CBT', label: 'Talk Therapy (CBT)' },
              { value: 'HOLISTIC', label: 'Holistic / Indian Wisdom' },
              { value: 'MIXED', label: 'Mixed Approach' },
            ].map((item) => {
              const selected = prefs.therapistApproach === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => update({ therapistApproach: item.value })}
                  className={`px-3 py-3 rounded-xl border text-sm transition-all
                    ${selected ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
        {onBack && (
          <button onClick={onBack} className="text-white/50 text-sm hover:text-white transition-colors">
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="bg-white text-black rounded-full h-[52px] w-[200px] font-semibold text-[15px]"
        >
          Continue
        </button>
        {onSkip && (
          <button onClick={onSkip} className="text-white/30 text-sm hover:text-white/60 transition-colors">
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
