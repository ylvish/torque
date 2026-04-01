'use client';

import { useState, useEffect } from 'react';
import { getContactMessages, updateContactMessageStatus } from '@/lib/actions';
import { ContactMessage, MessageStatus } from '@/types';
import { Mail, Phone, Clock, Loader2, CheckCircle2, MessageSquare, Archive, CircleDot } from 'lucide-react';

export default function MessagesDashboard() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | MessageStatus>('ALL');
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    async function loadMessages() {
        setLoading(true);
        const data = await getContactMessages();
        setMessages(data as ContactMessage[]);
        setLoading(false);
    }

    async function handleStatusUpdate(id: string, newStatus: MessageStatus) {
        setIsUpdating(id);
        const res = await updateContactMessageStatus(id, newStatus);
        if (res.success) {
            setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
        }
        setIsUpdating(null);
    }

    const filteredMessages = messages.filter(m => filter === 'ALL' || m.status === filter);

    const getStatusIcon = (status: MessageStatus) => {
        switch(status) {
            case MessageStatus.NEW: return <CircleDot className="h-4 w-4 text-blue-500" />;
            case MessageStatus.READ: return <CheckCircle2 className="h-4 w-4 text-yellow-500" />;
            case MessageStatus.REPLIED: return <MessageSquare className="h-4 w-4 text-emerald-500" />;
            case MessageStatus.ARCHIVED: return <Archive className="h-4 w-4 text-zinc-500" />;
        }
    };

    const getStatusLabel = (status: MessageStatus) => {
        switch(status) {
            case MessageStatus.NEW: return <span className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md text-xs font-bold">NEW</span>;
            case MessageStatus.READ: return <span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-xs font-bold">READ</span>;
            case MessageStatus.REPLIED: return <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md text-xs font-bold">REPLIED</span>;
            case MessageStatus.ARCHIVED: return <span className="text-zinc-500 bg-zinc-500/10 px-2 py-1 rounded-md text-xs font-bold">ARCHIVED</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Contact Messages</h1>
                    <p className="text-zinc-400">Manage general inquiries and contact requests.</p>
                </div>
            </div>

            <div className="flex gap-2 pb-4 overflow-x-auto">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-red-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                    All Messages
                </button>
                {Object.values(MessageStatus).map(status => (
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
            ) : filteredMessages.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <Mail className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No messages found</h3>
                    <p className="text-zinc-400">There are no contact messages matching your filter.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.map((msg) => (
                        <div key={msg.id} className={`bg-zinc-900 border rounded-xl p-6 transition-colors ${msg.status === MessageStatus.NEW ? 'border-blue-500/30 bg-blue-500/5' : 'border-zinc-800'}`}>
                            <div className="flex flex-col md:flex-row gap-6 justify-between">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                                        {getStatusLabel(msg.status)}
                                        <span className="text-xs font-semibold text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md uppercase">
                                            {msg.interest.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-zinc-400 bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-zinc-500" />
                                            <a href={`tel:${msg.phone}`} className="hover:text-white">{msg.phone}</a>
                                        </div>
                                        {msg.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-zinc-500" />
                                                <a href={`mailto:${msg.email}`} className="hover:text-white">{msg.email}</a>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 sm:ml-auto">
                                            <Clock className="h-4 w-4 text-zinc-500" />
                                            {new Date(msg.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    {msg.message && (
                                        <div className="text-zinc-300 bg-zinc-950 rounded-lg p-4 border border-zinc-800/50">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col gap-2 min-w-[140px] border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 justify-center md:justify-start">
                                    <select 
                                        value={msg.status}
                                        onChange={(e) => handleStatusUpdate(msg.id, e.target.value as MessageStatus)}
                                        disabled={isUpdating === msg.id}
                                        className="bg-black border border-zinc-700 text-white text-sm rounded-lg p-2.5 w-full appearance-none disabled:opacity-50"
                                    >
                                        <option value={MessageStatus.NEW}>Mark New</option>
                                        <option value={MessageStatus.READ}>Mark Read</option>
                                        <option value={MessageStatus.REPLIED}>Mark Replied</option>
                                        <option value={MessageStatus.ARCHIVED}>Archive</option>
                                    </select>
                                    <a 
                                        href={`https://wa.me/${msg.phone.replace(/\D/g, '')}`} 
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
