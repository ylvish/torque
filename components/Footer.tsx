import Link from 'next/link';
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
    ],
    support: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'How It Works', href: '/how-it-works' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Disclaimer', href: '/disclaimer' },
    ],
};

const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Youtube', href: '#', icon: Youtube },
];

export default function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Car className="h-8 w-8 text-amber-500" />
                            <span className="text-2xl font-bold text-white">
                                LUXE<span className="text-amber-500">AUTO</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                            India&apos;s most trusted premium pre-owned car marketplace. Every car is
                            expert-verified for your peace of mind.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                <Phone className="h-4 w-4 text-amber-500" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                <Mail className="h-4 w-4 text-amber-500" />
                                <span>hello@luxeauto.in</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                <MapPin className="h-4 w-4 text-amber-500" />
                                <span>Mumbai, Maharashtra</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-amber-500 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-amber-500 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-amber-500 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} LuxeAuto. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                className="p-2 text-white/40 hover:text-amber-500 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <social.icon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
