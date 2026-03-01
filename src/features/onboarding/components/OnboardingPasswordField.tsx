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
                    className="text-[10px] text-black hover:underline"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/55 hover:text-black transition-colors"
                    disabled={disabled}
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}