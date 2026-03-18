'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, MessageCircle, Navigation, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsappIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
);

const MAPS_DIRECTIONS_URL =
    'https://www.google.com/maps/dir//861,+Poonamallee+High+Rd,+Kilpauk,+Chennai,+Tamil+Nadu+600010';

const MAPS_EMBED_URL =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.3737064706487!2d80.2380!3d13.0820!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x38a12b3792877b65!2sThe%20Torque!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        interest: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((res) => setTimeout(res, 1000));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-32">
            {/* ─── Header ─────────────────────────────────────────────── */}
            <div className="relative mb-16 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-red-500/10 blur-[120px]" />
                <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Contact <span className="text-red-500">The Torque</span>
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed">
                            We're here to help with car sales, service enquiries, and vehicle inspections.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">

                {/* ─── Contact Cards ───────────────────────────────────── */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Sales Enquiries */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 border border-red-500/20 rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Sales Enquiries</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <a href="tel:+919940419999" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                                <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>+91 99404 19999</span>
                            </a>
                            <a href="https://wa.me/919003111366" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                                <WhatsappIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>+91 90031 11366</span>
                            </a>
                            <a href="mailto:info@thetorque.in" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                                <Mail className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>info@thetorque.in</span>
                            </a>
                        </div>

                        <div className="pt-5 border-t border-white/10">
                            <div className="flex items-start gap-3 text-white/70">
                                <Clock className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-white text-sm">Working Hours</p>
                                    <p className="text-sm mt-0.5">Monday – Saturday</p>
                                    <p className="text-sm">10:00 AM – 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Service Department */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.655m5.65-4.65 3.029-2.497a1.875 1.875 0 0 1 2.608 2.608l-2.497 3.029m-5.65 4.65-4.654-4.655" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Service Department</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <a href="tel:+919003166499" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                                <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>+91 90031 66499</span>
                            </a>
                            <a href="mailto:service@thetorque.in" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                                <Mail className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>service@thetorque.in</span>
                            </a>
                        </div>

                        <div className="pt-5 border-t border-white/10">
                            <div className="flex items-start gap-3 text-white/70">
                                <Clock className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-white text-sm">Service Hours</p>
                                    <p className="text-sm mt-0.5">Monday – Friday</p>
                                    <p className="text-sm">9:00 AM – 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Showroom + Map ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid lg:grid-cols-5 gap-6"
                >
                    {/* Address card */}
                    <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-6">Visit Our Showroom</h2>
                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">The Torque</p>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        861, Poonamallee High Rd<br />
                                        Kilpauk, Chennai<br />
                                        Tamil Nadu 600010
                                    </p>
                                </div>
                            </div>
                        </div>
                        <a
                            href={MAPS_DIRECTIONS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            <Navigation className="h-4 w-4" />
                            Get Directions
                        </a>
                    </div>

                    {/* Embedded Map */}
                    <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 min-h-[300px]">
                        <iframe
                            src={MAPS_EMBED_URL}
                            width="100%"
                            height="100%"
                            style={{ minHeight: '300px', border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="The Torque Showroom Location"
                        />
                    </div>
                </motion.div>

                {/* ─── Contact Form ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="grid lg:grid-cols-2 gap-10 items-start"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3">Send Us an Enquiry</h2>
                        <p className="text-white/60">
                            Fill in the form and our team will get back to you within one business day.
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <Send className="h-7 w-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Enquiry Sent!</h3>
                                <p className="text-white/60">We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Interested In</label>
                                    <select
                                        required
                                        value={formData.interest}
                                        onChange={(e) => setFormData((p) => ({ ...p, interest: e.target.value }))}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                    >
                                        <option value="" disabled className="bg-zinc-900 text-white/40">Select an option</option>
                                        <option value="buy" className="bg-zinc-900 text-white">Buy a Car</option>
                                        <option value="sell" className="bg-zinc-900 text-white">Sell a Car</option>
                                        <option value="service" className="bg-zinc-900 text-white">Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Message</label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                                        placeholder="How can we help you?"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> Submit Enquiry</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* ─── Social Media ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center py-12 border-y border-white/10"
                >
                    <p className="text-white/50 text-sm mb-2">Follow us</p>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Latest Cars &amp; Updates
                    </h2>
                    <p className="text-white/50 text-sm mb-8">@thetorque</p>

                    <div className="flex items-center justify-center gap-4">
                        {[
                            { label: 'Facebook', href: 'https://www.facebook.com/thetorquechennai/', Icon: Facebook },
                            { label: 'Instagram', href: 'https://www.instagram.com/thetorque/', Icon: Instagram },
                            { label: 'YouTube', href: 'https://www.youtube.com/channel/UC1FpFktH98om56U-NeiLRmQ', Icon: Youtube },
                        ].map(({ label, href, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900 border border-white/10 hover:border-red-500/40 hover:text-red-400 text-white/70 rounded-xl transition-colors"
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-sm font-medium">{label}</span>
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ─── Quick Action Sticky Bar (Mobile) ─────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur border-t border-white/10 px-4 py-3">
                <div className="flex gap-3">
                    <a
                        href="tel:+919940419999"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        <Phone className="h-4 w-4" />
                        Call Sales
                    </a>
                    <a
                        href="https://wa.me/919003111366"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        <WhatsappIcon className="h-4 w-4" />
                        WhatsApp
                    </a>
                    <a
                        href={MAPS_DIRECTIONS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        <Navigation className="h-4 w-4" />
                        Directions
                    </a>
                </div>
            </div>
        </div>
    );
}
