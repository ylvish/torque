'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    X,
    Save,
    Car,
    Fuel,
    Gauge,
    Settings,
    MapPin,
    User,
    Calendar,
    IndianRupee,
    Image as ImageIcon,
    Loader2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Upload,
    AlertCircle
} from 'lucide-react';
import { ListingStatus, FuelType, TransmissionType, Listing } from '@/types';
import { getListings } from '@/lib/actions';
import { uploadMultipleFiles } from '@/lib/upload';
import { createClient } from '@/lib/supabase-browser';

const statusConfig: Record<string, { label: string; class: string }> = {
    'DRAFT': { label: 'Draft', class: 'bg-zinc-500/10 text-zinc-400' },
    'ACTIVE': { label: 'Active', class: 'bg-emerald-500/10 text-emerald-400' },
    'RESERVED': { label: 'Reserved', class: 'bg-blue-500/10 text-blue-400' },
    'SOLD': { label: 'Sold', class: 'bg-purple-500/10 text-purple-400' },
    'EXPIRED': { label: 'Expired', class: 'bg-orange-500/10 text-orange-400' },
    'ARCHIVED': { label: 'Archived', class: 'bg-red-500/10 text-red-400' },
};

const fuelTypes = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];
const transmissionTypes = ['MANUAL', 'AUTOMATIC'];

const carMakes = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Volkswagen',
    'Skoda', 'MG', 'Renault', 'Nissan', 'Jeep', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi',
    'Land Rover', 'Jaguar', 'Volvo', 'Porsche'
].sort();

const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Coimbatore', 'Patna', 'Vadodara'
].sort();

interface ListingFormData {
    make: string;
    model: string;
    year: number;
    variant: string;
    fuel_type: string;
    transmission: string;
    mileage: number;
    registration_city: string;
    owners: number;
    price: number;
    description: string;
    why_we_like_it: string;
    inspection_summary: string;
    status: string;
}

