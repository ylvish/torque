'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle2,
    Fuel,
    Gauge,
    Calendar,
    MapPin,
    Users,
    Settings,
    Shield,
    Phone,
    MessageCircle,
    Heart,
    Share2,
    Car,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Listing, FuelType, TransmissionType, ListingStatus, LeadInterest } from '@/types';
import { getListingById, createLead } from '@/lib/actions';

// Mock data removed

const fuelTypeLabels: Record<FuelType, string> = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    CNG: 'CNG',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
};

const transmissionLabels: Record<TransmissionType, string> = {
    MANUAL: 'Manual',
    AUTOMATIC: 'Automatic',
};

export default function CarDetailPage() {
    const params = useParams();
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [selectedInterest, setSelectedInterest] = useState<LeadInterest>(LeadInterest.GENERAL);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [leadError, setLeadError] = useState('');

    // Form state
    const [leadName, setLeadName] = useState('');
    const [leadEmail, setLeadEmail] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [leadMessage, setLeadMessage] = useState('');

    useEffect(() => {
        async function fetchListing() {
            if (!params.id) return;
            setIsLoading(true);
            try {
                const data = await getListingById(params.id as string);
                setListing(data as Listing);
            } catch (error) {
                console.error('Error fetching listing:', error);
                setListing(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchListing();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <Car className="h-12 w-12 text-amber-500 mb-4" />
                    <p className="text-white/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center text-center px-4">
                <div className="flex flex-col items-center">
                    <AlertCircle className="h-16 w-16 text-amber-500 mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-2">Car Not Found</h1>
                    <p className="text-white/60 mb-8 max-w-md">
                        The car you are looking for might have been sold or removed from our listings.
                    </p>
                    <Link
                        href="/browse"
                        className="px-8 py-3 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-colors"
                    >
                        Browse Other Cars
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lakh`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const images = listing.gallery_images.length > 0 ? listing.gallery_images : [listing.featured_image_url];

    const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLeadError('');

        try {
            const result = await createLead(listing.id, {
                buyer_name: leadName,
                buyer_email: leadEmail,
                buyer_phone: leadPhone,
                message: leadMessage || undefined,
                interest: selectedInterest,
            });

            if (result.success) {
                setSubmitted(true);
            } else {
                setLeadError(result.error || 'Failed to submit. Please try again.');
            }
        } catch (error) {
            setLeadError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const specs = [
        { icon: Calendar, label: 'Year', value: listing.year.toString() },
        { icon: Gauge, label: 'Mileage', value: `${(listing.mileage / 1000).toFixed(0)}k km` },
        { icon: Fuel, label: 'Fuel', value: fuelTypeLabels[listing.fuel_type] },
        { icon: Settings, label: 'Transmission', value: transmissionLabels[listing.transmission] },
        { icon: Users, label: 'Owners', value: `${listing.owners} Owner${listing.owners > 1 ? 's' : ''}` },
        { icon: MapPin, label: 'Location', value: listing.registration_city },
    ];

    return (
        <div className="min-h-screen pt-20 pb-24">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-white/50">
                    <Link href="/" className="hover:text-white">Home</Link>
                    <span>/</span>
                    <Link href="/browse" className="hover:text-white">Browse</Link>
                    <span>/</span>
                    <span className="text-white">{listing.make} {listing.model}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="relative">
                            <div
                                className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group"
                                onClick={() => setShowGallery(true)}
                            >
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={`${listing.make} ${listing.model}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                                        Click to view gallery
                                    </span>
                                </div>

                                {/* Verified Badge */}
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm rounded-full">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                    <span className="text-sm font-medium text-white">Verified</span>
                                </div>
                            </div>

                            {/* Thumbnail Strip */}
                            {images.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden ${idx === currentImageIndex ? 'ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {listing.year} {listing.make} {listing.model}
                            </h1>
                            {listing.variant && (
                                <p className="text-lg text-white/60 mb-4">{listing.variant}</p>
                            )}
                            <div className="text-3xl font-bold text-amber-500">
                                {formatPrice(listing.price)}
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                            {specs.map((spec) => (
                                <div key={spec.label} className="text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 mb-2 bg-amber-500/10 rounded-lg">
                                        <spec.icon className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div className="text-sm font-medium text-white">{spec.value}</div>
                                    <div className="text-xs text-white/50">{spec.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {listing.description && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">About This Car</h2>
                                <p className="text-white/70 leading-relaxed">{listing.description}</p>
                            </div>
                        )}

                        {/* Why We Like It */}
                        {listing.why_we_like_it && (
                            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl">
                                <h3 className="text-lg font-semibold text-amber-500 mb-3 flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Why We Like This Car
                                </h3>
                                <p className="text-white/70">{listing.why_we_like_it}</p>
                            </div>
                        )}

                        {/* Inspection Summary */}
                        {listing.inspection_summary && (
                            <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    Inspection Summary
                                </h3>
                                <p className="text-white/70">{listing.inspection_summary}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Contact Card */}
                            <div className="p-6 bg-zinc-900 border border-white/5 rounded-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4">Interested in this car?</h3>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setSelectedInterest(LeadInterest.TEST_DRIVE); setShowLeadForm(true); }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                                    >
                                        <Car className="h-5 w-5" />
                                        Schedule Test Drive
                                    </button>

                                    <button
                                        onClick={() => { setSelectedInterest(LeadInterest.PRICE_INFO); setShowLeadForm(true); }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Get Best Price
                                    </button>

                                    <button
                                        onClick={() => { setSelectedInterest(LeadInterest.FINANCE_INFO); setShowLeadForm(true); }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        Check Finance Options
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-4">
                                        <a
                                            href="tel:+919876543210"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <Phone className="h-4 w-4" />
                                            Call
                                        </a>
                                        <a
                                            href="https://wa.me/919876543210"
                                            target="_blank"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Share & Save */}
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-white/60 hover:text-white hover:border-white/10 transition-colors">
                                    <Heart className="h-5 w-5" />
                                    Save
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-white/60 hover:text-white hover:border-white/10 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {showGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    >
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <button
                            onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                            className="absolute left-4 p-2 text-white/60 hover:text-white"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </button>

                        <div className="relative w-full max-w-5xl aspect-video mx-4">
                            <Image
                                src={images[currentImageIndex]}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>

                        <button
                            onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                            className="absolute right-4 p-2 text-white/60 hover:text-white"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>

                        <div className="absolute bottom-4 text-white/60 text-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lead Form Modal */}
            <AnimatePresence>
                {showLeadForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                        onClick={() => setShowLeadForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Request Submitted!</h3>
                                    <p className="text-white/60 mb-6">Our team will contact you shortly.</p>
                                    <button
                                        onClick={() => { setShowLeadForm(false); setSubmitted(false); }}
                                        className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-full"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {selectedInterest === LeadInterest.TEST_DRIVE ? 'Schedule Test Drive' :
                                            selectedInterest === LeadInterest.PRICE_INFO ? 'Get Best Price' :
                                                selectedInterest === LeadInterest.FINANCE_INFO ? 'Check Finance Options' : 'Contact Us'}
                                    </h3>
                                    <p className="text-white/60 mb-6">
                                        Fill in your details and we&apos;ll get back to you.
                                    </p>

                                    {leadError && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-400" />
                                            <p className="text-sm text-red-400">{leadError}</p>
                                        </div>
                                    )}
                                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={leadName}
                                                onChange={(e) => setLeadName(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={leadEmail}
                                                onChange={(e) => setLeadEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Phone</label>
                                            <input
                                                type="tel"
                                                required
                                                value={leadPhone}
                                                onChange={(e) => setLeadPhone(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Message (Optional)</label>
                                            <textarea
                                                rows={3}
                                                value={leadMessage}
                                                onChange={(e) => setLeadMessage(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                                                placeholder="Any specific questions?"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : 'Submit Request'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
