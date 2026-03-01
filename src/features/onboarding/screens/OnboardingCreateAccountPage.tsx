import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import OnboardingPasswordField from '@/features/onboarding/components/OnboardingPasswordField';

type OnboardingCreateAccountPageProps = {
    onBack: () => void;
};

export default function OnboardingCreateAccountPage({ onBack }: OnboardingCreateAccountPageProps) {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        const response = await signup({
            name: name.trim(),
            email: email.trim(),
            password,
        });

        if (response.success) {
            navigate('/signup?step=astrology');
            return;
        }

        setError(response.error || 'Unable to create account. Please try again.');
    };

    const handleGoogleSignup = () => {
        console.warn('Google signup is not configured yet.');
    };

    const handleAppleSignup = () => {
        console.warn('Apple signup is not configured yet.');
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4]" data-theme="light">
            <Navigation />

            <div className="pt-32 pb-16 min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center lg:min-h-[calc(100vh-280px)]">
                        {/* Form Section */}
                        <div className="max-w-[540px] mx-auto lg:mx-0 lg:pr-8">
                            <button
                                type="button"
                                onClick={onBack}
                                className="mb-8 size-[30px] rounded-full border border-black text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={14} className="text-black" />
                            </button>
                            <div>
                            <h1 className="text-black text-[38px] sm:text-[42px] lg:text-[46px] font-semibold tracking-[-0.32px] leading-[1.1]">
                                Create Your Account
                            </h1>
                            <p className="mt-3 text-[15px] sm:text-[16px] text-black/50 tracking-[-0.16px]">To Start Healing Your Journey.</p>

                            {error && (
                                <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                                <div>
                                    <label htmlFor="onboarding-name" className="text-[14px] sm:text-[15px] text-black/50 tracking-[-0.16px]">
                                        Enter Full Name <span className="text-[#d93025]">*</span>
                                    </label>
                                    <input
                                        id="onboarding-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex. Dhruv Paleja"
                                        disabled={isLoading}
                                        className="mt-2 w-full h-[54px] sm:h-[56px] rounded-[24px] border border-black/10 bg-[#f9f9f9] px-5 sm:px-6 text-[14px] text-black/60 placeholder:text-black/35 focus:outline-none focus:border-black/30 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="onboarding-email" className="text-[14px] sm:text-[15px] text-black/50 tracking-[-0.16px]">
                                        Enter Mail <span className="text-[#d93025]">*</span>
                                    </label>
                                    <input
                                        id="onboarding-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Ex. dhruvpaleja10@hotmail.com"
                                        disabled={isLoading}
                                        className="mt-2 w-full h-[54px] sm:h-[56px] rounded-[24px] border border-black/10 bg-[#f9f9f9] px-5 sm:px-6 text-[14px] text-black/60 placeholder:text-black/35 focus:outline-none focus:border-black/30 transition-colors"
                                    />
                                </div>

                                <OnboardingPasswordField
                                    id="onboarding-password"
                                    label="Create A Password"
                                    value={password}
                                    onChange={setPassword}
                                    placeholder="Ex. dhruvpaleja23314@"
                                    disabled={isLoading}
                                    onSuggestPassword={() => {
                                        setPassword(Math.random().toString(36).slice(-12) + 'A1!');
                                    }}
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-[54px] sm:h-[56px] rounded-[25px] bg-[#080808] text-white text-[15px] font-semibold tracking-[-0.16px] hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>

                                <p className="text-center text-[13px] text-black/50 tracking-[-0.14px]">
                                    By Clicking This Button You Will Have A Survey.
                                </p>
                            </form>

                            <div className="mt-5 mb-6 lg:mb-0">
                                <p className="text-center text-[13px] sm:text-[14px] text-black/60">Or Sign Up Using</p>
                                <div className="mt-3 flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignup}
                                        className="size-[44px] rounded-[18px] border border-black/10 bg-white flex items-center justify-center hover:bg-black/[0.02] transition-colors"
                                        aria-label="Sign up with Google"
                                    >
                                        <img src="/images/auth/google-icon.png" alt="Google" className="w-5 h-5 object-contain" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAppleSignup}
                                        className="size-[44px] rounded-[18px] border border-black/10 bg-white flex items-center justify-center hover:bg-black/[0.02] transition-colors"
                                        aria-label="Sign up with Apple"
                                    >
                                        <img src="/images/auth/apple-icon.png" alt="Apple" className="w-[18px] h-[18px] object-contain" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                        {/* Image Section */}
                        <div className="hidden lg:flex justify-center items-center">
                            <img
                                src="/images/onboarding/create-account-hero.png"
                                alt="Meditative portrait"
                                className="w-full max-w-[500px] h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}