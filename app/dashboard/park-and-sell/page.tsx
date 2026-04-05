'use client';

import { useState, useEffect } from 'react';
import { getParkAndSellEnquiries, updateParkAndSellStatus } from '@/lib/actions';
import { ParkAndSellEnquiry, ParkSellStatus } from '@/types';
import { Car, Phone, Clock, Loader2, CheckCircle2, MessageSquare, Archive, CircleDot, IndianRupee } from 'lucide-react';

export default function ParkAndSellDashboard() {
    const [enquiries, setEnquiries] = useState<ParkAndSellEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | ParkSellStatus>('ALL');
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadEnquiries();
    }, []);

    async function loadEnquiries() {
        setLoading(true);
        const data = await getParkAndSellEnquiries();
        setEnquiries(data as ParkAndSellEnquiry[]);
        setLoading(false);
    }

    async function handleStatusUpdate(id: string, newStatus: ParkSellStatus) {
        setIsUpdating(id);
        const res = await updateParkAndSellStatus(id, newStatus);
        if (res.success) {
            setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
        }
        setIsUpdating(null);
    }

    const filteredEnquiries = enquiries.filter(e => filter === 'ALL' || e.status === filter);

    const getStatusIcon = (status: ParkSellStatus) => {
        switch(status) {
            case ParkSellStatus.NEW: return <CircleDot className="h-4 w-4 text-blue-500" />;
            case ParkSellStatus.CONTACTED: return <MessageSquare className="h-4 w-4 text-yellow-500" />;
            case ParkSellStatus.INSPECTED: return <CheckCircle2 className="h-4 w-4 text-orange-500" />;
            case ParkSellStatus.LISTED: return <Car className="h-4 w-4 text-emerald-500" />;
            case ParkSellStatus.REJECTED: return <Archive className="h-4 w-4 text-zinc-500" />;
        }
    };

    const getStatusLabel = (status: ParkSellStatus) => {
        switch(status) {
            case ParkSellStatus.NEW: return <span className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md text-xs font-bold">NEW</span>;
            case ParkSellStatus.CONTACTED: return <span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-xs font-bold">CONTACTED</span>;
            case ParkSellStatus.INSPECTED: return <span className="text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md text-xs font-bold">INSPECTED</span>;
            case ParkSellStatus.LISTED: return <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md text-xs font-bold">LISTED</span>;
            case ParkSellStatus.REJECTED: return <span className="text-zinc-500 bg-zinc-500/10 px-2 py-1 rounded-md text-xs font-bold">REJECTED</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Park & Sell Leads</h1>
                    <p className="text-zinc-400">Manage enquiries from the Park & Sell exclusive service.</p>
                </div>
            </div>

            <div className="flex gap-2 pb-4 overflow-x-auto">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-red-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                    All Leads
                </button>
                {Object.values(ParkSellStatus).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${filter === status ? 'bg-red-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'}`}
                    >
                        {getStatusIcon(status)}
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                </div>
            ) : filteredEnquiries.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <Car className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No park & sell leads found</h3>
                    <p className="text-zinc-400">There are no leads matching your filter.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredEnquiries.map((enq) => (
                        <div key={enq.id} className={`bg-zinc-900 border rounded-xl p-6 transition-colors ${enq.status === ParkSellStatus.NEW ? 'border-red-500/30 bg-red-500/5' : 'border-zinc-800'}`}>
                            <div className="flex flex-col md:flex-row gap-6 justify-between">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white">{enq.seller_name}</h3>
                                        {getStatusLabel(enq.status)}
                                        <span className="text-xs font-semibold text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md uppercase">
                                            {enq.make} {enq.model}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-zinc-400 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-zinc-500" />
                                            <a href={`tel:${enq.seller_phone}`} className="hover:text-white">{enq.seller_phone}</a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4 text-zinc-500" />
                                            <span>{enq.mileage}</span>
                                        </div>
                                        {enq.expected_price && (
                                            <div className="flex items-center gap-2">
                                                <IndianRupee className="h-4 w-4 text-zinc-500" />
                                                <span>{enq.expected_price}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 lg:ml-auto">
                                            <Clock className="h-4 w-4 text-zinc-500" />
                                            {new Date(enq.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {enq.additional_notes && (
                                        <div className="text-zinc-300 bg-zinc-950 rounded-lg p-4 border border-zinc-800/50">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{enq.additional_notes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col gap-2 min-w-[140px] border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 justify-center md:justify-start">
                                    <select 
                                        value={enq.status}
                                        onChange={(e) => handleStatusUpdate(enq.id, e.target.value as ParkSellStatus)}
                                        disabled={isUpdating === enq.id}
                                        className="bg-black border border-zinc-700 text-white text-sm rounded-lg p-2.5 w-full appearance-none disabled:opacity-50"
                                    >
                                        <option value={ParkSellStatus.NEW}>Mark New</option>
                                        <option value={ParkSellStatus.CONTACTED}>Mark Contacted</option>
                                        <option value={ParkSellStatus.INSPECTED}>Mark Inspected</option>
                                        <option value={ParkSellStatus.LISTED}>Mark Listed</option>
                                        <option value={ParkSellStatus.REJECTED}>Reject / Archive</option>
                                    </select>
                                    <a 
                                        href={`https://wa.me/${enq.seller_phone.replace(/\D/g, '')}`} 
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
