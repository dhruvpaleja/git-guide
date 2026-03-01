import { useMemo } from 'react';
import type { StepProps } from './types';

const options = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'stress', label: 'Stress' },
  { value: 'grief', label: 'Grief' },
  { value: 'anger', label: 'Anger' },
  { value: 'self-esteem', label: 'Self-Esteem' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'addiction', label: 'Addiction' },
  { value: 'other', label: 'Other' },
];

export default function StepStruggles({ value, onChange, onNext, onBack }: StepProps) {
  const selected = useMemo<string[]>(() => {
    if (!value || typeof value !== 'object') {
      return [];
    }

    const struggles = (value as { struggles?: unknown }).struggles;
    if (!Array.isArray(struggles)) {
      return [];
    }

    return struggles.filter((item): item is string => typeof item === 'string');
  }, [value]);

  const toggle = (item: string) => {
    const next = selected.includes(item) ? selected.filter((v) => v !== item) : [...selected, item];
    onChange({ struggles: next });
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">What brings you here?</h2>
      <p className="text-[14px] text-white/50 mt-2">Select all that apply</p>

      <div className="mt-8 max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={`px-4 py-3 rounded-xl text-center text-[14px] cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20'
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        {onBack && (
          <button onClick={onBack} className="text-white/50 text-sm hover:text-white transition-colors">
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={selected.length < 1}
          className="bg-white text-black rounded-full h-[52px] w-[200px] font-semibold text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
