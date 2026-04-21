import Link from 'next/link';
import {
    FileText,
    List,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    MessageSquare,
    ParkingSquare,
} from 'lucide-react';
import { getSubmissions, getLeads, getListings, getContactMessages, getParkAndSellEnquiries } from '@/lib/actions';
import { SubmissionStatus, LeadStatus } from '@/types';

export default async function DashboardPage() {
    const [submissions, leads, listings, messages, parkSell] = await Promise.all([
        getSubmissions(),
        getLeads(),
        getListings(),
        getContactMessages(),
        getParkAndSellEnquiries(),
    ]);

    const pendingSubmissions = submissions.filter(s => s.status === SubmissionStatus.PENDING_REVIEW);
    const activeListings = listings.filter(l => l.status === 'ACTIVE');
    const newLeads = leads.filter(l => l.status === LeadStatus.NEW);
    const convertedLeads = leads.filter(l => l.status === LeadStatus.CONVERTED);
    const conversionRate = leads.length > 0
        ? Math.round((convertedLeads.length / leads.length) * 100)
        : 0;
    const newMessages = messages.filter(m => m.status === 'NEW');
    const newParkSell = parkSell.filter(p => p.status === 'NEW');

    const stats = [
        {
            label: 'Pending Submissions',
            value: pendingSubmissions.length,
            sub: `${submissions.length} total`,
            icon: FileText,
            href: '/dashboard/submissions',
            color: 'red',
        },
        {
            label: 'Active Listings',
            value: activeListings.length,
            sub: `${listings.length} total`,
            icon: List,
            href: '/dashboard/listings',
            color: 'emerald',
        },
        {
            label: 'New Leads',
            value: newLeads.length,
            sub: `${leads.length} total`,
            icon: Users,
            href: '/dashboard/leads',
            color: 'blue',
        },
        {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            sub: `${convertedLeads.length} converted`,
            icon: TrendingUp,
            href: '/dashboard/analytics',
            color: 'purple',
        },
    ];

    const recentSubmissions = submissions.slice(0, 5);
    const recentLeads = leads.slice(0, 5);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-white/50">Live data from your dealership.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className={`group p-5 bg-zinc-900 border border-white/5 rounded-xl hover:border-white/10 transition-all`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-lg bg-${stat.color}-500/10`}>
                                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-white/50">{stat.label}</div>
                        <div className="text-xs text-white/30 mt-0.5">{stat.sub}</div>
                    </Link>
                ))}
            </div>

            {/* Inbox row */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/dashboard/messages" className="p-5 bg-zinc-900 border border-white/5 rounded-xl hover:border-white/10 transition-all flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10">
                        <MessageSquare className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{newMessages.length}</div>
                        <div className="text-sm text-white/50">Unread Messages</div>
                        <div className="text-xs text-white/30">{messages.length} total</div>
                    </div>
                </Link>
                <Link href="/dashboard/park-and-sell" className="p-5 bg-zinc-900 border border-white/5 rounded-xl hover:border-white/10 transition-all flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-indigo-500/10">
                        <ParkingSquare className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{newParkSell.length}</div>
                        <div className="text-sm text-white/50">New Park & Sell Enquiries</div>
                        <div className="text-xs text-white/30">{parkSell.length} total</div>
                    </div>
                </Link>
            </div>

            {/* Recent activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Submissions */}
                <div className="bg-zinc-900 border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <h2 className="font-semibold text-white">Recent Submissions</h2>
                        <Link href="/dashboard/submissions" className="text-sm text-red-400 hover:text-red-300">View All</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentSubmissions.length === 0 && (
                            <p className="p-4 text-sm text-white/40">No submissions yet.</p>
                        )}
                        {recentSubmissions.map((sub) => (
                            <div key={sub.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-white">{sub.year} {sub.make} {sub.model}</p>
                                        <p className="text-sm text-white/50">{sub.seller_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                                            sub.status === SubmissionStatus.PENDING_REVIEW
                                                ? 'bg-red-600/10 text-red-400'
                                                : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                            {sub.status === SubmissionStatus.PENDING_REVIEW
                                                ? <Clock className="h-3 w-3" />
                                                : <CheckCircle2 className="h-3 w-3" />}
                                            {sub.status === SubmissionStatus.PENDING_REVIEW ? 'Pending' : sub.status.replace('_', ' ')}
                                        </span>
                                        <p className="text-xs text-white/40 mt-1">{formatDate(sub.created_at)}</p>
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
                        <Link href="/dashboard/leads" className="text-sm text-red-400 hover:text-red-300">View All</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentLeads.length === 0 && (
                            <p className="p-4 text-sm text-white/40">No leads yet.</p>
                        )}
                        {recentLeads.map((lead) => (
                            <div key={lead.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-white">{lead.buyer_name}</p>
                                        <p className="text-sm text-white/50">
                                            {lead.listings
                                                ? `${(lead.listings as { year?: number; make?: string; model?: string }).year ?? ''} ${(lead.listings as { year?: number; make?: string; model?: string }).make ?? ''} ${(lead.listings as { year?: number; make?: string; model?: string }).model ?? ''}`.trim()
                                                : '—'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full">
                                            {lead.interest}
                                        </span>
                                        <p className="text-xs text-white/40 mt-1">{formatDate(lead.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
