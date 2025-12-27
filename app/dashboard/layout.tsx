'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car,
    LayoutDashboard,
    FileText,
    List,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    UserCog
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const baseLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Submissions', href: '/dashboard/submissions', icon: FileText },
    { name: 'Listings', href: '/dashboard/listings', icon: List },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user: authUser, profile, signOut, isCEO } = useAuth();

    const user = {
        name: profile?.name || authUser?.email || 'User',
        email: profile?.email || authUser?.email || '',
        role: profile?.role || 'Guest',
    };

    const sidebarLinks = [
        ...baseLinks,
        ...(isCEO ? [{ name: 'Employees', href: '/dashboard/employees', icon: UserCog }] : [])
    ];

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900 border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Car className="h-7 w-7 text-amber-500" />
                        <span className="text-xl font-bold text-white">
                            LUXE<span className="text-amber-500">AUTO</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-white/60 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href ||
                            (link.href !== '/dashboard' && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-500">
                                {user.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white max-w-[120px] truncate">{user.name}</p>
                            <p className="text-xs text-white/50">{user.role}</p>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {userMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-800 border border-white/10 rounded-lg shadow-xl overflow-hidden"
                            >
                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-white/60 hover:text-white"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-white/60 hover:text-white">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                        </button>

                        {/* User Avatar (Desktop) */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <span className="text-sm font-medium text-amber-500">
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                            <span className="text-sm text-white/80">{user.name}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
