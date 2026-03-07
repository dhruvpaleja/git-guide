import { HelpCircle, User, Users } from 'lucide-react';
import type { StepProps } from './types';

type GenderValue = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

const options: { value: GenderValue; label: string; icon: typeof User }[] = [
  { value: 'MALE', label: 'Male', icon: User },
  { value: 'FEMALE', label: 'Female', icon: User },
  { value: 'NON_BINARY', label: 'Non-Binary', icon: Users },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say', icon: HelpCircle },
];

export default function StepGender({ value, onChange, onNext, onBack }: StepProps) {
  const selected =
    value && typeof value === 'object' && typeof (value as { gender?: unknown }).gender === 'string'
      ? ((value as { gender: GenderValue }).gender as GenderValue)
      : null;

  return (
    <div className="text-center max-w-sm mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">How do you identify?</h2>
      <p className="text-[14px] text-white/50 mt-2">This helps us personalize your wellness guide match</p>

      <div className="mt-8 max-w-xs mx-auto grid grid-cols-2 gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ gender: option.value })}
              className={`h-[90px] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? 'bg-white text-black border border-white'
                    : 'bg-white/[0.02] border border-white/10 text-white/60 hover:border-white/20'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[13px] font-medium leading-tight px-2">{option.label}</span>
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
