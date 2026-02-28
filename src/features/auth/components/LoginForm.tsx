import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// We share this mental model with the backend validator
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setServerError(null);
        const success = await login(data.email, data.password);
        if (success) {
            // For MVP, route to dashboard or landing if dashboard not complete yet
            navigate('/dashboard');
        } else {
            setServerError('Invalid email or password. Please try again.');
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
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
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
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-black hover:bg-zinc-800 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center h-11"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
    );
}
