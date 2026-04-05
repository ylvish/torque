'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Car, HeartHandshake, ShieldCheck, Banknote, Sparkles, UserCheck, 
    Camera, Building2, Megaphone, CalendarCheck, FileCheck2, Handshake,
    CheckCircle2, AlertCircle, Loader2, ArrowRight, Star, Clock, FileKey, XCircle, Check
} from 'lucide-react';
import { FuelType, TransmissionType, SellerFormData } from '@/types';
import { createSubmission } from '@/lib/actions';

export default function ParkAndSellPage() {
    const [focusedFaq, setFocusedFaq] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    
    // Simple Enquiry Form State
    const [formData, setFormData] = useState({
        seller_name: '',
        seller_phone: '',
        make: '',
        model: '',
        mileage: '',
        expected_price: '',
        additional_notes: ''
    });

    const handleEnquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Simplified submission pointing to the same seller_submissions table
            // but wrapped in a generic "service_history" note so staff knows it's a Park&Sell enquiry
            const payload: Partial<SellerFormData> = {
                seller_name: formData.seller_name,
                seller_phone: formData.seller_phone,
                make: formData.make,
                model: formData.model, // E.g. "BMW X5 2020"
                year: new Date().getFullYear(), // Fallback
                fuel_type: FuelType.PETROL, // Fallback
                transmission: TransmissionType.AUTOMATIC, // Fallback
                mileage: parseInt(formData.mileage.replace(/\D/g, '') || '0', 10),
                selling_reason: 'PARK & SELL ENQUIRY',
                service_history: `Lead Source: Park & Sell Page Enquiry Form\nExpected Price: ${formData.expected_price}\nAdditional Notes: ${formData.additional_notes}`,
                registration_city: 'Chennai',
            };

            const result = await createSubmission(payload as any);

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black">
            
            {/* HERO SECTION */}
            <div className="pt-32 pb-20 px-4 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold tracking-wide uppercase mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                        <Sparkles className="h-4 w-4" />
                        Exclusive Service
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Your Car. Our Showroom. <br className="hidden md:block"/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                            Maximum Price.
                        </span>
                    </h1>
                    
                    <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Not in a rush to sell? Let The Torque display, market, and negotiate your car directly from our Kilpauk showroom. You get the best possible price — without lifting a finger.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={scrollToForm} className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-xl hover:shadow-red-600/30 flex items-center justify-center gap-2">
                            List My Car
                            <ArrowRight className="h-5 w-5" />
                        </button>
                        <a href="tel:+919940419999" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold rounded-full transition-all flex items-center justify-center">
                            Call to Discuss
                        </a>
                    </div>
                </div>
            </div>

            {/* STATISTICS BAR */}
            <div className="border-b border-white/5 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
                        <div className="py-8 text-center px-4">
                            <p className="text-4xl font-bold text-white mb-2">5000+</p>
                            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Cars Sold</p>
                        </div>
                        <div className="py-8 text-center px-4">
                            <p className="text-4xl font-bold text-white mb-2">15+</p>
                            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Years Experience</p>
                        </div>
                        <div className="py-8 text-center px-4">
                            <p className="text-4xl font-bold text-white mb-2">98%</p>
                            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Satisfaction Rate</p>
                        </div>
                        <div className="py-8 text-center px-4">
                            <p className="text-4xl font-bold text-white mb-2 text-red-500">Zero</p>
                            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Upfront Cost</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: WHAT IS PARK & SELL? */}
            <div className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-red-500 font-bold tracking-wider uppercase mb-3 text-sm">The Concept</p>
                            <h2 className="text-4xl font-bold text-white mb-4">What Is Park & Sell?</h2>
                            <p className="text-lg text-white/60 mb-10">Park & Sell is the smart alternative when you want to achieve the best price for your car — not just the quickest one.</p>
                            
                            <ul className="space-y-6">
                                {[
                                    { title: 'Maximum Visibility', desc: 'You bring your car to our showroom. We display it prominently among our premium inventory, giving it maximum visibility to serious buyers.' },
                                    { title: 'We Handle Everything', desc: 'Professional photos, listing on our platforms, walk-in buyer interactions, test drives, and negotiation — all managed by our team.' },
                                    { title: 'You Stay In Control', desc: 'We set the price together. Nothing moves without your approval. You can take the car back at any time.' },
                                    { title: 'Pay Only On Success', desc: 'No listing fees, no upfront costs. We charge a small commission only when your car is sold.' }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center">
                                                <CheckCircle2 className="h-4 w-4 text-red-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                            <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* VISUAL COMPARISON CARD (RIGHT) */}
                        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Banknote className="w-64 h-64" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">Selling Options Ranked by Value</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between p-4 bg-red-600/20 border border-red-500/50 rounded-xl">
                                    <span className="font-bold text-white flex items-center gap-2"><Star className="h-4 w-4 text-red-500 fill-current" /> Park & Sell with Torque</span>
                                    <span className="text-red-400 font-medium">Best Price</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <span className="font-medium text-white/80">Sell directly to Torque</span>
                                    <span className="text-white/60">Fast & Easy</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <span className="font-medium text-white/80">Online classifieds (OLX, etc.)</span>
                                    <span className="text-white/60">High Effort</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <span className="font-medium text-white/80">Trade-in at a new car dealer</span>
                                    <span className="text-white/60">Low Price</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: HOW PARK & SELL WORKS */}
            <div className="py-24 bg-zinc-950 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-red-500 font-bold tracking-wider uppercase mb-3 text-sm">Step by Step</p>
                        <h2 className="text-4xl font-bold text-white mb-4">How Park & Sell Works</h2>
                        <p className="text-lg text-white/60">A smooth, transparent process designed to get your car sold at the right price.</p>
                    </div>

                    <div className="relative pl-8 md:pl-0">
                        {/* Vertical Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"></div>
                        <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-4"></div>

                        {[
                            { num: '1', title: 'Submit Your Car Details', desc: 'Fill in our quick enquiry form below, or simply call us at +91 99404 19999 and we\'ll take it from there.' },
                            { num: '2', title: 'Inspection & Price Agreement', desc: 'Bring your car to our Kilpauk showroom. Our experts inspect the vehicle and we agree on a listing price together — one that reflects true market value.' },
                            { num: '3', title: 'Professional Photography & Listing', desc: 'We photograph your car professionally and list it across our showroom floor, website, and digital channels. Premium presentation guaranteed.' },
                            { num: '4', title: 'We Handle Buyers & Negotiations', desc: 'Our team manages all buyer enquiries, test drive bookings, and negotiations. No strangers calling your personal number, no awkward haggling.' },
                            { num: '5', title: 'Sale & Paperwork', desc: 'Once a buyer is confirmed and you approve the deal, we manage all documentation — RC transfer, NOC. You receive your payment (minus our small commission).' },
                        ].map((step, idx) => (
                            <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 mb-12 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className={`md:w-1/2 flex flex-col ${idx % 2 === 0 ? 'md:items-start text-left' : 'md:items-end md:text-right'} w-full`}>
                                    <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl w-full">
                                        <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                        <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                                <div className="absolute left-[-32px] md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-zinc-900 border-x-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center font-bold text-white z-10 transition-transform hover:scale-110">
                                    {step.num}
                                </div>
                                <div className="md:w-1/2 w-full hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 4: EVERYTHING WE HANDLE */}
            <div className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-red-500 font-bold tracking-wider uppercase mb-3 text-sm">Full Service</p>
                        <h2 className="text-4xl font-bold text-white mb-4">Everything We Handle On Your Behalf</h2>
                        <p className="text-lg text-white/60">From the moment you drop your car, we take complete ownership of the selling process.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Camera, title: 'Professional Photography', desc: 'High-quality photos of your car\'s exterior, interior, and key features — taken by our in-house team to make your listing stand out.' },
                            { icon: Building2, title: 'Showroom Display', desc: 'Your car sits in our premium showroom at Poonamallee High Road, visible to hundreds of walk-in buyers and serious enquirers every week.' },
                            { icon: Megaphone, title: 'Buyer Sourcing', desc: 'We actively market your car across our website, digital channels, and our existing buyer network — reaching qualified buyers faster than any individual can.' },
                            { icon: CalendarCheck, title: 'Test Drive Management', desc: 'We supervise all test drives in our team\'s presence. Your car is never taken alone by strangers, and we handle all scheduling logistics.' },
                            { icon: Handshake, title: 'Price Negotiation', desc: 'Our experienced sales team handles all buyer negotiations professionally, ensuring you get the best possible outcome without any pressure or stress.' },
                            { icon: FileCheck2, title: 'Documentation & Transfer', desc: 'RC transfer, NOC, Form 29/30, insurance — every piece of paperwork is handled end-to-end by our team. You sign once. We do the rest.' }
                        ].map((card, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-white/5 rounded-2xl p-8 hover:bg-zinc-800 transition-colors group">
                                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <card.icon className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 5: WHO IS PARK & SELL FOR? */}
            <div className="py-24 bg-zinc-950 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-red-500 font-bold tracking-wider uppercase mb-3 text-sm">Is This Right for You?</p>
                        <h2 className="text-4xl font-bold text-white mb-4">Park & Sell Is Perfect If...</h2>
                        <p className="text-lg text-white/60">This service is designed for a specific kind of seller. Here's who benefits most.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Clock, title: "You're Not in a Rush", desc: "You'd rather wait a few extra weeks to get the right price than take the first offer you see. Quality over speed." },
                            { icon: null, title: "You're Too Busy to Sell", desc: "You don't have the time to respond to dozens of enquiries, arrange viewings, and deal with tyre-kickers. We do it all." },
                            { icon: Star, title: "You Own a Premium Car", desc: "Luxury cars deserve a luxury platform. Our showroom attracts exactly the buyers who appreciate and can afford a BMW, Mercedes, Audi, or Porsche." },
                            { icon: ShieldCheck, title: "You Want Privacy & Safety", desc: "No strangers coming to your home. No personal number shared publicly. All buyer interaction happens through our team securely." },
                            { icon: FileKey, title: "You Hate Paperwork", desc: "The RC transfer and documentation process can be a nightmare. We've done it thousands of times and handle it completely." },
                            { icon: XCircle, title: "You Might Change Your Mind", desc: "Not fully committed to selling? Park & Sell is non-binding. You can take your car back at any time if your plans change. No strings attached." }
                        ].map((card, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white p-0.5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                                        <p className="text-sm text-white/60 leading-relaxed">{card.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 6: PRICING & FAQ */}
            <div className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        
                        {/* PRICING CARD */}
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/20 blur-3xl rounded-full mix-blend-screen opacity-50"></div>
                            
                            <p className="text-red-500 font-bold tracking-wider uppercase mb-2 text-sm">Transparent Pricing</p>
                            <h3 className="text-3xl font-bold text-white mb-2">Simple, Success-Based Fee</h3>
                            <p className="text-white/60 mb-8">No listing fees. No monthly charges. We only earn when you sell.</p>
                            
                            <div className="py-6 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-1">Fee Type</p>
                                    <p className="text-xl font-bold text-white">Commission on Sale</p>
                                </div>
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30">
                                    <span className="text-white font-bold">%</span>
                                </div>
                            </div>
                            
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Professional photography',
                                    'Showroom display & digital listing',
                                    'All buyer enquiry management',
                                    'Test drive supervision',
                                    'Full price negotiation',
                                    'Complete documentation & RC transfer',
                                    'NO charges if car does not sell'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-center">
                                        <CheckCircle2 className={`h-5 w-5 ${idx === 6 ? 'text-emerald-500' : 'text-red-500'}`} />
                                        <span className={`text-sm ${idx === 6 ? 'font-bold text-emerald-400' : 'text-white/80'}`}>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={scrollToForm} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 text-center">
                                Get a Custom Quote
                            </button>
                        </div>

                        {/* FAQ ACCORDION */}
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                {[
                                    { q: "Can I still use my car while it's listed?", a: "For Park & Sell, the car is typically kept at our showroom for display purposes. However, we can discuss flexible arrangements depending on your situation — just speak to our team." },
                                    { q: "How long will it take to sell my car?", a: "It depends on the vehicle, pricing, and market conditions. Premium cars with realistic pricing typically sell within 2–6 weeks. Our team will give you an honest estimate based on current demand." },
                                    { q: "What if I want to take my car back?", a: "You can withdraw your vehicle at any point without penalty. Park & Sell is a completely non-binding agreement until a buyer signs the papers." },
                                    { q: "Do I need to clean or service the car first?", a: "We handle basic washing for the showroom. However, a well-presented car sells faster. If detailing or servicing is needed, we can facilitate that through our Service Center." },
                                    { q: "How do you determine the asking price?", a: "We use live market data, recent sales history in Chennai, and the specific condition of your car to propose a target price. Ultimately, you make the final decision on what price to accept." }
                                ].map((faq, idx) => (
                                    <div key={idx} className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50">
                                        <button 
                                            onClick={() => setFocusedFaq(focusedFaq === idx ? null : idx)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                                        >
                                            <span className="font-bold text-white pr-4">{faq.q}</span>
                                            <span className={`text-white transition-transform ${focusedFaq === idx ? 'rotate-180' : ''}`}>
                                                ⌄
                                            </span>
                                        </button>
                                        {focusedFaq === idx && (
                                            <div className="px-6 pb-4 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* SECTION 7: ENQUIRY FORM / LEAD CAPTURE */}
            <div id="enquiry-form" className="py-24 bg-zinc-950 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Park & Sell?</h2>
                        <p className="text-white/60">Drop your details below and our valuation expert will call you back shortly.</p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl">
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <Check className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Enquiry Received</h3>
                                <p className="text-white/60">Thank you! Our team will contact you very soon to discuss the Park & Sell process for your car.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleEnquiry} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                        <p className="text-sm text-red-400">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Your Name *</label>
                                    <input required type="text" value={formData.seller_name} onChange={(e) => setFormData({...formData, seller_name: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50" placeholder="e.g. Rahul Sharma" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Phone Number *</label>
                                    <input required type="tel" value={formData.seller_phone} onChange={(e) => setFormData({...formData, seller_phone: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50" placeholder="+91 98765 43210" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Car Brand *</label>
                                    <select required value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50 appearance-none">
                                        <option value="" disabled hidden>Select Brand</option>
                                        <option value="BMW">BMW</option>
                                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                                        <option value="Audi">Audi</option>
                                        <option value="Porsche">Porsche</option>
                                        <option value="Jaguar">Jaguar</option>
                                        <option value="Range Rover">Range Rover</option>
                                        <option value="Volvo">Volvo</option>
                                        <option value="Toyota">Toyota</option>
                                        <option value="Honda">Honda</option>
                                        <option value="Hyundai">Hyundai</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Model & Year *</label>
                                    <input required type="text" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50" placeholder="e.g. BMW X5 2020" />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Kilometres Driven *</label>
                                    <input required type="text" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50" placeholder="e.g. 35,000 km" />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Expected Price <span className="text-white/30">(Optional)</span></label>
                                    <input type="text" value={formData.expected_price} onChange={(e) => setFormData({...formData, expected_price: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50" placeholder="e.g. ₹ 55,00,000" />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Additional Notes <span className="text-white/30">(Optional)</span></label>
                                    <textarea rows={3} value={formData.additional_notes} onChange={(e) => setFormData({...formData, additional_notes: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-red-500/50 resize-none" placeholder="Any specific requirements, timeline, or questions"></textarea>
                                </div>

                                <button type="submit" disabled={isSubmitting || !formData.seller_name || !formData.seller_phone || !formData.make || !formData.model || !formData.mileage} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 text-center flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Enquiry'}
                                </button>
                                <p className="text-center text-xs text-white/40">By submitting, you agree to receive a callback from The Torque team.</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* SECTION 8: CROSS-LINK CTA STRIP */}
            <div className="py-12 bg-black border-t border-white/10 text-center px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Want a quick sale instead?</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">We Also Buy Cars Directly — Same Day Offer</h3>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <button onClick={() => window.location.href = '/sell'} className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all text-center">
                            Sell Your Car Now
                        </button>
                        <a href="tel:+919940419999" className="px-8 py-3 bg-zinc-800 text-white hover:bg-zinc-700 font-bold rounded-full transition-all text-center border border-white/5">
                            Call +91 99404 19999
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}
