import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    useDocumentTitle('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPageReady, setIsPageReady] = useState(false);
    // toggle is no longer used; role determined by server response
    const [isPractitioner, setIsPractitioner] = useState(false); // keep for UI animation placeholder
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => setIsPageReady(true), 80);
        return () => window.clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { success, user } = await login(email, password);
            if (success) {
                // Route directly to the appropriate dashboard based on role
                // Onboarding is only accessed via explicit links on login/signup pages
                switch (user?.role) {
                    case 'practitioner':
                        navigate('/practitioner');
                        break;
                    case 'astrologer':
                        navigate('/astrology');
                        break;
                    case 'admin':
                        navigate('/admin');
                        break;
                    default:
                        navigate('/journey-preparation');
                        break;
                }
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Google OAuth integration placeholder
        console.warn('Google OAuth not yet configured');
    };

    const handleAppleLogin = () => {
        // Apple OAuth integration placeholder
        console.warn('Apple OAuth not yet configured');
    };

    const stageClass = isPageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Background Decorative Elements */}
            <div
                className={`absolute right-[-250px] sm:right-[-200px] top-[-150px] sm:top-[-100px] w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] pointer-events-none opacity-50 sm:opacity-60 transition-all duration-1000 ease-out ${stageClass}`}
                style={{ transitionDelay: '120ms' }}
            >
                <div className="w-full h-full rounded-full auth-orb-warm animate-ambient-breathe" />
            </div>
            <div
                className={`absolute left-[-250px] sm:left-[-200px] bottom-[-150px] sm:bottom-[-100px] w-[350px] sm:w-[450px] lg:w-[500px] h-[350px] sm:h-[450px] lg:h-[500px] pointer-events-none opacity-50 sm:opacity-60 transition-all duration-1000 ease-out ${stageClass}`}
                style={{ transitionDelay: '220ms' }}
            >
                <div className="w-full h-full rounded-full auth-orb-cool animate-ambient-breathe" style={{ animationDelay: '1.2s' }} />
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(65%_55%_at_50%_45%,rgba(255,255,255,0.06),rgba(0,0,0,0.0)_60%)]" />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-start md:items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-36 pb-10 sm:pb-14 md:pb-16">
                <div
                    className={`w-full max-w-[95%] sm:max-w-[460px] rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#080808]/70 backdrop-blur-xl p-5 sm:p-7 lg:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] space-y-4 sm:space-y-5 transition-all duration-700 ease-out ${stageClass}`}
                    style={{ transitionDelay: '100ms' }}
                >
                    {/* Header */}
                    <h1
                        className={`text-white text-center text-[22px] sm:text-[26px] lg:text-[28px] font-semibold tracking-tight leading-tight px-2 transition-all duration-700 ease-out ${stageClass}`}
                        style={{ transitionDelay: '180ms' }}
                    >
                        Login To Your Existing Account
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[18px] sm:rounded-[20px] text-xs sm:text-sm text-center animate-fade-in-up">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form
                        onSubmit={handleSubmit}
                        className={`space-y-3.5 sm:space-y-4 transition-all duration-700 ease-out ${stageClass}`}
                        style={{ transitionDelay: '240ms' }}
                    >
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-white/50 text-[13px] sm:text-[14px] font-normal">
                                Enter Mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex. dhruvpaleja10@hotmail.com"
                                required
                                className="w-full h-[48px] sm:h-[52px] px-4 sm:px-5 bg-[#080808]/90 border border-white/10 rounded-[18px] sm:rounded-[20px] text-white text-[13px] sm:text-[14px] placeholder:text-white/30 focus:outline-none focus:border-white/35 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-all duration-300"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-white/50 text-[13px] sm:text-[14px] font-normal">
                                    Enter Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="inline-flex min-h-[36px] items-center text-white text-[12px] sm:text-[13px] hover:text-white/80 transition-colors"
                                >
                                    Forgot Password
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ex. dhruvpaleja23314@"
                                    required
                                    className="w-full h-[48px] sm:h-[52px] px-4 sm:px-5 pr-12 bg-[#080808]/90 border border-white/10 rounded-[18px] sm:rounded-[20px] text-white text-[13px] sm:text-[14px] placeholder:text-white/30 focus:outline-none focus:border-white/35 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-all duration-300"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full text-white/50 hover:text-white/80 hover:bg-white/8 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Practitioner Toggle */}
                        <div className="flex items-center gap-3 pt-4 sm:pt-2 w-full justify-center">

                            <button
                                type="button"
                                onClick={() => setIsPractitioner(!isPractitioner)}
                                className="w-[70px] h-[36px] rounded-[20px] bg-[#2A2A2A] relative flex items-center px-1 shadow-inner cursor-pointer"
                                aria-label="Toggle Practitioner Login"
                            >
                                <span
                                    className={`w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center shadow-md transform transition-all duration-400 ease-soul-spring ${isPractitioner ? 'translate-x-[34px]' : 'translate-x-0'
                                        }`}
                                >
                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPractitioner ? 'opacity-100' : 'opacity-0'}`}>
                                        <img
                                            src="/images/main-logo.png"
                                            className="w-[20px] h-[20px] object-contain"
                                            alt="Soul Yatri"
                                        />
                                    </div>
                                </span>
                            </button>

                            <span className="text-white/80 text-[15px] font-medium tracking-wide">
                                Practitioner
                            </span>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[48px] sm:h-[52px] mt-4 sm:mt-5 bg-white border border-black rounded-[18px] sm:rounded-[20px] text-black text-[14px] sm:text-[15px] font-semibold hover:bg-white/90 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    {/* Create Account Link */}
                    <div
                        className={`text-center text-[12px] sm:text-[13px] pt-0.5 sm:pt-1 transition-all duration-700 ease-out ${stageClass}`}
                        style={{ transitionDelay: '320ms' }}
                    >
                        <span className="text-white/50">I Don't Have An Account </span>
                        <Link
                            to="/signup"
                            className="inline-flex min-h-[36px] items-center text-white underline hover:text-white/80 transition-colors"
                        >
                            Create Account
                        </Link>
                        <div className="mt-1 text-white/50 text-[11px]">
                            <button
                                type="button"
                                onClick={() => navigate('/practitioner-onboarding?step=1')}
                                className="inline-flex min-h-[36px] items-center underline hover:text-white"
                            >
                                Practitioner/Astrologer Onboarding
                            </button>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div
                        className={`space-y-2.5 sm:space-y-3 pt-1.5 sm:pt-2 transition-all duration-700 ease-out ${stageClass}`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <p className="text-white text-[13px] sm:text-[14px] font-semibold text-center">
                            Login Using
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            {/* Google Login */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] bg-white rounded-[18px] sm:rounded-[20px] flex items-center justify-center hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                                aria-label="Login with Google"
                            >
                                <img
                                    src="/images/auth/google-icon.png"
                                    alt="Google"
                                    className="w-[18px] sm:w-[20px] h-[18px] sm:h-[20px] object-contain"
                                />
                            </button>

                            {/* Apple Login */}
                            <button
                                type="button"
                                onClick={handleAppleLogin}
                                className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] bg-white rounded-[18px] sm:rounded-[20px] flex items-center justify-center hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                                aria-label="Login with Apple"
                            >
                                <img
                                    src="/images/auth/apple-icon.png"
                                    alt="Apple"
                                    className="w-[17px] sm:w-[18px] h-[17px] sm:h-[18px] object-contain"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
