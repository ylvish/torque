'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    User,
    Car,
    FileText,
    Camera,
    ChevronRight,
    ChevronLeft,
    Check,
    Upload,
    X,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { FuelType, TransmissionType, SellerFormData } from '@/types';
import { uploadMultipleFiles } from '@/lib/upload';
import { createSubmission } from '@/lib/actions';

const steps = [
    { id: 1, title: 'Your Details', icon: User },
    { id: 2, title: 'Car Basics', icon: Car },
    { id: 3, title: 'Condition', icon: FileText },
    { id: 4, title: 'Photos', icon: Camera },
];

const carMakes = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota',
    'Kia', 'Volkswagen', 'Skoda', 'Renault', 'Ford', 'Nissan',
    'BMW', 'Mercedes-Benz', 'Audi', 'Jaguar', 'Land Rover', 'Volvo',
    'Porsche', 'Mini', 'Jeep', 'MG', 'Citroen', 'Other'
];

const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Goa', 'Other'
];

const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

export default function SellPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [submitted, setSubmitted] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const [error, setError] = useState('');

    // Store actual File objects for upload
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [docFiles, setDocFiles] = useState<File[]>([]);
    // Store preview URLs
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [docPreviews, setDocPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState<Partial<SellerFormData>>({
        seller_name: '',
        seller_phone: '',
        seller_email: '',
        seller_city: '',
        whatsapp_consent: true,
        make: '',
        model: '',
        year: new Date().getFullYear() - 3,
        variant: '',
        fuel_type: FuelType.PETROL,
        transmission: TransmissionType.MANUAL,
        mileage: 0,
        registration_city: '',
        owners: 1,
        accident_history: false,
        service_history: '',
        insurance_status: '',
        selling_reason: '',
    });

    const updateFormData = (field: keyof SellerFormData, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setPhotoFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPhotoPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setDocFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setDocPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeDoc = (index: number) => {
        setDocFiles(prev => prev.filter((_, i) => i !== index));
        setDocPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return formData.seller_name && formData.seller_phone && formData.seller_email && formData.seller_city;
            case 2:
                return formData.make && formData.model && formData.year && formData.mileage && formData.registration_city;
            case 3:
                return true;
            case 4:
                return photoFiles.length >= 1;
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            // Upload photos to Cloudinary
            setIsUploading(true);
            const photoUrls = await uploadMultipleFiles(
                photoFiles,
                'car-submissions/photos',
                (current, total) => setUploadProgress({ current, total })
            );

            // Upload documents to Cloudinary
            const docUrls = await uploadMultipleFiles(
                docFiles,
                'car-submissions/documents',
                (current, total) => setUploadProgress({ current: photoFiles.length + current, total: photoFiles.length + total })
            );
            setIsUploading(false);

            // Create submission in Supabase
            const result = await createSubmission({
                ...formData,
                photos: photoUrls,
                documents: docUrls,
            } as SellerFormData & { photos: string[], documents: string[] });

            if (result.success && result.referenceId) {
                setReferenceId(result.referenceId);
                setSubmitted(true);
            } else {
                setError(result.error || 'Failed to submit. Please try again.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
            setIsUploading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Check className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Submission Received!</h1>
                    <p className="text-white/60 mb-6">
                        Thank you for submitting your car. Our experts will review your details
                        and contact you within 24-48 hours.
                    </p>
                    <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl mb-6">
                        <p className="text-sm text-white/50 mb-1">Your Reference ID</p>
                        <p className="text-2xl font-mono font-bold text-amber-500">{referenceId}</p>
                    </div>
                    <p className="text-sm text-white/40 mb-8">
                        Please save this reference ID for future communication.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-3 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-colors"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-b from-amber-500/10 to-transparent border-b border-white/5">
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Sell Your <span className="text-amber-500">Car</span>
                    </h1>
                    <p className="text-white/60 max-w-lg mx-auto">
                        Submit your car details. Our experts will review, verify, and help you
                        get the best price. No hassle, complete transparency.
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${currentStep > step.id
                                        ? 'bg-emerald-500 text-white'
                                        : currentStep === step.id
                                            ? 'bg-amber-500 text-black'
                                            : 'bg-zinc-800 text-white/40'
                                    }
                `}>
                                    {currentStep > step.id ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <step.icon className="h-5 w-5" />
                                    )}
                                </div>
                                <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-white/40'}`}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-full h-0.5 mx-2 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                                    style={{ width: '60px' }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Form Steps */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Seller Details */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Your Contact Details</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.seller_name}
                                            onChange={(e) => updateFormData('seller_name', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.seller_phone}
                                            onChange={(e) => updateFormData('seller_phone', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.seller_email}
                                            onChange={(e) => updateFormData('seller_email', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">City *</label>
                                        <select
                                            value={formData.seller_city}
                                            onChange={(e) => updateFormData('seller_city', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value="">Select city</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Preferred Contact Time</label>
                                    <input
                                        type="text"
                                        value={formData.preferred_contact_time || ''}
                                        onChange={(e) => updateFormData('preferred_contact_time', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                        placeholder="e.g., Weekdays after 6 PM"
                                    />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.whatsapp_consent}
                                        onChange={(e) => updateFormData('whatsapp_consent', e.target.checked)}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-white/70">I consent to receive WhatsApp messages</span>
                                </label>
                            </motion.div>
                        )}

                        {/* Step 2: Car Basics */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Car Details</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Make *</label>
                                        <select
                                            value={formData.make}
                                            onChange={(e) => updateFormData('make', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value="">Select make</option>
                                            {carMakes.map(make => (
                                                <option key={make} value={make}>{make}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Model *</label>
                                        <input
                                            type="text"
                                            value={formData.model}
                                            onChange={(e) => updateFormData('model', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                            placeholder="e.g., Swift, Creta, 3 Series"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Year *</label>
                                        <select
                                            value={formData.year}
                                            onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Variant</label>
                                        <input
                                            type="text"
                                            value={formData.variant || ''}
                                            onChange={(e) => updateFormData('variant', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                            placeholder="e.g., ZXi+, M Sport"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Fuel Type *</label>
                                        <select
                                            value={formData.fuel_type}
                                            onChange={(e) => updateFormData('fuel_type', e.target.value as FuelType)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value={FuelType.PETROL}>Petrol</option>
                                            <option value={FuelType.DIESEL}>Diesel</option>
                                            <option value={FuelType.CNG}>CNG</option>
                                            <option value={FuelType.ELECTRIC}>Electric</option>
                                            <option value={FuelType.HYBRID}>Hybrid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Transmission *</label>
                                        <select
                                            value={formData.transmission}
                                            onChange={(e) => updateFormData('transmission', e.target.value as TransmissionType)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value={TransmissionType.MANUAL}>Manual</option>
                                            <option value={TransmissionType.AUTOMATIC}>Automatic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Kilometers Driven *</label>
                                        <input
                                            type="number"
                                            value={formData.mileage || ''}
                                            onChange={(e) => updateFormData('mileage', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                                            placeholder="e.g., 45000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Registration City *</label>
                                        <select
                                            value={formData.registration_city}
                                            onChange={(e) => updateFormData('registration_city', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value="">Select city</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Condition */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Ownership & Condition</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Number of Owners</label>
                                        <select
                                            value={formData.owners}
                                            onChange={(e) => updateFormData('owners', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>{num}{num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th'} Owner</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Insurance Status</label>
                                        <select
                                            value={formData.insurance_status || ''}
                                            onChange={(e) => updateFormData('insurance_status', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value="">Select status</option>
                                            <option value="comprehensive">Comprehensive</option>
                                            <option value="third_party">Third Party</option>
                                            <option value="expired">Expired</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-3">Accident History</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => updateFormData('accident_history', false)}
                                            className={`flex-1 py-3 rounded-xl border transition-colors ${!formData.accident_history
                                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-white/60'
                                                }`}
                                        >
                                            No Accidents
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateFormData('accident_history', true)}
                                            className={`flex-1 py-3 rounded-xl border transition-colors ${formData.accident_history
                                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                                    : 'bg-white/5 border-white/10 text-white/60'
                                                }`}
                                        >
                                            Has Accident History
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Service History</label>
                                    <textarea
                                        value={formData.service_history || ''}
                                        onChange={(e) => updateFormData('service_history', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                                        rows={3}
                                        placeholder="Describe service history (e.g., Regular servicing at authorized center)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Reason for Selling (Optional)</label>
                                    <textarea
                                        value={formData.selling_reason || ''}
                                        onChange={(e) => updateFormData('selling_reason', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                                        rows={2}
                                        placeholder="Why are you selling this car?"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Photos */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Photos & Documents</h2>

                                {/* Photos Upload */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-3">Car Photos * (At least 1 required)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {photoPreviews.map((photo, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {photoPreviews.length < 8 && (
                                            <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-amber-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                                <Upload className="h-8 w-8 text-white/40 mb-2" />
                                                <span className="text-sm text-white/40">Add Photo</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handlePhotoUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/40 mt-2">
                                        Upload clear photos of exterior, interior, engine, and odometer
                                    </p>
                                </div>

                                {/* Documents Upload */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-3">Documents (RC, Insurance - Optional)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {docPreviews.map((_, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group bg-zinc-800">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FileText className="h-8 w-8 text-white/40" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDoc(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {docPreviews.length < 4 && (
                                            <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-amber-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                                <Upload className="h-8 w-8 text-white/40 mb-2" />
                                                <span className="text-sm text-white/40">Add Document</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    multiple
                                                    onChange={handleDocUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-amber-200">
                                            <strong>Note:</strong> Your listing will NOT be published automatically.
                                            Our team will review your submission and contact you for verification.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={isSubmitting}
                            className={`flex items-center gap-2 px-6 py-3 text-white/60 hover:text-white transition-colors ${currentStep === 1 ? 'invisible' : ''
                                }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!validateStep() || isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {isUploading
                                        ? `Uploading (${uploadProgress.current}/${uploadProgress.total})...`
                                        : 'Submitting...'}
                                </>
                            ) : currentStep === 4 ? (
                                'Submit'
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
