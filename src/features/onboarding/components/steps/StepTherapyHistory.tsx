import { Clock, HeartPulse, Lightbulb, Sparkles } from 'lucide-react';
import type { StepProps } from './types';

type TherapyHistory = 'NEVER' | 'CURRENTLY' | 'PAST' | 'CONSIDERING';

const options: { value: TherapyHistory; label: string; icon: typeof Sparkles }[] = [
  { value: 'NEVER', label: 'Never tried therapy', icon: Sparkles },
  { value: 'CURRENTLY', label: 'Currently in therapy', icon: HeartPulse },
  { value: 'PAST', label: 'Had therapy in the past', icon: Clock },
  { value: 'CONSIDERING', label: 'Considering for the first time', icon: Lightbulb },
];

export default function StepTherapyHistory({ value, onChange, onNext, onBack }: StepProps) {
  const selected =
    value && typeof value === 'object' && typeof (value as { therapyHistory?: unknown }).therapyHistory === 'string'
      ? ((value as { therapyHistory: TherapyHistory }).therapyHistory as TherapyHistory)
      : null;

  return (
    <div className="text-center max-w-sm mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">Have you tried therapy before?</h2>
      <p className="text-[14px] text-white/50 mt-2">This helps us match support at your current stage</p>

      <div className="mt-8 max-w-sm mx-auto space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ therapyHistory: option.value })}
              className={`w-full px-4 py-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20'
                }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[15px] font-medium">{option.label}</span>
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
          disabled={!selected}
          className="bg-white text-black rounded-full h-[52px] w-[200px] font-semibold text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
