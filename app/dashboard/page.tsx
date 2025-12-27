'use client';

import Link from 'next/link';
import {
    FileText,
    List,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const stats = [
    {
        label: 'Pending Submissions',
        value: 12,
        change: '+3 today',
        trend: 'up',
        icon: FileText,
        href: '/dashboard/submissions',
        color: 'amber'
    },
    {
        label: 'Active Listings',
        value: 48,
        change: '+5 this week',
        trend: 'up',
        icon: List,
        href: '/dashboard/listings',
        color: 'emerald'
    },
    {
        label: 'New Leads',
        value: 23,
        change: '+8 today',
        trend: 'up',
        icon: Users,
        href: '/dashboard/leads',
        color: 'blue'
    },
    {
        label: 'Conversion Rate',
        value: '18%',
        change: '-2% this month',
        trend: 'down',
        icon: TrendingUp,
        href: '/dashboard/analytics',
        color: 'purple'
    },
];

const recentSubmissions = [
    { id: 'SUB-12345678', car: '2022 BMW 3 Series', seller: 'Rahul Kumar', time: '10 mins ago', status: 'pending' },
    { id: 'SUB-12345679', car: '2021 Hyundai Creta', seller: 'Priya Singh', time: '25 mins ago', status: 'pending' },
    { id: 'SUB-12345680', car: '2023 Maruti Swift', seller: 'Amit Patel', time: '1 hour ago', status: 'approved' },
    { id: 'SUB-12345681', car: '2020 Toyota Fortuner', seller: 'Sneha Sharma', time: '2 hours ago', status: 'pending' },
];

const recentLeads = [
    { name: 'Vikram Mehta', car: 'BMW 3 Series 330i', interest: 'Test Drive', time: '5 mins ago' },
    { name: 'Neha Gupta', car: 'Mercedes E-Class', interest: 'Finance Info', time: '15 mins ago' },
    { name: 'Rajesh Kumar', car: 'Audi A4', interest: 'Best Price', time: '30 mins ago' },
    { name: 'Anjali Verma', car: 'Hyundai Creta SX', interest: 'Test Drive', time: '1 hour ago' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-white/50">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group p-5 bg-zinc-900 border border-white/5 rounded-xl hover:border-white/10 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-lg bg-${stat.color}-500/10`}>
                                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-white/50">{stat.label}</div>
                    </Link>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Submissions */}
                <div className="bg-zinc-900 border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <h2 className="font-semibold text-white">Recent Submissions</h2>
                        <Link href="/dashboard/submissions" className="text-sm text-amber-500 hover:text-amber-400">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentSubmissions.map((submission) => (
                            <div key={submission.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-white">{submission.car}</p>
                                        <p className="text-sm text-white/50">{submission.seller}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${submission.status === 'pending'
                                                ? 'bg-amber-500/10 text-amber-400'
                                                : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {submission.status === 'pending' ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                            {submission.status}
                                        </span>
                                        <p className="text-xs text-white/40 mt-1">{submission.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="bg-zinc-900 border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <h2 className="font-semibold text-white">Recent Leads</h2>
                        <Link href="/dashboard/leads" className="text-sm text-amber-500 hover:text-amber-400">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentLeads.map((lead, index) => (
                            <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-white">{lead.name}</p>
                                        <p className="text-sm text-white/50">{lead.car}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full">
                                            {lead.interest}
                                        </span>
                                        <p className="text-xs text-white/40 mt-1">{lead.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/submissions"
                        className="px-4 py-2.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-2"
                    >
                        <AlertCircle className="h-4 w-4" />
                        Review Pending ({stats[0].value})
                    </Link>
                    <Link
                        href="/dashboard/listings/new"
                        className="px-4 py-2.5 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Create New Listing
                    </Link>
                    <Link
                        href="/dashboard/leads"
                        className="px-4 py-2.5 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Manage Leads
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className="px-4 py-2.5 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        View Reports
                    </Link>
                </div>
            </div>
        </div>
    );
}