const emptyFormData: ListingFormData = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    variant: '',
    fuel_type: 'PETROL',
    transmission: 'MANUAL',
    mileage: 0,
    registration_city: '',
    owners: 1,
    price: 0,
    description: '',
    why_we_like_it: '',
    inspection_summary: '',
    status: 'DRAFT',
};

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'new'>('view');
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [formData, setFormData] = useState<ListingFormData>(emptyFormData);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    // Upload states
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const supabase = createClient();

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const data = await getListings();
            setListings(data as Listing[]);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openNewModal = () => {
        setModalMode('new');
        setFormData(emptyFormData);
        setUploadedImages([]);
        setImageFiles([]);
        setSelectedListing(null);
        setError('');
        setShowModal(true);
    };

    const openEditModal = (listing: Listing) => {
        setModalMode('edit');
        setSelectedListing(listing);
        setFormData({
            make: listing.make,
            model: listing.model,
            year: listing.year,
            variant: listing.variant || '',
            fuel_type: listing.fuel_type,
            transmission: listing.transmission,
            mileage: listing.mileage,
            registration_city: listing.registration_city,
            owners: listing.owners,
            price: listing.price,
            description: listing.description || '',
            why_we_like_it: listing.why_we_like_it || '',
            inspection_summary: listing.inspection_summary || '',
            status: listing.status,
        });
        setUploadedImages(listing.gallery_images || []);
        setImageFiles([]);
        setError('');
        setShowModal(true);
    };

    const openViewModal = (listing: Listing) => {
        setModalMode('view');
        setSelectedListing(listing);
        setCurrentPhotoIndex(0);
        setShowModal(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(prev => [...prev, ...files]);

        // Preview images
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImages(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        if (index < imageFiles.length) {
            setImageFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        setError('');
        setIsSaving(true);

        try {
            // Validate required fields
            if (!formData.make || !formData.model || !formData.price) {
                setError('Make, model, and price are required');
                setIsSaving(false);
                return;
            }

            // Upload new images if any
            let galleryUrls = uploadedImages.filter(img => img.startsWith('http'));

            if (imageFiles.length > 0) {
                setIsUploading(true);
                const newUrls = await uploadMultipleFiles(imageFiles, 'listings');
                galleryUrls = [...galleryUrls, ...newUrls];
                setIsUploading(false);
            }

            const listingData = {
                make: formData.make,
                model: formData.model,
                year: formData.year,
                variant: formData.variant || null,
                fuel_type: formData.fuel_type,
                transmission: formData.transmission,
                mileage: formData.mileage,
                registration_city: formData.registration_city,
                owners: formData.owners,
                price: formData.price,
                description: formData.description || null,
                why_we_like_it: formData.why_we_like_it || null,
                inspection_summary: formData.inspection_summary || null,
                status: formData.status,
                featured_image_url: galleryUrls[0] || null,
                gallery_images: galleryUrls,
            };

            if (modalMode === 'new') {
                // Create new listing
                const { data, error: insertError } = await supabase
                    .from('listings')
                    .insert(listingData)
                    .select()
                    .single();

                if (insertError) throw insertError;
                setListings(prev => [data as Listing, ...prev]);
            } else if (modalMode === 'edit' && selectedListing) {
                // Update existing listing
                const { data, error: updateError } = await supabase
                    .from('listings')
                    .update(listingData)
                    .eq('id', selectedListing.id)
                    .select()
                    .single();

                if (updateError) throw updateError;
                setListings(prev => prev.map(l => l.id === selectedListing.id ? data as Listing : l));
            }

            setShowModal(false);
            setFormData(emptyFormData);
            setUploadedImages([]);
            setImageFiles([]);
        } catch (err: any) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save listing');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredListings = listings.filter((listing) => {
        if (statusFilter !== 'all' && listing.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                listing.make.toLowerCase().includes(query) ||
                listing.model.toLowerCase().includes(query)
            );
        }
        return true;
    });

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Listings</h1>
                    <p className="text-white/50">Manage your car inventory</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchListings}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white/80 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={openNewModal}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        New Listing
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by make or model..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {[
                        { value: 'all', label: 'All' },
                        { value: 'ACTIVE', label: 'Active' },
                        { value: 'RESERVED', label: 'Reserved' },
                        { value: 'SOLD', label: 'Sold' },
                        { value: 'DRAFT', label: 'Draft' },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
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

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-12 text-center">
                    <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-3" />
                    <p className="text-white/50">Loading listings...</p>
                </div>
            ) : (
                /* Listings Grid */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredListings.map((listing) => {
                        const status = statusConfig[listing.status] || statusConfig['DRAFT'];
                        return (
                            <div
                                key={listing.id}
                                className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group"
                            >
                                {/* Image */}
                                <div className="relative aspect-[16/10]">
                                    {listing.featured_image_url ? (
                                        <Image
                                            src={listing.featured_image_url}
                                            alt={`${listing.make} ${listing.model}`}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <Car className="h-12 w-12 text-white/20" />
                                        </div>
                                    )}
                                    <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full ${status.class}`}>
                                        {status.label}
                                    </span>
                                    {/* Delete button */}
                                    <button
                                        onClick={() => handleDelete(listing.id)}
                                        className="absolute top-2 left-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-medium text-white mb-1">
                                        {listing.year} {listing.make} {listing.model}
                                    </h3>
                                    <p className="text-sm text-white/50 mb-3">{listing.variant}</p>
                                    <p className="text-lg font-bold text-amber-500 mb-4">{formatPrice(listing.price)}</p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                                        <span>{listing.view_count || 0} views</span>
                                        <span>{listing.lead_count || 0} leads</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openViewModal(listing)}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => openEditModal(listing)}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!isLoading && filteredListings.length === 0 && (
                <div className="text-center py-16 bg-zinc-900 border border-white/5 rounded-xl">
                    <Car className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50">No listings found</p>
                    <button
                        onClick={openNewModal}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Your First Listing
                    </button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto"
                        onClick={() => setShowModal(false)}
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
                                <h2 className="text-lg font-semibold text-white">
                                    {modalMode === 'new' ? 'New Listing' :
                                        modalMode === 'edit' ? 'Edit Listing' : 'Listing Details'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 text-white/60 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* View Mode */}
                                {modalMode === 'view' && selectedListing && (
                                    <div className="space-y-6">
                                        {/* Photo Gallery */}
                                        {selectedListing.gallery_images && selectedListing.gallery_images.length > 0 ? (
                                            <div className="space-y-2">
                                                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                                                    <Image
                                                        src={selectedListing.gallery_images[currentPhotoIndex]}
                                                        alt={`${selectedListing.make} ${selectedListing.model}`}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                    {selectedListing.gallery_images.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={() => setCurrentPhotoIndex(prev =>
                                                                    prev > 0 ? prev - 1 : selectedListing.gallery_images.length - 1
                                                                )}
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                                                            >
                                                                <ChevronLeft className="h-5 w-5 text-white" />
                                                            </button>
                                                            <button
                                                                onClick={() => setCurrentPhotoIndex(prev =>
                                                                    prev < selectedListing.gallery_images.length - 1 ? prev + 1 : 0
                                                                )}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                                                            >
                                                                <ChevronRight className="h-5 w-5 text-white" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video rounded-xl bg-zinc-800 flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-white/20" />
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">
                                                    {selectedListing.year} {selectedListing.make} {selectedListing.model}
                                                </h3>
                                                <p className="text-white/60">{selectedListing.variant}</p>
                                                <p className="text-3xl font-bold text-amber-500 mt-4">
                                                    {formatPrice(selectedListing.price)}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-white/5 rounded-lg">
                                                    <p className="text-xs text-white/50">Fuel</p>
                                                    <p className="text-white font-medium">{selectedListing.fuel_type}</p>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-lg">
                                                    <p className="text-xs text-white/50">Transmission</p>
                                                    <p className="text-white font-medium">{selectedListing.transmission}</p>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-lg">
                                                    <p className="text-xs text-white/50">Mileage</p>
                                                    <p className="text-white font-medium">{selectedListing.mileage.toLocaleString()} km</p>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-lg">
                                                    <p className="text-xs text-white/50">Owners</p>
                                                    <p className="text-white font-medium">{selectedListing.owners}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedListing.description && (
                                            <div>
                                                <h4 className="font-medium text-white mb-2">Description</h4>
                                                <p className="text-white/70">{selectedListing.description}</p>
                                            </div>
                                        )}

                                        {selectedListing.why_we_like_it && (
                                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                <h4 className="font-medium text-amber-400 mb-2">Why We Like It</h4>
                                                <p className="text-white/70">{selectedListing.why_we_like_it}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => {
                                                    openEditModal(selectedListing);
                                                }}
                                                className="flex-1 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-colors"
                                            >
                                                <Edit className="h-5 w-5 inline mr-2" />
                                                Edit Listing
                                            </button>
                                            <Link
                                                href={`/cars/${selectedListing.id}`}
                                                className="px-6 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-center"
                                            >
                                                View Public Page
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Edit/New Mode */}
                                {(modalMode === 'edit' || modalMode === 'new') && (
                                    <div className="space-y-6">
                                        {error && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                                <AlertCircle className="h-5 w-5 text-red-400" />
                                                <p className="text-red-400">{error}</p>
                                            </div>
                                        )}

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">Photos</label>
                                            <div className="grid grid-cols-4 gap-3">
                                                {uploadedImages.map((img, index) => (
                                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
                                                        <Image
                                                            src={img}
                                                            alt={`Photo ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                                                        >
                                                            <X className="h-3 w-3 text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="aspect-video rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors">
                                                    <Upload className="h-6 w-6 text-white/40 mb-1" />
                                                    <span className="text-xs text-white/40">Add Photo</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Basic Info */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Make *</label>
                                                <select
                                                    value={formData.make}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                >
                                                    <option value="" disabled>Select Make</option>
                                                    {carMakes.map(make => (
                                                        <option key={make} value={make} className="bg-zinc-900 text-white">{make}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Model *</label>
                                                <input
                                                    type="text"
                                                    value={formData.model}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                    placeholder="e.g. 3 Series"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Year</label>
                                                <input
                                                    type="number"
                                                    value={formData.year}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Variant</label>
                                                <input
                                                    type="text"
                                                    value={formData.variant}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, variant: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                    placeholder="e.g. 330i M Sport"
                                                />
                                            </div>
                                        </div>

                                        {/* Price and Specs */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Price (₹) *</label>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                    placeholder="e.g. 4500000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Mileage (km)</label>
                                                <input
                                                    type="number"
                                                    value={formData.mileage}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Fuel Type</label>
                                                <select
                                                    value={formData.fuel_type}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, fuel_type: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                >
                                                    {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Transmission</label>
                                                <select
                                                    value={formData.transmission}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                >
                                                    {transmissionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* More Details */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Owners</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={formData.owners}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, owners: parseInt(e.target.value) || 1 }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1">Registration City</label>
                                                <select
                                                    value={formData.registration_city}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, registration_city: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                >
                                                    <option value="" disabled>Select City</option>
                                                    {cities.map(city => (
                                                        <option key={city} value={city} className="bg-zinc-900 text-white">{city}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm text-white/60 mb-1">Status</label>
                                                <select
                                                    value={formData.status}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                                >
                                                    <option value="DRAFT">Draft</option>
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="RESERVED">Reserved</option>
                                                    <option value="SOLD">Sold</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Description</label>
                                            <textarea
                                                rows={3}
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                                                placeholder="Detailed description of the car..."
                                            />
                                        </div>

                                        {/* Why We Like It */}
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Why We Like It</label>
                                            <textarea
                                                rows={2}
                                                value={formData.why_we_like_it}
                                                onChange={(e) => setFormData(prev => ({ ...prev, why_we_like_it: e.target.value }))}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                                                placeholder="Highlight the best features..."
                                            />
                                        </div>

                                        {/* Inspection Summary */}
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1">Inspection Summary</label>
                                            <textarea
                                                rows={2}
                                                value={formData.inspection_summary}
                                                onChange={(e) => setFormData(prev => ({ ...prev, inspection_summary: e.target.value }))}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 resize-none"
                                                placeholder="Results of the inspection..."
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-4 border-t border-white/5">
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving || isUploading}
                                                className="flex-1 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isSaving || isUploading ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        {isUploading ? 'Uploading...' : 'Saving...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-5 w-5" />
                                                        {modalMode === 'new' ? 'Create Listing' : 'Save Changes'}
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="px-6 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
