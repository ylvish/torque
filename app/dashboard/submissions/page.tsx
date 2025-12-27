'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Pause,
    Phone,
    Mail,
    MessageCircle,
    Eye,
    X,
    User,
    Calendar,
    Fuel,
    Gauge,
    MapPin,
    FileText,
    Plus,
    Settings,
    AlertCircle,
    FileCheck,
    Car,
    Loader2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon
} from 'lucide-react';
import { SubmissionStatus, FuelType, TransmissionType, SellerSubmission } from '@/types';
import { getSubmissions, updateSubmissionStatus } from '@/lib/actions';

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
    'PENDING_REVIEW': { label: 'Pending', icon: Clock, class: 'bg-amber-500/10 text-amber-400' },
    'UNDER_EVALUATION': { label: 'Evaluating', icon: Clock, class: 'bg-blue-500/10 text-blue-400' },
    'INFO_REQUESTED': { label: 'Info Needed', icon: AlertCircle, class: 'bg-purple-500/10 text-purple-400' },
    'APPROVED': { label: 'Approved', icon: CheckCircle2, class: 'bg-emerald-500/10 text-emerald-400' },
    'ON_HOLD': { label: 'On Hold', icon: Pause, class: 'bg-orange-500/10 text-orange-400' },
    'REJECTED': { label: 'Rejected', icon: XCircle, class: 'bg-red-500/10 text-red-400' },
};

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<SellerSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<SellerSubmission | null>(null);
    const [newNote, setNewNote] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    // Fetch submissions on mount
    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const data = await getSubmissions();
            setSubmissions(data as SellerSubmission[]);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: SubmissionStatus) => {
        setIsUpdating(true);
        try {
            const result = await updateSubmissionStatus(id, newStatus);
            if (result.success) {
                // Update local state
                setSubmissions(prev => prev.map(sub =>
                    sub.id === id ? { ...sub, status: newStatus } : sub
                ));
                if (selectedSubmission?.id === id) {
                    setSelectedSubmission({ ...selectedSubmission, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredSubmissions = submissions.filter((sub) => {
        if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                sub.seller_name.toLowerCase().includes(query) ||
                sub.make.toLowerCase().includes(query) ||
                sub.model.toLowerCase().includes(query) ||
                (sub.reference_id || sub.id).toLowerCase().includes(query)
            );
        }
        return true;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPhoneForWhatsApp = (phone: string) => {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, '');
        // Add country code if not present
        return cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Seller Submissions</h1>
                    <p className="text-white/50">Review and manage car submissions from sellers</p>
                </div>
                <button
                    onClick={fetchSubmissions}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white/80 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by seller, make, model, or ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: 'all', label: 'All' },
                        { value: 'PENDING_REVIEW', label: 'Pending' },
                        { value: 'APPROVED', label: 'Approved' },
                        { value: 'ON_HOLD', label: 'On Hold' },
                        { value: 'REJECTED', label: 'Rejected' },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${statusFilter === filter.value
                                ? 'bg-amber-500 text-black'
                                : 'bg-zinc-900 text-white/60 hover:text-white'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-12 text-center">
                    <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-3" />
                    <p className="text-white/50">Loading submissions...</p>
                </div>
            ) : (
                /* Submissions List */
                <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-4 py-3 text-sm font-medium text-white/50">ID</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-white/50">Seller</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-white/50">Contact</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-white/50">Car</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-white/50">Status</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-white/50">Date</th>
                                    <th className="text-right px-4 py-3 text-sm font-medium text-white/50">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredSubmissions.map((submission) => {
                                    const status = statusConfig[submission.status] || statusConfig['PENDING_REVIEW'];
                                    return (
                                        <tr key={submission.id} className="hover:bg-white/5">
                                            <td className="px-4 py-4">
                                                <p className="font-mono text-xs text-white/60">
                                                    {submission.reference_id || submission.id.slice(0, 8)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-white">{submission.seller_name}</p>
                                                <p className="text-sm text-white/50">{submission.seller_city}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm text-white/80">{submission.seller_phone}</p>
                                                <p className="text-xs text-white/50">{submission.seller_email}</p>
                                                {submission.whatsapp_consent && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                                                        <MessageCircle className="h-3 w-3" />
                                                        WhatsApp OK
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-white">
                                                    {submission.year} {submission.make} {submission.model}
                                                </p>
                                                <p className="text-sm text-white/50">{submission.variant}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.class}`}>
                                                    <status.icon className="h-3.5 w-3.5" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm text-white/60">{formatDate(submission.created_at)}</p>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubmission(submission);
                                                        setCurrentPhotoIndex(0);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredSubmissions.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/50">No submissions found</p>
                            <p className="text-white/30 text-sm mt-1">New submissions will appear here</p>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto"
                        onClick={() => setSelectedSubmission(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full max-w-4xl my-8 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Submission Details</h2>
                                    <p className="text-sm text-white/50 font-mono">
                                        {selectedSubmission.reference_id || selectedSubmission.id}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 text-white/60 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Photo Gallery */}
                                {selectedSubmission.photos && selectedSubmission.photos.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                                            <Image
                                                src={selectedSubmission.photos[currentPhotoIndex]}
                                                alt={`Car photo ${currentPhotoIndex + 1}`}
                                                fill
                                                className="object-contain"
                                            />
                                            {selectedSubmission.photos.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => setCurrentPhotoIndex(prev =>
                                                            prev > 0 ? prev - 1 : selectedSubmission.photos.length - 1
                                                        )}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                                                    >
                                                        <ChevronLeft className="h-5 w-5 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPhotoIndex(prev =>
                                                            prev < selectedSubmission.photos.length - 1 ? prev + 1 : 0
                                                        )}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                                                    >
                                                        <ChevronRight className="h-5 w-5 text-white" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full">
                                                        <span className="text-sm text-white">
                                                            {currentPhotoIndex + 1} / {selectedSubmission.photos.length}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* Thumbnails */}
                                        {selectedSubmission.photos.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {selectedSubmission.photos.map((photo, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentPhotoIndex(index)}
                                                        className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 ${index === currentPhotoIndex ? 'ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'
                                                            }`}
                                                    >
                                                        <Image
                                                            src={photo}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video rounded-xl bg-zinc-800 flex items-center justify-center">
                                        <div className="text-center">
                                            <ImageIcon className="h-12 w-12 text-white/20 mx-auto mb-2" />
                                            <p className="text-white/40">No photos uploaded</p>
                                        </div>
                                    </div>
                                )}

                                {/* Car Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column - Car Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Car className="h-5 w-5 text-amber-500" />
                                            {selectedSubmission.year} {selectedSubmission.make} {selectedSubmission.model}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/50 mb-1">Variant</p>
                                                <p className="text-white font-medium">{selectedSubmission.variant || 'N/A'}</p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/50 mb-1">Fuel Type</p>
                                                <p className="text-white font-medium flex items-center gap-1">
                                                    <Fuel className="h-4 w-4 text-amber-500" />
                                                    {selectedSubmission.fuel_type}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/50 mb-1">Transmission</p>
                                                <p className="text-white font-medium flex items-center gap-1">
                                                    <Settings className="h-4 w-4 text-amber-500" />
                                                    {selectedSubmission.transmission}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/50 mb-1">Mileage</p>
                                                <p className="text-white font-medium flex items-center gap-1">
                                                    <Gauge className="h-4 w-4 text-amber-500" />
                                                    {selectedSubmission.mileage.toLocaleString()} km
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/50 mb-1">Owners</p>
                                                <p className="text-white font-medium flex items-center gap-1">
                                                    <User className="h-4 w-4 text-amber-500" />
                                                    {selectedSubmission.owners} Owner{selectedSubmission.owners > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/50 mb-1">Registration</p>
                                                <p className="text-white font-medium flex items-center gap-1">
                                                    <MapPin className="h-4 w-4 text-amber-500" />
                                                    {selectedSubmission.registration_city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Condition Info */}
                                        <div className="p-4 bg-white/5 rounded-xl space-y-3">
                                            <h4 className="font-medium text-white">Condition Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-white/60">Accident History</span>
                                                    <span className={selectedSubmission.accident_history ? 'text-red-400' : 'text-green-400'}>
                                                        {selectedSubmission.accident_history ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                                {selectedSubmission.service_history && (
                                                    <div className="flex justify-between">
                                                        <span className="text-white/60">Service History</span>
                                                        <span className="text-white">{selectedSubmission.service_history}</span>
                                                    </div>
                                                )}
                                                {selectedSubmission.insurance_status && (
                                                    <div className="flex justify-between">
                                                        <span className="text-white/60">Insurance</span>
                                                        <span className="text-white">{selectedSubmission.insurance_status}</span>
                                                    </div>
                                                )}
                                                {selectedSubmission.selling_reason && (
                                                    <div>
                                                        <span className="text-white/60 block mb-1">Reason for Selling</span>
                                                        <span className="text-white">{selectedSubmission.selling_reason}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Seller Info */}
                                    <div className="space-y-4">
                                        {/* Seller Contact */}
                                        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl">
                                            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                                                <User className="h-5 w-5 text-amber-500" />
                                                Seller Information
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xl font-semibold text-white">{selectedSubmission.seller_name}</p>
                                                    <p className="text-white/60">{selectedSubmission.seller_city}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <Phone className="h-4 w-4 text-amber-500" />
                                                        <a href={`tel:${selectedSubmission.seller_phone}`} className="text-white hover:text-amber-400">
                                                            {selectedSubmission.seller_phone}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Mail className="h-4 w-4 text-amber-500" />
                                                        <a href={`mailto:${selectedSubmission.seller_email}`} className="text-white hover:text-amber-400">
                                                            {selectedSubmission.seller_email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <MessageCircle className="h-4 w-4 text-amber-500" />
                                                        <span className={selectedSubmission.whatsapp_consent ? 'text-green-400' : 'text-white/50'}>
                                                            WhatsApp: {selectedSubmission.whatsapp_consent ? 'Allowed ✓' : 'Not preferred'}
                                                        </span>
                                                    </div>
                                                    {selectedSubmission.preferred_contact_time && (
                                                        <div className="flex items-center gap-3">
                                                            <Clock className="h-4 w-4 text-amber-500" />
                                                            <span className="text-white/80">
                                                                Preferred: {selectedSubmission.preferred_contact_time}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Quick Actions */}
                                                <div className="flex gap-2 pt-3">
                                                    <a
                                                        href={`tel:${selectedSubmission.seller_phone}`}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-colors"
                                                    >
                                                        <Phone className="h-4 w-4" />
                                                        Call
                                                    </a>
                                                    <a
                                                        href={`mailto:${selectedSubmission.seller_email}`}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                        Email
                                                    </a>
                                                    {selectedSubmission.whatsapp_consent && (
                                                        <a
                                                            href={`https://wa.me/${formatPhoneForWhatsApp(selectedSubmission.seller_phone)}`}
                                                            target="_blank"
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                            WhatsApp
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        {selectedSubmission.documents && selectedSubmission.documents.length > 0 && (
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                                    <FileCheck className="h-5 w-5 text-amber-500" />
                                                    Documents ({selectedSubmission.documents.length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {selectedSubmission.documents.map((doc, index) => (
                                                        <a
                                                            key={index}
                                                            href={doc}
                                                            target="_blank"
                                                            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                                        >
                                                            <FileText className="h-4 w-4 text-amber-500" />
                                                            <span className="text-white/80 text-sm">Document {index + 1}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Staff Notes */}
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h4 className="font-medium text-white mb-3">Staff Notes</h4>
                                            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                                                {selectedSubmission.staff_notes && selectedSubmission.staff_notes.length > 0 ? (
                                                    selectedSubmission.staff_notes.map((note, index) => (
                                                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                                                            <p className="text-white/80 text-sm">{note.content}</p>
                                                            <p className="text-xs text-white/40 mt-1">{formatDate(note.created_at)}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-white/40 text-sm">No notes yet</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Add a note..."
                                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                                />
                                                <button
                                                    onClick={() => {/* TODO: Add note */ }}
                                                    className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedSubmission.id, SubmissionStatus.APPROVED)}
                                        disabled={isUpdating || selectedSubmission.status === SubmissionStatus.APPROVED}
                                        className="flex-1 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle2 className="h-5 w-5 inline mr-2" />
                                        Approve & Create Listing
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedSubmission.id, SubmissionStatus.ON_HOLD)}
                                        disabled={isUpdating}
                                        className="px-6 py-3 bg-amber-500/20 text-amber-400 font-medium rounded-xl hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                                    >
                                        Put On Hold
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedSubmission.id, SubmissionStatus.REJECTED)}
                                        disabled={isUpdating}
                                        className="px-6 py-3 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
