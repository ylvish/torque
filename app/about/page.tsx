import { Metadata } from 'next';
import { Award, ShieldCheck, HeartHandshake, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | The Torque',
    description: 'Learn about The Torque, Chennai\'s trusted premium pre-owned luxury car destination since 2011.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            {/* Hero Header */}
            <div className="relative mb-16 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-red-500/10 blur-[100px]" />
                <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            About Us
                        </h1>
                        <p className="text-xl text-white/70 leading-relaxed">
                            Chennai's trusted automotive destination, established in 2011.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-8 flex flex-col lg:flex-row gap-16">
                {/* Main Content */}
                <div className="lg:w-2/3 space-y-8 text-lg text-white/80 leading-relaxed">
                    <p>
                        <strong className="text-white font-semibold">The Torque</strong> is a trusted automotive destination in Chennai, established in 2011 and operating as a unit of Parveen Travels.
                    </p>
                    <p>
                        We specialize in premium pre-owned luxury cars and superbikes, offering carefully handpicked vehicles that meet high standards of quality, performance, and reliability. Along with luxury vehicles, we also deal with non-premium cars, providing both sales and complete after-sales service under one roof.
                    </p>
                    <p>
                        Over the years, The Torque has built a strong reputation backed by a large and loyal customer base, driven by transparency, trust, and customer satisfaction.
                    </p>
                    <p>
                        Our services go beyond buying and selling vehicles. We also offer <strong className="text-white font-semibold">Park & Sell</strong> services, allowing owners to list their cars with us while we handle the marketing and sales process.
                    </p>
                    <p>
                        With a commitment to premium vehicles, expert service, and a seamless ownership experience, The Torque continues to be a preferred destination for car enthusiasts and everyday drivers alike.
                    </p>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-8 sticky top-32">
                        <h3 className="text-xl font-bold text-white mb-6">Why Choose Us</h3>

                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <HeartHandshake className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Established 2011</h4>
                                    <p className="text-sm text-white/60">Over a decade of trust and excellence in the automotive industry.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Premium Quality</h4>
                                    <p className="text-sm text-white/60">Every vehicle is handpicked and thoroughly inspected to ensure reliability.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <Award className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Park & Sell</h4>
                                    <p className="text-sm text-white/60">Hassle-free selling experience handled entirely by our expert team.</p>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <a
                                href="tel:+919940419999"
                                className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                <Phone className="h-5 w-5" />
                                Call Sales Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
