import { useMemo } from 'react';
import type { StepProps } from './types';

type LocationValue = { city: string; state?: string; country?: string };

export default function StepLocation({ value, onChange, onNext, onBack }: StepProps) {
  const location = useMemo<LocationValue>(() => {
    if (!value || typeof value !== 'object') {
      return { city: '', state: '', country: 'India' };
    }

    const raw = value as Partial<LocationValue>;
    return {
      city: typeof raw.city === 'string' ? raw.city : '',
      state: typeof raw.state === 'string' ? raw.state : '',
      country: typeof raw.country === 'string' ? raw.country : 'India',
    };
  }, [value]);

  const canContinue = location.city.trim().length > 0;

  const update = (patch: Partial<LocationValue>) => {
    onChange({ ...location, ...patch });
  };

  return (
    <div className="text-center max-w-sm mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">Where are you based?</h2>
      <p className="text-[14px] text-white/50 mt-2">We’ll tailor support for your location</p>

      <div className="mt-8 space-y-3">
        <input
          type="text"
          placeholder="City"
          value={location.city}
          onChange={(e) => update({ city: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] placeholder:text-white/20 focus:border-white/30 focus:outline-none"
        />
        <input
          type="text"
          placeholder="State"
          value={location.state || ''}
          onChange={(e) => update({ state: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] placeholder:text-white/20 focus:border-white/30 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Country"
          value={location.country || ''}
          onChange={(e) => update({ country: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] placeholder:text-white/20 focus:border-white/30 focus:outline-none"
        />
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        {onBack && (
          <button onClick={onBack} className="text-white/50 text-sm hover:text-white transition-colors">
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-white text-black rounded-full h-[52px] w-[200px] font-semibold text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
