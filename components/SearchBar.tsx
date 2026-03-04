'use client';

import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const popularMakes = [
    'All Makes',
    'Maruti Suzuki',
    'Hyundai',
    'Honda',
    'Toyota',
    'Mahindra',
    'Tata',
    'BMW',
    'Mercedes-Benz',
    'Audi',
];

const fuelTypes = [
    'All Fuels',
    'Petrol',
    'Diesel',
    'Electric',
    'Hybrid',
    'CNG',
];

const priceRanges = [
    { label: 'Any Price', min: 0, max: 0 },
    { label: 'Under ₹5 Lakh', min: 0, max: 500000 },
    { label: '₹5-10 Lakh', min: 500000, max: 1000000 },
    { label: '₹10-20 Lakh', min: 1000000, max: 2000000 },
    { label: '₹20-50 Lakh', min: 2000000, max: 5000000 },
    { label: 'Above ₹50 Lakh', min: 5000000, max: 0 },
];

interface SearchBarProps {
    variant?: 'hero' | 'sticky';
}

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [make, setMake] = useState(searchParams.get('make') || 'All Makes');
    const [priceRange, setPriceRange] = useState(priceRanges[0]);
    const [fuelType, setFuelType] = useState(searchParams.get('fuel') || 'All Fuels');
    const [isMakeOpen, setIsMakeOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isFuelOpen, setIsFuelOpen] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (make !== 'All Makes') params.set('make', make);
        if (fuelType !== 'All Fuels') params.set('fuel', fuelType);
        if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
        if (priceRange.max > 0) params.set('maxPrice', priceRange.max.toString());

        router.push(`/browse?${params.toString()}`);
    };

    const isHero = variant === 'hero';

    return (
        <div className={`w-full ${isHero ? 'max-w-4xl mx-auto' : ''}`}>
            <div className={`
        flex flex-col lg:flex-row gap-3 p-3 lg:p-2 
        ${isHero
                    ? 'bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-full'
                    : 'bg-zinc-900 border border-white/10 rounded-xl'
                }
      `}>
                {/* Make Dropdown */}
                <div className="relative flex-1">
                    <button
                        onClick={() => { setIsMakeOpen(!isMakeOpen); setIsPriceOpen(false); setIsFuelOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="truncate">{make}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isMakeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {isMakeOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-50 top-full mt-2 left-0 w-full lg:w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                            >
                                {popularMakes.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => { setMake(m); setIsMakeOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${make === m ? 'text-red-400 bg-red-500/10' : 'text-white/80'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-white/10" />

                {/* Price Dropdown */}
                <div className="relative flex-1">
                    <button
                        onClick={() => { setIsPriceOpen(!isPriceOpen); setIsMakeOpen(false); setIsFuelOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="truncate">{priceRange.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {isPriceOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-50 top-full mt-2 left-0 w-full lg:w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                            >
                                {priceRanges.map((range) => (
                                    <button
                                        key={range.label}
                                        onClick={() => { setPriceRange(range); setIsPriceOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${priceRange.label === range.label ? 'text-red-400 bg-red-500/10' : 'text-white/80'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-white/10" />

                {/* Fuel Dropdown */}
                <div className="relative flex-1">
                    <button
                        onClick={() => { setIsFuelOpen(!isFuelOpen); setIsMakeOpen(false); setIsPriceOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="truncate">{fuelType}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isFuelOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {isFuelOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-50 top-full mt-2 left-0 w-full lg:w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                            >
                                {fuelTypes.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => { setFuelType(f); setIsFuelOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${fuelType === f ? 'text-red-400 bg-red-500/10' : 'text-white/80'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full lg:rounded-full hover:shadow-lg hover:shadow-red-600/25 hover:bg-red-700 transition-all"
                >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                </button>
            </div>
        </div >
    );
}
