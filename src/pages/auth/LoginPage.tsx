import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch (err) {
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

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute right-[-250px] sm:right-[-200px] top-[-150px] sm:top-[-100px] w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] pointer-events-none opacity-50 sm:opacity-60">
                <div 
                    className="w-full h-full rounded-full"
                    style={{ 
                        background: 'radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, rgba(255, 69, 0, 0.2) 40%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
            </div>
            <div className="absolute left-[-250px] sm:left-[-200px] bottom-[-150px] sm:bottom-[-100px] w-[350px] sm:w-[450px] lg:w-[500px] h-[350px] sm:h-[450px] lg:h-[500px] pointer-events-none opacity-50 sm:opacity-60">
                <div 
                    className="w-full h-full rounded-full"
                    style={{ 
                        background: 'radial-gradient(circle, rgba(0, 191, 255, 0.4) 0%, rgba(30, 144, 255, 0.2) 40%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
            </div>

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20">
                <div className="w-full max-w-[90%] sm:max-w-[420px] lg:max-w-[440px] space-y-4 sm:space-y-5">
                    {/* Header */}
                    <h1 className="text-white text-center text-[22px] sm:text-[26px] lg:text-[28px] font-semibold tracking-tight leading-tight px-2">
                        Login To Your Existing Account
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[18px] sm:rounded-[20px] text-xs sm:text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-white/50 text-[13px] sm:text-[14px] font-normal">
                                Enter Mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex. dhruvpaleja10@hotmail.com"
                                required
                                className="w-full h-[48px] sm:h-[52px] px-4 sm:px-5 bg-[#080808] border border-white/10 rounded-[18px] sm:rounded-[20px] text-white text-[13px] sm:text-[14px] placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
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
                                    className="text-white text-[9px] sm:text-[10px] hover:text-white/80 transition-colors"
                                >
                                    Forgot Password
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ex. dhruvpaleja23314@"
                                required
                                className="w-full h-[48px] sm:h-[52px] px-4 sm:px-5 bg-[#080808] border border-white/10 rounded-[18px] sm:rounded-[20px] text-white text-[13px] sm:text-[14px] placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[48px] sm:h-[52px] mt-4 sm:mt-5 bg-white border border-black rounded-[18px] sm:rounded-[20px] text-black text-[14px] sm:text-[15px] font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    {/* Create Account Link */}
                    <div className="text-center text-[12px] sm:text-[13px] pt-0.5 sm:pt-1">
                        <span className="text-white/50">I Don't Have An Account </span>
                        <Link 
                            to="/signup" 
                            className="text-white underline hover:text-white/80 transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-2.5 sm:space-y-3 pt-1.5 sm:pt-2">
                        <p className="text-white text-[13px] sm:text-[14px] font-semibold text-center">
                            Login Using
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            {/* Google Login */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] bg-white rounded-[18px] sm:rounded-[20px] flex items-center justify-center hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
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
                                className="w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] bg-white rounded-[18px] sm:rounded-[20px] flex items-center justify-center hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
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
