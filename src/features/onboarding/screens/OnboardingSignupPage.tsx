import { useNavigate } from 'react-router-dom';
import { UserPlus, HeartPulse, Sparkles, ShieldCheck, Compass } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { signupJourneySteps } from '@/features/onboarding/constants/signupJourneySteps';

const stepIcons = [UserPlus, HeartPulse, Sparkles, ShieldCheck, Compass];

export default function OnboardingSignupPage() {
    const navigate = useNavigate();

    const handleStartNow = () => {
        navigate('/signup?step=account');
    };

    return (
        <div className="relative h-[100dvh] bg-black overflow-hidden flex flex-col">
            {/* Ambient gradient blobs */}
            <div className="absolute right-[-200px] top-[-120px] w-[500px] h-[500px] pointer-events-none opacity-40">
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, rgba(255, 69, 0, 0.2) 40%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
            </div>
            <div className="absolute left-[-200px] bottom-[-120px] w-[450px] h-[450px] pointer-events-none opacity-40">
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0, 191, 255, 0.4) 0%, rgba(30, 144, 255, 0.2) 40%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
            </div>

            <Navigation />

            {/* Main content — flex-1 centers it vertically in remaining space */}
            <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-8 sm:pb-12">
                <div className="mx-auto w-full max-w-[1100px]">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-white text-[26px] sm:text-[32px] lg:text-[36px] font-semibold tracking-[-0.24px] leading-tight">
                            Start Your Journey
                        </h1>
                        <p className="mt-2 sm:mt-3 text-[13px] sm:text-[14px] text-white/50 tracking-[-0.12px]">
                            Complete The 5 Steps &amp; Start Healing.
                        </p>
                    </div>

                    {/* Desktop: Horizontal step cards with icons */}
                    <section className="hidden lg:block mt-10">
                        <div className="relative px-4">
                            {/* Connecting line */}
                            <div className="absolute left-[10%] right-[10%] top-[40px] border-t border-white/15" />
                            <div className="grid grid-cols-5 gap-4">
                                {signupJourneySteps.map((step, i) => {
                                    const Icon = stepIcons[i];
                                    return (
                                        <article
                                            key={step.id}
                                            className="group relative text-center px-2 pt-2 pb-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] cursor-default"
                                        >
                                            {/* Step number badge */}
                                            <div className="relative z-10 mx-auto w-[52px] h-[52px] rounded-full bg-black border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                                                <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                                            </div>
                                            {/* Step number */}
                                            <div className="mt-3 text-white/40 text-[11px] font-medium tracking-widest uppercase">
                                                Step {step.id}
                                            </div>
                                            {/* Title */}
                                            <h2 className="mt-2 text-white text-[15px] font-semibold tracking-[-0.1px] leading-snug">
                                                {step.title}
                                            </h2>
                                            {/* Description */}
                                            <p className="mt-1.5 text-white/40 text-[12px] leading-[1.5] tracking-[-0.08px]">
                                                {step.description}
                                            </p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Mobile/Tablet: Compact card list */}
                    <section className="lg:hidden mt-6 sm:mt-8">
                        <div className="space-y-2.5 sm:space-y-3">
                            {signupJourneySteps.map((step, i) => {
                                const Icon = stepIcons[i];
                                return (
                                    <article
                                        key={step.id}
                                        className="group rounded-xl border border-white/8 bg-white/[0.02] px-3.5 sm:px-4 py-3 sm:py-3.5 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/15"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-colors group-hover:border-white/30">
                                                <Icon className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/30 text-[10px] font-medium tracking-wider uppercase">{step.id}</span>
                                                    <h2 className="text-white text-[14px] sm:text-[15px] font-semibold leading-snug tracking-[-0.12px]">
                                                        {step.title}
                                                    </h2>
                                                </div>
                                                <p className="mt-0.5 text-white/40 text-[12px] sm:text-[13px] leading-[1.4] line-clamp-1">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    {/* CTA Button */}
                    <div className="mt-8 sm:mt-10 flex flex-col items-center">
                        <button
                            type="button"
                            onClick={handleStartNow}
                            className="group relative w-[220px] h-[54px] rounded-full bg-white text-black text-[15px] font-semibold tracking-[-0.14px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.98]"
                        >
                            <span className="relative z-10">Start Now</span>
                        </button>
                        <div className="mt-4 text-white text-[13px]">
                            <button
                                type="button"
                                onClick={() => navigate('/practitioner-onboarding?step=1&role=therapist')}
                                className="underline"
                            >
                                Therapist / Astrologer Onboarding
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}