'use client';

import { X, Phone, Mail, MessageCircle, User, Car, Calendar, Clock, MapPin, Tag, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/types';

import Link from 'next/link';
import { useState } from 'react';
import { updateLeadStatus, deleteLead, assignLead } from '@/lib/actions';

interface LeadDetailsModalProps {
    lead: any | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void; // Callback to refresh parent list
    employees?: any[]; // List of employees for assignment
}

export default function LeadDetailsModal({ lead, isOpen, onClose, onUpdate, employees = [] }: LeadDetailsModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen || !lead) return null;

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await updateLeadStatus(lead.id, newStatus as any);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        setIsUpdating(true);
        try {
            await deleteLead(lead.id);
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error('Error deleting lead:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAssignmentChange = async (staffId: string) => {
        setIsUpdating(true);
        try {
            await assignLead(lead.id, staffId === '' ? null : staffId);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error assigning lead:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const car = lead.listings || {};

    const formatPrice = (price: number) => {
        if (!price) return 'N/A';
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} L`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xl">
                                {lead.buyer_name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{lead.buyer_name}</h2>
                                <div className="mt-1">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={isUpdating}
                                        className="bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="NEW">New</option>
                                        <option value="QUALIFIED">Qualified</option>
                                        <option value="CONTACTED">Contacted</option>
                                        <option value="NEGOTIATING">Negotiating</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href={`tel:${lead.buyer_phone}`}
                                className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors group"
                            >
                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:bg-emerald-500/30">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-white/40 mb-0.5">Phone</p>
                                    <p className="text-white font-medium">{lead.buyer_phone}</p>
                                </div>
                            </a>
                            <a
                                href={`mailto:${lead.buyer_email}`}
                                className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors group"
                            >
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-white/40 mb-0.5">Email</p>
                                    <p className="text-white font-medium break-all whitespace-normal">{lead.buyer_email}</p>
                                </div>
                            </a>
                            <div className="hidden"></div>
                            {/* WhatsApp Removed as per request */}
                        </div>

                        {/* Interested Car */}
                        <div>
                            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Car className="w-4 h-4" /> Interested Vehicle
                            </h3>
                            <Link href={`/cars/${car.id}`} target="_blank" className="block group">
                                <div className="flex gap-4 p-4 bg-zinc-800/50 rounded-xl border border-white/5 group-hover:border-amber-500/50 transition-colors">
                                    {car.featured_image_url && (
                                        <img
                                            src={car.featured_image_url}
                                            alt={`${car.make} ${car.model}`}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
                                            {car.year} {car.make} {car.model}
                                        </h4>
                                        <p className="text-amber-500 font-medium mb-3">
                                            {formatPrice(car.price)}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs text-white/50">
                                            <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">{car.variant}</span>
                                            <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">{car.fuel_type}</span>
                                            <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">{car.transmission}</span>
                                            <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">{car.registration_city}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Message & Interest */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> Inquiry Message
                                </h3>
                                <div className="p-4 bg-zinc-800/30 rounded-xl border border-white/5 text-white/80 italic">
                                    &quot;{lead.message || 'No message provided.'}&quot;
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Tag className="w-4 h-4" /> Interest Type
                                    </h3>
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-sm font-medium border border-amber-500/20">
                                        {lead.interest}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Assigned To
                                    </h3>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <div className="flex-1">
                                            <select
                                                value={lead.assigned_to || ''}
                                                onChange={(e) => handleAssignmentChange(e.target.value)}
                                                disabled={isUpdating}
                                                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                            >
                                                <option value="">Unassigned</option>
                                                {employees.map((emp) => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Received At
                                    </h3>
                                    <p className="text-white/60 text-sm">{formatDate(lead.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-white/5 flex justify-between gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={isUpdating}
                            className="px-6 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium border border-transparent hover:border-red-500/20"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
