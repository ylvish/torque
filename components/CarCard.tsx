'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fuel, Gauge, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Listing, FuelType, TransmissionType } from '@/types';

interface CarCardProps {
    listing: Listing;
    index?: number;
}

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

export default function CarCard({ listing, index = 0 }: CarCardProps) {
    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} L`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const formatMileage = (km: number) => {
        if (km >= 100000) {
            return `${(km / 100000).toFixed(1)} L km`;
        }
        return `${(km / 1000).toFixed(0)}k km`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group"
        >
            <Link href={`/cars/${listing.id}`}>
                <div className="relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                            src={listing.featured_image_url || '/placeholder-car.jpg'}
                            alt={`${listing.make} ${listing.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Verified Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            <span className="text-xs font-medium text-white">Verified</span>
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-3 right-3">
                            <div className="px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
                                <span className="text-lg font-bold text-amber-500">{formatPrice(listing.price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-500 transition-colors">
                            {listing.year} {listing.make} {listing.model}
                        </h3>
                        {listing.variant && (
                            <p className="text-sm text-white/50 mb-3">{listing.variant}</p>
                        )}

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Gauge className="h-4 w-4 text-amber-500/70" />
                                <span>{formatMileage(listing.mileage)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Fuel className="h-4 w-4 text-amber-500/70" />
                                <span>{fuelTypeLabels[listing.fuel_type]}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Calendar className="h-4 w-4 text-amber-500/70" />
                                <span>{listing.year}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <MapPin className="h-4 w-4 text-amber-500/70" />
                                <span>{listing.registration_city}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 text-xs bg-white/5 text-white/60 rounded">
                                {transmissionLabels[listing.transmission]}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-white/5 text-white/60 rounded">
                                {listing.owners} Owner{listing.owners > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
