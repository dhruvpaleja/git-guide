import { useMemo } from 'react';
import type { StepProps } from './types';

type EmergencyValue = {
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
};

export default function StepEmergencyContact({ value, onChange, onNext, onBack }: StepProps) {
  const emergency = useMemo<EmergencyValue>(() => {
    if (!value || typeof value !== 'object') {
      return { emergencyName: '', emergencyPhone: '', emergencyRelation: '' };
    }

    const raw = value as Partial<EmergencyValue>;
    return {
      emergencyName: typeof raw.emergencyName === 'string' ? raw.emergencyName : '',
      emergencyPhone: typeof raw.emergencyPhone === 'string' ? raw.emergencyPhone : '',
      emergencyRelation: typeof raw.emergencyRelation === 'string' ? raw.emergencyRelation : '',
    };
  }, [value]);

  const update = (patch: Partial<EmergencyValue>) => {
    onChange({ ...emergency, ...patch });
  };

  const canContinue =
    emergency.emergencyName.trim().length > 0 &&
    emergency.emergencyPhone.trim().length >= 10 &&
    emergency.emergencyRelation.trim().length > 0;

  return (
    <div className="text-center max-w-sm mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">Emergency Contact</h2>
      <p className="text-[14px] text-white/50 mt-2">Someone we can reach in case of crisis. Strictly confidential.</p>

      <div className="mt-8 space-y-3">
        <input
          type="text"
          placeholder="Contact Name"
          value={emergency.emergencyName}
          onChange={(e) => update({ emergencyName: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] placeholder:text-white/20 focus:border-white/30 focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Phone Number (10 digits)"
          value={emergency.emergencyPhone}
          onChange={(e) => update({ emergencyPhone: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] placeholder:text-white/20 focus:border-white/30 focus:outline-none"
        />
        <select
          value={emergency.emergencyRelation}
          onChange={(e) => update({ emergencyRelation: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] focus:border-white/30 focus:outline-none"
        >
          <option value="">Relationship</option>
          <option value="Parent">Parent</option>
          <option value="Spouse">Spouse</option>
          <option value="Sibling">Sibling</option>
          <option value="Friend">Friend</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <p className="text-[11px] text-white/20 mt-3">Only used in genuine emergencies</p>

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
