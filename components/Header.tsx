'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/browse' },
    { name: 'Sell Your Car', href: '/sell' },
    { name: 'Service Center', href: '/service' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

export default function Header() {
    const pathname = usePathname();
    const { user, profile, isStaff, signOut, isLoading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Don't show header on dashboard pages (they have their own layout)
    if (pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center h-10">
                        {/* 
                          We replaced the icon with the actual torque logo image. 
                          The user must ensure the logo file is uploaded to the Next.js `public` directory as `logo.png`.
                        */}
                        <img
                            src="/logo.png"
                            alt="The Torque"
                            className="h-full object-contain"
                            onError={(e) => {
                                // Fallback if image not found during dev
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('fallback-text');
                            }}
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-white/80 hover:text-red-500 transition-colors duration-200 relative group py-2"
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden lg:flex lg:items-center lg:gap-4">
                    {isLoading ? (
                        <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <span className="text-sm font-medium text-red-400">
                                        {profile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <span className="hidden xl:inline">{profile?.name || 'Account'}</span>
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        {isStaff && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                                            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                        >
                            <User className="h-4 w-4" />
                            Sign In
                        </Link>
                    )}
                    <Link
                        href="/sell"
                        className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-600/25 hover:bg-red-700"
                    >
                        <span className="relative z-10">Sell Your Car</span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="lg:hidden p-2 text-white/80 hover:text-white"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-900 px-6 py-6">
                            <div className="flex items-center justify-between mb-8">
                                <Link href="/" className="flex items-center gap-2 h-8" onClick={() => setMobileMenuOpen(false)}>
                                    <img src="/logo.png" alt="The Torque" className="h-full object-contain" />
                                </Link>
                                <button
                                    type="button"
                                    className="p-2 text-white/80 hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block py-3 px-4 text-lg font-medium text-white/80 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {isStaff && (
                                    <Link
                                        href="/dashboard"
                                        className="block py-3 px-4 text-lg font-medium text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <span className="text-lg font-medium text-red-400">
                                                    {profile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{profile?.name || 'User'}</p>
                                                <p className="text-sm text-white/50">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                            className="flex items-center justify-center gap-2 w-full py-3 text-red-400 border border-red-500/30 rounded-full"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center justify-center gap-2 w-full py-3 text-white/80 hover:text-white border border-white/20 rounded-full transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Sign In
                                    </Link>
                                )}
                                <Link
                                    href="/sell"
                                    className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sell Your Car
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
