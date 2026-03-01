import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import { signupJourneySteps } from '@/features/onboarding/constants/signupJourneySteps';

export default function OnboardingSignupPage() {
    const navigate = useNavigate();

    const handleStartNow = () => {
        navigate('/signup?step=account');
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <div className="absolute right-[-250px] sm:right-[-200px] top-[-150px] sm:top-[-100px] w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] pointer-events-none opacity-50 sm:opacity-60">
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, rgba(255, 69, 0, 0.2) 40%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>

            <div className="absolute left-[-250px] sm:left-[-200px] bottom-[-150px] sm:bottom-[-100px] w-[350px] sm:w-[450px] lg:w-[500px] h-[350px] sm:h-[450px] lg:h-[500px] pointer-events-none opacity-50 sm:opacity-60">
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0, 191, 255, 0.4) 0%, rgba(30, 144, 255, 0.2) 40%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>

            <Navigation />

            <main className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-10 pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-24">
                <div className="mx-auto w-full max-w-[1240px]">
                    <div className="text-center">
                        <h1 className="text-white text-[30px] sm:text-[36px] lg:text-[40px] font-semibold tracking-[-0.24px] leading-tight">
                            Start Your Journey
                        </h1>
                        <p className="mt-5 text-[15px] sm:text-[16px] text-white/50 tracking-[-0.12px] leading-normal">
                            Complete The 5 Steps &amp; Start Healing.
                        </p>
                    </div>

                    <section className="hidden lg:block mt-20">
                        <div className="relative px-8">
                            <div className="absolute left-8 right-8 top-[36px] border-t border-white/20" />
                            <div className="grid grid-cols-5 gap-8">
                                {signupJourneySteps.map((step) => (
                                    <article key={step.id} className="text-center px-1">
                                        <div className="text-white text-[22px] font-semibold tracking-[-0.2px] leading-none">{step.id}</div>
                                        <div className="mx-auto mt-4 size-2 rounded-full bg-white" />
                                        <h2 className="mt-8 text-white text-[20px] font-semibold tracking-[-0.12px] leading-snug min-h-[56px] flex items-center justify-center">
                                            {step.title}
                                        </h2>
                                        <p className="mt-4 text-white/50 text-[13px] leading-8 tracking-[-0.1px]">
                                            {step.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="lg:hidden mt-10 sm:mt-12">
                        <div className="space-y-4 sm:space-y-5">
                            {signupJourneySteps.map((step) => (
                                <article key={step.id} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-4 sm:py-5">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white text-[18px] font-semibold">
                                            {step.id}
                                        </div>
                                        <div>
                                            <h2 className="text-white text-[16px] sm:text-[18px] font-semibold leading-snug tracking-[-0.16px]">
                                                {step.title}
                                            </h2>
                                            <p className="mt-1.5 sm:mt-2 text-white/50 text-[13px] sm:text-[14px] leading-6">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <div className="mt-16 sm:mt-20 flex justify-center">
                        <button
                            type="button"
                            onClick={handleStartNow}
                            className="w-[200px] h-[60px] rounded-[25px] bg-white border border-black text-black text-[16px] font-semibold tracking-[-0.16px] hover:bg-white/90 transition-colors"
                        >
                            Start Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}