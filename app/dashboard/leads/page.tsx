'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Phone,
    Mail,
    MessageCircle,
    User,
    Clock,
    CheckCircle2,
    Calendar,
    Car,
    ChevronDown
} from 'lucide-react';
import { LeadStatus, LeadInterest } from '@/types';
import LeadDetailsModal from '@/components/LeadDetailsModal';

import { getLeads, updateLeadStatus, assignLead, getEmployees } from '@/lib/actions';

// Initial empty state
const initialLeads: any[] = [];

const statusConfig = {
    [LeadStatus.NEW]: { label: 'New', class: 'bg-amber-500/10 text-amber-400' },
    [LeadStatus.CONTACTED]: { label: 'Contacted', class: 'bg-blue-500/10 text-blue-400' },
    [LeadStatus.QUALIFIED]: { label: 'Qualified', class: 'bg-purple-500/10 text-purple-400' },
    [LeadStatus.NEGOTIATING]: { label: 'Negotiating', class: 'bg-cyan-500/10 text-cyan-400' },
    [LeadStatus.CONVERTED]: { label: 'Won', class: 'bg-emerald-500/10 text-emerald-400' },
    [LeadStatus.LOST]: { label: 'Lost', class: 'bg-red-500/10 text-red-400' },
};

const interestConfig = {
    [LeadInterest.TEST_DRIVE]: { label: 'Test Drive', class: 'bg-purple-500/10 text-purple-400' },
    [LeadInterest.PRICE_INFO]: { label: 'Best Price', class: 'bg-emerald-500/10 text-emerald-400' },
    [LeadInterest.FINANCE_INFO]: { label: 'Finance', class: 'bg-blue-500/10 text-blue-400' },
    [LeadInterest.GENERAL]: { label: 'General', class: 'bg-zinc-500/10 text-zinc-400' },
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>(initialLeads);
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
    const [selectedLead, setSelectedLead] = useState<any | null>(null);

    useEffect(() => {
        fetchLeads();
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const data = await getEmployees();
        setEmployees(data);
    };

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const data = await getLeads();
            setLeads(data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLeads = leads.filter((lead) => {
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

        // Handle car data which comes from 'listings' relation
        const car = lead.listings || {};
        const carMake = car.make || '';
        const carModel = car.model || '';

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                lead.buyer_name.toLowerCase().includes(query) ||
                carMake.toLowerCase().includes(query) ||
                carModel.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (hours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} L`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Leads</h1>
                <p className="text-white/50">Manage buyer inquiries and follow-ups</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by buyer name or car..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {[
                        { value: 'all', label: 'All' },
                        { value: LeadStatus.NEW, label: 'New' },
                        { value: LeadStatus.CONTACTED, label: 'Contacted' },
                        { value: LeadStatus.QUALIFIED, label: 'Qualified' },
                        { value: LeadStatus.NEGOTIATING, label: 'Negotiating' },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value as typeof statusFilter)}
                            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${statusFilter === filter.value
                                ? 'bg-amber-500 text-black'
                                : 'bg-zinc-900 text-white/60 hover:text-white'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-zinc-900 border border-white/5 rounded-xl animate-pulse" />
                    ))
                ) : filteredLeads.map((lead) => {
                    const status = statusConfig[lead.status as LeadStatus] || statusConfig[LeadStatus.NEW];
                    const interest = interestConfig[lead.interest as LeadInterest] || interestConfig[LeadInterest.GENERAL];

                    return (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className="bg-zinc-900 border border-white/5 rounded-xl p-4 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Buyer Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-amber-500">
                                                {lead.buyer_name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{lead.buyer_name}</h3>
                                            <p className="text-sm text-white/50">{lead.buyer_email}</p>
                                        </div>
                                        <span className={`ml-auto lg:hidden px-2 py-0.5 text-xs font-medium rounded-full ${status.class}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Car Info */}
                                    <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                                        <Car className="h-4 w-4" />
                                        <span>
                                            {lead.listings?.year} {lead.listings?.make} {lead.listings?.model} · {lead.listings?.price ? formatPrice(lead.listings.price) : 'N/A'}
                                        </span>
                                    </div>

                                    {/* Message */}
                                    {lead.message && (
                                        <p className="text-sm text-white/50 italic">&quot;{lead.message}&quot;</p>
                                    )}
                                </div>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${interest.class}`}>
                                        {interest.label}
                                    </span>
                                    <span className={`hidden lg:inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${status.class}`}>
                                        {status.label}
                                    </span>

                                    {/* Assigned To */}
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-sm text-white/70 px-2 bg-white/5 py-1 rounded-md border border-white/10">
                                            {lead.assigned_user?.name || 'Unassigned'}
                                        </span>
                                    </div>

                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDate(lead.created_at)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <a
                                        href={`tel:${lead.buyer_phone}`}
                                        className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                                        title="Call"
                                    >
                                        <Phone className="h-4 w-4" />
                                    </a>
                                    <a
                                        href={`mailto:${lead.buyer_email}`}
                                        className="p-2.5 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                                        title="Email"
                                    >
                                        <Mail className="h-4 w-4" />
                                    </a>
                                    <a
                                        href={`https://wa.me/${lead.buyer_phone.replace(/\s/g, '')}`}
                                        target="_blank"
                                        className="p-2.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                        title="WhatsApp"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isLoading && filteredLeads.length === 0 && (
                <div className="text-center py-16 bg-zinc-900 border border-white/5 rounded-xl">
                    <User className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50">No leads found</p>
                </div>
            )}

            <LeadDetailsModal
                lead={selectedLead}
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                onUpdate={fetchLeads}
                employees={employees}
            />
        </div>
    );
}
