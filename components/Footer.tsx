'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const WhatsappIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
);

const footerLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/browse' },
    { name: 'Sell Your Car', href: '/sell' },
    { name: 'Service Center', href: '/service' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/thetorquechennai/', icon: Facebook },
    { name: 'Instagram', href: 'https://www.instagram.com/thetorque/', icon: Instagram },
    { name: 'WhatsApp', href: 'https://wa.me/919003111366', icon: WhatsappIcon },
    { name: 'Youtube', href: 'https://www.youtube.com/channel/UC1FpFktH98om56U-NeiLRmQ', icon: Youtube },
];

export default function Footer() {
    const pathname = usePathname();

    // Don't show footer on dashboard pages
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className="bg-black border-t border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 h-10">
                            <img
                                src="https://okdvpidwuhawowepxucq.supabase.co/storage/v1/object/public/car-images/logo/dsfsds.png"
                                alt="The Torque"
                                className="h-full object-contain"
                            />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                            Chennai's most trusted premium pre-owned car marketplace. Every car is
                            expert-verified for your peace of mind.
                        </p>
                        <div className="space-y-4">
                            <a href="tel:+919940419999" className="flex items-center gap-3 text-white/60 text-sm hover:text-red-400 transition-colors">
                                <Phone className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>+91 99404 19999</span>
                            </a>
                            <a href="https://wa.me/919003111366" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 text-sm hover:text-red-400 transition-colors">
                                <WhatsappIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>+91 90031 11366</span>
                            </a>
                            <a href="mailto:info@thetorque.in" className="flex items-center gap-3 text-white/60 text-sm hover:text-red-400 transition-colors">
                                <Mail className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>info@thetorque.in</span>
                            </a>
                            <a
                                href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIHCAAQABiPAjIGCAEQRRg7MgYIAhBFGDsyBggDEEUYPDIGCAQQRRg8MgYIBRBFGDwyBggGEEUYPDIGCAcQRRg90gEINDYzNWowajmoAgawAgHxBRLA5I6_XBoo&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Kc_hqQgpZFI6MWSBe5I3qCE4&daddr=861,+Poonamallee+High+Rd,+Kilpauk,+Chennai,+Tamil+Nadu+600010"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 text-white/60 text-sm hover:text-red-400 transition-colors"
                            >
                                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                                <span>861, Poonamallee High Rd, Kilpauk<br />Chennai, Tamil Nadu 600010</span>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-3 lg:ml-auto w-full lg:w-3/4">
                        <h3 className="text-white font-semibold mb-6">Navigation</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                            <ul className="space-y-4">
                                {footerLinks.slice(0, 3).map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/60 hover:text-red-400 text-sm transition-colors whitespace-nowrap">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-4">
                                {footerLinks.slice(3, 6).map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/60 hover:text-red-400 text-sm transition-colors whitespace-nowrap">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-4">
                                {footerLinks.slice(6).map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/60 hover:text-red-400 text-sm transition-colors whitespace-nowrap">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Torque. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
