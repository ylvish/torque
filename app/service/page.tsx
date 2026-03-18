import { Metadata } from 'next';
import { Phone, CheckCircle2, Wrench, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Car Service | The Torque Service Centre',
    description:
        'Professional car servicing at The Torque — expert care for premium luxury vehicles and everyday standard cars in Chennai.',
};

const SERVICE_PHONE = '+919003166499';
const SERVICE_DISPLAY = '+91 90031 66499';

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
);

const premiumServices = [
    'Complete vehicle inspection & diagnostics',
    'Advanced electronic & ECU diagnostics',
    'Premium engine oil & filter replacement',
    'Brake system inspection & servicing',
    'Air conditioning service & regas',
    'Professional interior & exterior detailing',
    'Suspension & steering check',
    'Transmission fluid service',
];

const standardServices = [
    'Engine oil & filter change',
    'Air filter replacement',
    'Brake pad & disc inspection',
    'Battery health check & replacement',
    'Tyre rotation & pressure check',
    'Coolant & fluid top-up',
    'General vehicle safety inspection',
    'Lights & electrical check',
];

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-28">

            {/* ─── Hero ────────────────────────────────────────────── */}
            <div className="relative mb-16 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-red-500/10 blur-[100px]" />
                <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <p className="text-red-500 text-sm font-semibold tracking-widest uppercase mb-3">
                            The Torque Service Centre
                        </p>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">
                            Car Service at{' '}
                            <span className="text-red-500">The Torque</span>
                        </h1>
                        <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
                            We provide professional servicing for both luxury premium vehicles and
                            standard everyday cars. Our experienced technicians understand that every
                            vehicle requires different levels of care — ensuring high-quality service,
                            proper inspection, and reliable maintenance to keep your car running smoothly.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">

                {/* ─── Service Cards ───────────────────────────────── */}
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Premium */}
                    <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                                <Star className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-xs text-red-400 font-semibold tracking-widest uppercase mb-0.5">
                                    Premium
                                </p>
                                <h2 className="text-xl font-bold text-white">Luxury Car Service</h2>
                            </div>
                        </div>

                        <p className="text-white/65 text-sm leading-relaxed mb-7">
                            Our Premium Service is specially designed for luxury vehicles that require
                            advanced care and precision. High-end cars such as BMW, Audi, Mercedes-Benz,
                            and other premium brands need specialised diagnostics, skilled technicians,
                            and high-quality materials. We provide complete inspections, advanced
                            diagnostics, premium engine oil replacement, detailing, and professional
                            maintenance tailored for luxury cars.
                        </p>

                        <ul className="space-y-3 mb-8 flex-1">
                            {premiumServices.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                                    <CheckCircle2 className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6 border-t border-white/10 text-xs text-white/40">
                            Suitable for BMW · Audi · Mercedes-Benz · Porsche · Volvo · Jaguar · Land Rover & more
                        </div>
                    </div>

                    {/* Standard */}
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <Wrench className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 font-semibold tracking-widest uppercase mb-0.5">
                                    Standard
                                </p>
                                <h2 className="text-xl font-bold text-white">Standard Car Service</h2>
                            </div>
                        </div>

                        <p className="text-white/65 text-sm leading-relaxed mb-7">
                            Our Standard Service is ideal for regular cars used for daily driving. We
                            provide routine maintenance and essential inspections to keep your vehicle
                            safe and efficient on the road. Regular servicing helps maintain fuel
                            efficiency and prevents unexpected breakdowns.
                        </p>

                        <ul className="space-y-3 mb-8 flex-1">
                            {standardServices.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                                    <CheckCircle2 className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6 border-t border-white/10 text-xs text-white/40">
                            Suitable for all standard, everyday, and family vehicles
                        </div>
                    </div>
                </div>

                {/* ─── Book Your Service CTA ───────────────────────── */}
                <div className="relative overflow-hidden bg-zinc-900 border border-red-500/20 rounded-2xl p-10 text-center">
                    <div className="absolute inset-0 bg-red-500/5 blur-[80px]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Book Your Service</h2>
                        <p className="text-white/65 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                            Whether you drive a luxury vehicle or a standard car, The Torque provides
                            reliable service and expert care. Contact us today to schedule your service
                            appointment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={`tel:${SERVICE_PHONE}`}
                                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
                            >
                                <Phone className="h-5 w-5" />
                                Call {SERVICE_DISPLAY}
                            </a>
                            <a
                                href={`https://wa.me/${SERVICE_PHONE}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
                            >
                                <WhatsAppIcon className="h-5 w-5" />
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Sticky Mobile Bar ───────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur border-t border-white/10 px-4 py-3">
                <div className="flex gap-3">
                    <a
                        href={`tel:${SERVICE_PHONE}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        <Phone className="h-4 w-4" />
                        Call Service
                    </a>
                    <a
                        href={`https://wa.me/${SERVICE_PHONE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        <WhatsAppIcon className="h-4 w-4" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
