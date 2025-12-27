'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { error } = await signIn(email, password);
            if (error) {
                if (error.message.includes('Invalid login')) {
                    setError('Invalid email or password. Please contact admin if you need access.');
                } else {
                    setError(error.message);
                }
            } else {
                router.push(redirectTo);
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                <Car className="h-10 w-10 text-amber-500" />
                <span className="text-3xl font-bold text-white">
                    LUXE<span className="text-amber-500">AUTO</span>
                </span>
            </Link>

            {/* Card */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-white text-center mb-2">
                    Staff Portal
                </h1>
                <p className="text-white/50 text-center mb-8">
                    Login with your staff credentials
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-white/60 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                placeholder="your.email@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500" />
                            <span className="text-sm text-white/60">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-white/40 text-sm">
                    Staff accounts are created by administrators.
                    <br />
                    Contact your manager for access.
                </p>
            </div>

            <p className="text-center text-white/40 text-sm mt-6">
                Not a staff member?{' '}
                <Link href="/" className="text-amber-500 hover:text-amber-400">
                    Go to homepage
                </Link>
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <Suspense fallback={
                <div className="w-full max-w-md bg-zinc-900 border border-white/5 rounded-2xl p-8 animate-pulse">
                    <div className="h-8 bg-zinc-800 rounded w-1/3 mx-auto mb-8" />
                    <div className="h-64 bg-zinc-800 rounded mb-4" />
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
