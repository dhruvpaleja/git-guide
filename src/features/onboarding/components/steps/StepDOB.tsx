import { useEffect, useMemo, useState } from 'react';
import type { StepProps } from './types';

const months = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

function getDateFromValue(value: unknown): { day: string; month: string; year: string } {
  if (!value || typeof value !== 'object') {
    return { day: '', month: '', year: '' };
  }

  const raw = (value as { dateOfBirth?: unknown }).dateOfBirth;
  if (typeof raw !== 'string') {
    return { day: '', month: '', year: '' };
  }

  const parts = raw.split('-');
  if (parts.length !== 3) {
    return { day: '', month: '', year: '' };
  }

  return { year: parts[0], month: parts[1], day: parts[2] };
}

export default function StepDOB({ value, onChange, onNext, onSkip }: StepProps) {
  const initial = useMemo(() => getDateFromValue(value), [value]);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  useEffect(() => {
    // Use setTimeout to avoid setting state directly in effect
    setTimeout(() => {
      setDay(initial.day);
      setMonth(initial.month);
      setYear(initial.year);
    }, 0);
  }, [initial.day, initial.month, initial.year]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = 2010; y >= 1940; y -= 1) {
      list.push(y);
    }
    return list;
  }, []);

  useEffect(() => {
    if (day && month && year) {
      onChange({ dateOfBirth: `${year}-${month}-${day}` });
      return;
    }

    onChange({});
  }, [day, month, year, onChange]);

  return (
    <div className="text-center max-w-sm mx-auto">
      <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">When were you born?</h2>
      <p className="text-[14px] text-white/50 mt-2">This helps us personalize your journey</p>

      <div className="mt-8 flex gap-3 justify-center">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl text-white px-3 py-3 text-[14px] appearance-none"
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl text-white px-3 py-3 text-[14px] appearance-none"
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl text-white px-3 py-3 text-[14px] appearance-none"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="bg-white text-black rounded-full h-[52px] w-[200px] font-semibold text-[15px]"
        >
          Continue
        </button>
        {onSkip && (
          <button onClick={onSkip} className="text-white/30 text-sm hover:text-white/60 transition-colors">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
