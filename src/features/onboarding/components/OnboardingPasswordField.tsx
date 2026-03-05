import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type OnboardingPasswordFieldProps = {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    onSuggestPassword?: () => void;
};

export default function OnboardingPasswordField({
    id,
    label,
    value,
    placeholder,
    disabled,
    onChange,
    onSuggestPassword,
}: OnboardingPasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <label htmlFor={id} className="text-[13px] sm:text-[14px] text-black/50 tracking-[-0.14px]">
                    {label} <span className="text-[#d93025]">*</span>
                </label>
                <button
                    type="button"
                    className="inline-flex min-h-[36px] items-center text-[12px] text-black hover:underline"
                    onClick={onSuggestPassword}
                    disabled={disabled}
                >
                    Suggest A Password
                </button>
            </div>

            <div className="relative mt-2.5">
                <input
                    id={id}
                    type={isVisible ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full h-[56px] sm:h-[60px] rounded-[24px] border border-black/10 bg-[#f9f9f9] px-5 sm:px-7 pr-12 text-[14px] text-black/60 placeholder:text-black/35 focus:outline-none focus:border-black/30 transition-colors"
                />

                <button
                    type="button"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    onClick={() => setIsVisible((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full text-black/55 hover:text-black hover:bg-black/5 transition-colors"
                    disabled={disabled}
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}
