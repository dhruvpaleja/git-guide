import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const signupSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

function getPasswordStrength(password: string): number {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Clamp to UI scale (0-4)
    return Math.min(4, score);
}

export default function SignupForm() {
    const { signup, isLoading } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<number>(0);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const watchPassword = useWatch({
        control,
        name: 'password',
        defaultValue: ''
    });

    // Calculate password strength on the fly
    const calculateStrength = (pwd: string) => {
        if (!pwd) {
            setPasswordStrength(0);
            return;
        }

        const score = getPasswordStrength(pwd);
        setPasswordStrength(score);
    };

    const getStrengthBarColor = () => {
        switch (passwordStrength) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-400';
            case 3: return 'bg-yellow-400';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    };

    const getStrengthLabel = () => {
        if (!watchPassword) return '';
        switch (passwordStrength) {
            case 0:
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    const onSubmit = async (data: SignupFormValues) => {
        // Re-verify strength to prevent submission hooks bypass
        const score = getPasswordStrength(data.password);
        if (score < 2) {
            setServerError('Password is too weak. Please use a stronger password.');
            return;
        }

        setServerError(null);
        const result = await signup({
            name: data.name,
            email: data.email,
            password: data.password
        });

        if (result.success) {
            navigate('/journey-preparation'); // Show loading screen before dashboard
        } else {
            setServerError(result.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {serverError}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Full Name
                </label>
                <input
                    {...register('name')}
                    id="name"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors disabled:bg-gray-100 text-zinc-900"
                    placeholder="John Doe"
                    disabled={isLoading}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address
                </label>
                <input
                    {...register('email')}
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors disabled:bg-gray-100 text-zinc-900"
                    placeholder="you@example.com"
                    disabled={isLoading}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Password
                </label>
                <input
                    {...register('password')}
                    id="password"
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors disabled:bg-gray-100 text-zinc-900"
                    placeholder="••••••••"
                    disabled={isLoading}
                    onChange={(e) => {
                        register('password').onChange(e); // Maintain hook-form state
                        calculateStrength(e.target.value);
                    }}
                />

                {/* Real-time Password Strength Meter */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-full border-r border-white/50 last:border-0 ${index < passwordStrength ? getStrengthBarColor() : 'bg-transparent'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right font-medium">
                        {getStrengthLabel()}
                    </span>
                </div>

                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors disabled:bg-gray-100 text-zinc-900"
                    placeholder="••••••••"
                    disabled={isLoading}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading || passwordStrength < 2}
                className="w-full py-2 px-4 bg-black hover:bg-zinc-800 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center h-11 mt-6"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    );
}
