'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    User, Car, FileText, Camera, ChevronRight, ChevronLeft, 
    Check, Upload, X, AlertCircle, Loader2, CheckCircle2, 
    Banknote, Clock, ShieldCheck, Users, Info, Settings,
    FileCheck2, IndianRupee, MapPin
} from 'lucide-react';
import { FuelType, TransmissionType, SellerFormData } from '@/types';
import { uploadMultipleFiles, validateImage } from '@/lib/upload';
import { createSubmission } from '@/lib/actions';

const steps = [
    { id: 1, title: 'Your Details', icon: User },
    { id: 2, title: 'Car Basics', icon: Car },
    { id: 3, title: 'Condition', icon: FileText },
    { id: 4, title: 'Photos', icon: Camera },
];

const carMakes = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Jaguar', 'Range Rover', 'Volvo', 
    'Toyota', 'Honda', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Other'
];

const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);

export default function SellPage() {
    const router = useRouter();
    const formRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [submitted, setSubmitted] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const [error, setError] = useState('');
    const [uploadError, setUploadError] = useState('');

    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    // Detail states for Step 3
    const [conditionChip, setConditionChip] = useState('Good');
    const [accidentDamage, setAccidentDamage] = useState('No accidents — clean history');
    const [modifications, setModifications] = useState('');
    const [sellReason, setSellReason] = useState('Upgrading to a new car');
    const [additionalNotes, setAdditionalNotes] = useState('');

    const [formData, setFormData] = useState<Partial<SellerFormData>>({
        seller_name: '',
        seller_phone: '',
        seller_email: '',
        preferred_contact_time: 'Any Time',
        whatsapp_consent: true,
        make: '',
        model: '',
        year: new Date().getFullYear() - 3,
        fuel_type: FuelType.PETROL,
        transmission: TransmissionType.AUTOMATIC,
        mileage: undefined,
        owners: 1,
        registration_city: 'Chennai',
    });

    const updateFormData = (field: keyof SellerFormData, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError('');
        const files = e.target.files;
        if (files) {
            const validFiles: File[] = [];

            Array.from(files).forEach((file) => {
                const { isValid, error } = validateImage(file);
                if (!isValid) {
                    setUploadError(error || 'Invalid file.');
                } else {
                    if (photoFiles.length + validFiles.length < 10) {
                        validFiles.push(file);
                    } else {
                        setUploadError('Maximum 10 images allowed.');
                    }
                }
            });

            if (validFiles.length > 0) {
                setPhotoFiles(prev => [...prev, ...validFiles]);
                const newPreviews = validFiles.map(file => URL.createObjectURL(file));
                setPhotoPreviews(prev => [...prev, ...newPreviews]);
            }
        }
        e.target.value = '';
    };

    const removePhoto = (index: number) => {
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return formData.seller_name && formData.seller_phone;
            case 2:
                return formData.make && formData.model && formData.year && formData.mileage;
            case 3:
                return conditionChip && accidentDamage && sellReason;
            case 4:
                return true; // Photos are optional as per wireframe
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            let photoUrls: string[] = [];
            if (photoFiles.length > 0) {
                setIsUploading(true);
                photoUrls = await uploadMultipleFiles(
                    photoFiles,
                    'car-submissions/photos',
                    (current, total) => setUploadProgress({ current, total })
                );
                setIsUploading(false);
            }

            // Compile service_history
            const compiledNotes = `Overall Condition: ${conditionChip}
Accident/Damage: ${accidentDamage}
Modifications: ${modifications || 'None'}
Reason for Selling: ${sellReason}
Additional Notes: ${additionalNotes || 'None'}`;

            const result = await createSubmission({
                ...formData,
                seller_city: formData.seller_city || 'Chennai',
                registration_city: formData.registration_city || 'Chennai',
                service_history: compiledNotes,
                accident_history: accidentDamage !== 'No accidents — clean history',
                photos: photoUrls,
                documents: [], // Not needed for iteration 2
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

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                        Our team will review your car details and call you with a valuation within 24 hours — usually much faster.
                    </p>
                    <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl mb-6">
                        <p className="text-sm text-white/50 mb-1">Your Reference ID</p>
                        <p className="text-2xl font-mono font-bold text-red-400">{referenceId}</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                    >
                        Return to Homepage
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* HERO SECTION */}
            <div className="pt-24 pb-16 border-b border-white/5 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        
                        {/* LEFT COLUMN: HERO CONTENT */}
                        <div className="space-y-8 sticky top-32">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium mb-6">
                                    <Car className="h-4 w-4" />
                                    Sell Your Car
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                    Get the Best Price <br/>for Your Car
                                </h1>
                                <p className="text-lg text-white/60 mb-8">
                                    Chennai's most trusted pre-owned car buyers. Expert valuations, 
                                    instant decisions, and zero hassle from start to finish.
                                </p>
                            </div>
                            
                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <button
                                    onClick={scrollToForm}
                                    className="flex-1 w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-red-600/25 hover:bg-red-700 transition-all"
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                    Submit Your Car
                                </button>
                                <a
                                    href="tel:+919940419999"
                                    className="flex-1 w-full flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 text-white hover:bg-zinc-700 font-semibold rounded-full transition-all"
                                >
                                    Call for Valuation
                                </a>
                            </div>

                            {/* Trust Pills */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                    <span className="text-white font-medium text-sm">Free Expert Valuation</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Clock className="h-6 w-6 text-emerald-500" />
                                    <span className="text-white font-medium text-sm">Same-Day Offer</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                    <span className="text-white font-medium text-sm">Zero Hidden Charges</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <Users className="h-6 w-6 text-emerald-500" />
                                    <span className="text-white font-medium text-sm">5000+ Cars Bought</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: MULTI-STEP FORM */}
                        <div ref={formRef} className="bg-zinc-900 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
                            
                            {/* Progress Steps Indicator */}
                            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center min-w-[70px]">
                                        <div className="flex flex-col items-center">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0
                                                ${currentStep > step.id
                                                    ? 'bg-emerald-500 text-white'
                                                    : currentStep === step.id
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-zinc-800 text-white/40'
                                                }
                                            `}>
                                                {currentStep > step.id ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <step.icon className="h-4 w-4" />
                                                )}
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`h-0.5 mx-2 flex-grow min-w-[30px] ${currentStep > step.id ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
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

                            {/* Form Body */}
                            <AnimatePresence mode="wait">
                                
                                {/* STEP 1 */}
                                {currentStep === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Your Details</h2>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Full Name *</label>
                                            <input type="text" value={formData.seller_name} onChange={(e) => updateFormData('seller_name', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Phone Number *</label>
                                            <input type="tel" value={formData.seller_phone} onChange={(e) => updateFormData('seller_phone', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Email Address <span className="text-white/30">(Optional)</span></label>
                                            <input type="email" value={formData.seller_email} onChange={(e) => updateFormData('seller_email', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Preferred Contact Time</label>
                                            <select value={formData.preferred_contact_time || 'Any Time'} onChange={(e) => updateFormData('preferred_contact_time', e.target.value)} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                <option value="9 AM - 12 PM">9 AM – 12 PM</option>
                                                <option value="12 PM - 3 PM">12 PM – 3 PM</option>
                                                <option value="3 PM - 6 PM">3 PM – 6 PM</option>
                                                <option value="Any Time">Any Time</option>
                                            </select>
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                            <input type="checkbox" checked={formData.whatsapp_consent} onChange={(e) => updateFormData('whatsapp_consent', e.target.checked)} className="w-5 h-5 rounded border-white/20 bg-zinc-900 text-emerald-500" />
                                            <span className="text-sm text-white/80">I consent to receive WhatsApp updates from The Torque team.</span>
                                        </label>
                                    </motion.div>
                                )}

                                {/* STEP 2 */}
                                {currentStep === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Car Basics</h2>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Car Brand *</label>
                                            <select value={formData.make} onChange={(e) => updateFormData('make', e.target.value)} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                <option value="" className="text-white/40">Select brand</option>
                                                {carMakes.map(make => <option key={make} value={make}>{make}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Model *</label>
                                            <input type="text" placeholder="e.g. 5 Series, C-Class" value={formData.model} onChange={(e) => updateFormData('model', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1.5">Year of Manufacture *</label>
                                                <select value={formData.year} onChange={(e) => updateFormData('year', parseInt(e.target.value))} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1.5">Kilometres Driven *</label>
                                                <input type="number" placeholder="e.g. 45000 km" value={formData.mileage ?? ''} onChange={(e) => updateFormData('mileage', e.target.value === '' ? undefined : parseInt(e.target.value))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1.5">Fuel Type *</label>
                                                <select value={formData.fuel_type} onChange={(e) => updateFormData('fuel_type', e.target.value as FuelType)} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                    <option value={FuelType.PETROL}>Petrol</option>
                                                    <option value={FuelType.DIESEL}>Diesel</option>
                                                    <option value={FuelType.HYBRID}>Hybrid</option>
                                                    <option value={FuelType.ELECTRIC}>Electric</option>
                                                    <option value={FuelType.CNG}>CNG</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-1.5">Transmission *</label>
                                                <select value={formData.transmission} onChange={(e) => updateFormData('transmission', e.target.value as TransmissionType)} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                    <option value={TransmissionType.AUTOMATIC}>Automatic</option>
                                                    <option value={TransmissionType.MANUAL}>Manual</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Ownership *</label>
                                            <select value={formData.owners} onChange={(e) => updateFormData('owners', parseInt(e.target.value))} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                <option value={1}>1st Owner</option>
                                                <option value={2}>2nd Owner</option>
                                                <option value={3}>3rd Owner</option>
                                                <option value={4}>4th Owner or more</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3 */}
                                {currentStep === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Condition</h2>
                                        
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Overall Condition</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Excellent', 'Good', 'Fair', 'Needs Work'].map(condition => (
                                                    <button key={condition} type="button" onClick={() => setConditionChip(condition)} className={`py-3 px-3 rounded-xl border text-center font-medium transition-all ${conditionChip === condition ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
                                                        {condition}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Accident / Damage History</label>
                                            <select value={accidentDamage} onChange={(e) => setAccidentDamage(e.target.value)} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                <option value="No accidents — clean history">No accidents — clean history</option>
                                                <option value="Minor scratch or dent">Minor scratch or dent</option>
                                                <option value="Major accident repaired">Major accident repaired</option>
                                                <option value="Flood or fire damage">Flood or fire damage</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Reason for Selling</label>
                                            <select value={sellReason} onChange={(e) => setSellReason(e.target.value)} className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-red-500/50">
                                                <option value="Upgrading to a new car">Upgrading to a new car</option>
                                                <option value="Relocating">Relocating</option>
                                                <option value="Financial reasons">Financial reasons</option>
                                                <option value="No longer need the car">No longer need the car</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Modifications <span className="text-white/30">(Optional)</span></label>
                                            <input type="text" placeholder="e.g. alloy wheels, sunroof, audio system" value={modifications} onChange={(e) => setModifications(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50" />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Additional Notes <span className="text-white/30">(Optional)</span></label>
                                            <textarea rows={3} placeholder="Any other details you'd like us to know" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500/50 resize-none"></textarea>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4 */}
                                {currentStep === 4 && (
                                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Photos <span className="text-white/40 font-normal text-base">(Optional)</span></h2>

                                        <p className="text-sm text-white/60 mb-4">
                                            Click to upload car photos — Exterior (front, rear, sides), interior, odometer. Takes up to 10 images.
                                        </p>

                                        {uploadError && (
                                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-red-400" />
                                                <p className="text-sm text-red-400">{uploadError}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 gap-3">
                                            {photoPreviews.map((photo, index) => (
                                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                                                    <img src={photo} alt="" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {photoPreviews.length < 10 && (
                                                <label className="aspect-square rounded-xl bg-white/5 border-2 border-dashed border-white/20 hover:border-red-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                                    <Camera className="h-6 w-6 text-white/40 mb-1" />
                                                    <span className="text-xs text-white/40 font-medium">Add Photo</span>
                                                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                                                </label>
                                            )}
                                        </div>

                                        <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-white/5 flex gap-3">
                                            <Info className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                                            <p className="text-sm text-white/60">
                                                Or bring your car to our showroom at 861, Poonamallee High Road, Kilpauk for a free in-person inspection and instant valuation.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons within form */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={isSubmitting}
                                    className={`flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!validateStep() || isSubmitting}
                                    className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-red-600/25 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {isUploading ? `${uploadProgress.current}/${uploadProgress.total}...` : 'Submitting...'}
                                        </>
                                    ) : currentStep === 4 ? (
                                        'Submit for Valuation'
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
            </div>

            {/* SECTION 2: HOW IT WORKS */}
            <div className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-red-500 font-medium mb-3">Simple Process</p>
                        <h2 className="text-3xl font-bold text-white mb-4">Sell Your Car in 4 Easy Steps</h2>
                        <p className="text-white/60">We've made selling your car as straightforward as possible — no paperwork headaches, no lowball surprises.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Submit Details', desc: 'Fill in the form above with your car\'s basic information and contact details. Takes less than 3 minutes.', icon: FileText },
                            { step: '2', title: 'Free Valuation', desc: 'Our expert team reviews your submission and calls you with a fair market valuation — usually within a few hours.', icon: Banknote },
                            { step: '3', title: 'Inspection & Offer', desc: 'Bring your car in or schedule a doorstep inspection. We\'ll make you a transparent, no-obligation offer on the spot.', icon: FileCheck2 },
                            { step: '4', title: 'Get Paid', desc: 'Accept the offer, complete the paperwork — and receive payment directly. Clean, fast, and completely hassle-free.', icon: IndianRupee },
                        ].map((item, idx) => (
                            <div key={item.step} className="relative flex flex-col items-center text-center">
                                {/* Desktop Line Connector */}
                                {idx < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-white/10" />}
                                
                                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center relative z-10 mb-6 group hover:border-red-500/30 transition-colors">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center border-4 border-black text-sm">
                                        {item.step}
                                    </div>
                                    <item.icon className="h-8 w-8 text-white/50 group-hover:text-red-500 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 3: WHY CHOOSE US */}
            <div className="py-20 bg-zinc-950 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-red-500 font-medium mb-3">Why Choose Us</p>
                        <h2 className="text-3xl font-bold text-white mb-4">Why Sell With The Torque?</h2>
                        <p className="text-white/60">Over 5000 cars bought since 2011. We've built our reputation on fair prices and zero-pressure selling.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Same-Day Offer', desc: 'Once you bring your car in, we complete the inspection and present a formal offer the same day. No week-long wait, no follow-up calls chasing a decision.' },
                            { title: 'Transparent Pricing', desc: 'Our valuations are based on live Chennai market data, vehicle condition, and service history — explained to you in full. No mystery numbers, no last-minute deductions.' },
                            { title: 'We Handle the Paperwork', desc: 'RC transfer, NOC, insurance — our team manages all the documentation end-to-end. You simply sign where needed and we take care of the rest.' },
                            { title: 'Trusted by 5000+ Sellers', desc: 'Since 2011, thousands of Chennai car owners have trusted us with their vehicles. Our 98% satisfaction score speaks for itself.' },
                            { title: 'Instant Payment', desc: 'Once you accept our offer and paperwork is in order, we process payment immediately — NEFT, RTGS, or bank transfer on the same day.' },
                            { title: 'Doorstep Inspection', desc: 'Can\'t make it to Kilpauk? Our team can visit your location in Chennai for an on-site inspection at a time convenient for you.' }
                        ].map((card, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-white/5 rounded-2xl p-8 hover:bg-zinc-800/80 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                                <p className="text-white/60 leading-relaxed text-sm">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 4: COMPARISON TABLE */}
            <div className="py-20 bg-black">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-red-500 font-medium mb-3">The Smarter Choice</p>
                        <h2 className="text-3xl font-bold text-white mb-4">Torque vs Your Other Options</h2>
                        <p className="text-white/60">Not all selling routes are equal. Here's how we compare.</p>
                    </div>

                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full min-w-[700px] border-collapse bg-zinc-900 rounded-2xl overflow-hidden border border-white/10">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40">
                                    <th className="py-6 px-6 text-left text-sm font-semibold text-white/50 w-1/4">What Matters</th>
                                    <th className="py-6 px-6 text-left text-lg font-bold text-white w-1/4 border-x border-white/5 bg-red-600/10">The Torque</th>
                                    <th className="py-6 px-6 text-left text-sm font-semibold text-white/80 w-1/4">Private Sale</th>
                                    <th className="py-6 px-6 text-left text-sm font-semibold text-white/80 w-1/4">Other Dealers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { matter: 'Time to sell', tq: 'Same day', pv: 'Weeks to months', od: '2–5 days' },
                                    { matter: 'Price fairness', tq: 'Market-based, transparent', pv: 'Variable', od: 'Often below market' },
                                    { matter: 'Paperwork', tq: 'Fully managed by us', pv: 'You handle everything', od: 'Partially managed' },
                                    { matter: 'Negotiation pressure', tq: 'Zero pressure', pv: 'High — multiple buyers', od: 'Often pressured' },
                                    { matter: 'Payment security', tq: 'Instant bank transfer', pv: 'Risk of fraud', od: 'Standard' },
                                    { matter: 'RC transfer support', tq: 'Fully handled', pv: 'Your responsibility', od: 'Varies' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 px-6 text-sm font-medium text-white/80">{row.matter}</td>
                                        <td className="py-5 px-6 text-sm font-bold text-red-400 border-x border-white/5 bg-red-600/[0.02]">{row.tq}</td>
                                        <td className="py-5 px-6 text-sm text-white/50">{row.pv}</td>
                                        <td className="py-5 px-6 text-sm text-white/50">{row.od}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SECTION 5: PARK & SELL CALLOUT */}
            <div className="py-12 bg-zinc-950 px-4">
                <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-red-600 to-red-900 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Settings className="w-64 h-64 animate-spin-slow" />
                    </div>
                    
                    <div className="relative z-10 grid md:grid-cols-5 gap-8 items-center">
                        <div className="md:col-span-3">
                            <span className="inline-block px-3 py-1 bg-black/30 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                Also Available
                            </span>
                            <h2 className="text-3xl font-bold text-white mb-4">Not Ready to Sell Yet? <br/>Try Park & Sell</h2>
                            <p className="text-white/80 text-lg leading-relaxed">
                                List your car in our showroom while keeping it or using it. We handle all marketing, viewings, and negotiations — you get the best price without the urgency.
                            </p>
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-4">
                            <button onClick={() => router.push('/park-and-sell-car-chennai')} className="w-full py-4 bg-white text-red-600 font-bold rounded-full hover:bg-zinc-100 transition-colors shadow-xl text-center">
                                Learn About Park & Sell
                            </button>
                            <a href="tel:+919940419999" className="w-full py-4 bg-black/20 text-white font-bold rounded-full hover:bg-black/30 border border-white/20 transition-colors text-center">
                                Call to Discuss Options
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 6: TESTIMONIALS */}
            <div className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-red-500 font-medium mb-3">What Sellers Say</p>
                        <h2 className="text-3xl font-bold text-white mb-4">Trusted by Chennai Car Owners</h2>
                        <p className="text-white/60">Real experiences from people who sold their cars with us.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { quote: "Got a fair valuation for my BMW 5 Series within hours of submitting. The whole process was done in one day — paperwork included. Absolutely seamless.", name: "Ramesh Kumar", meta: "Sold BMW 5 Series · Kilpauk" },
                            { quote: "I tried selling my Mercedes online for two months with zero luck. Came to Torque, got an offer the same day and payment was done by evening. Wish I'd come here first.", name: "Priya Sundaram", meta: "Sold Mercedes C-Class · Anna Nagar" },
                            { quote: "Very professional team. They explained every step of the valuation, were fair on the price, and handled the RC transfer without me having to visit the RTO even once.", name: "Arjun Venkat", meta: "Sold Audi A4 · Adyar" }
                        ].map((test, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-1 mb-6 text-red-500">
                                        {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                                    </div>
                                    <p className="text-white/80 text-lg leading-relaxed mb-8 italic">"{test.quote}"</p>
                                </div>
                                <div className="border-t border-white/5 pt-6">
                                    <p className="font-bold text-white mb-1">{test.name}</p>
                                    <p className="text-sm text-white/40 flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        {test.meta}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
