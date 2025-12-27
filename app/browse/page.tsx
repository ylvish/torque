'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import CarCard from '@/components/CarCard';
import { Listing, FuelType, TransmissionType, ListingStatus } from '@/types';
import { getListings } from '@/lib/actions';

// Initial empty state
const initialListings: Listing[] = [];

const popularMakes = ['All', 'BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Hyundai', 'Maruti Suzuki', 'Honda', 'Mahindra', 'Tata'];
const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const transmissionTypes = ['All', 'Automatic', 'Manual'];
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'mileage_asc', label: 'Mileage: Low to High' },
];

export default function BrowsePage() {
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMake, setSelectedMake] = useState('All');
    const [selectedFuel, setSelectedFuel] = useState('All');
    const [selectedTransmission, setSelectedTransmission] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            // Fetch only ACTIVE status listings
            const data = await getListings('ACTIVE');
            setListings(data as Listing[]);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter listings based on selections
    const filteredListings = listings.filter((listing) => {
        if (selectedMake !== 'All' && listing.make !== selectedMake) return false;
        if (selectedFuel !== 'All' && fuelTypes.indexOf(selectedFuel) !== fuelTypes.indexOf('All')) {
            const fuelMap: Record<string, FuelType> = {
                'Petrol': FuelType.PETROL,
                'Diesel': FuelType.DIESEL,
                'Electric': FuelType.ELECTRIC,
                'Hybrid': FuelType.HYBRID,
                'CNG': FuelType.CNG,
            };
            if (listing.fuel_type !== fuelMap[selectedFuel]) return false;
        }
        if (selectedTransmission !== 'All') {
            const transMap: Record<string, TransmissionType> = {
                'Automatic': TransmissionType.AUTOMATIC,
                'Manual': TransmissionType.MANUAL,
            };
            if (listing.transmission !== transMap[selectedTransmission]) return false;
        }
        if (listing.price < priceRange[0] || listing.price > priceRange[1]) return false;
        return true;
    });

    // Sort listings
    const sortedListings = [...filteredListings].sort((a, b) => {
        switch (sortBy) {
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            case 'mileage_asc': return a.mileage - b.mileage;
            default: return 0;
        }
    });

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <div className="bg-zinc-900/50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Browse <span className="text-amber-500">Verified Cars</span>
                    </h1>
                    <p className="text-white/60">
                        {sortedListings.length} cars available
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search & Controls */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Suspense fallback={<div className="h-14 bg-zinc-900/50 rounded-xl animate-pulse" />}>
                            <SearchBar variant="sticky" />
                        </Suspense>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white/80 hover:text-white"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white/80 focus:outline-none focus:border-amber-500/50"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* View Mode Toggle */}
                        <div className="hidden sm:flex items-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 ${viewMode === 'grid' ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 hover:text-white'}`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 ${viewMode === 'list' ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 hover:text-white'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className={`
            ${showFilters ? 'fixed inset-0 z-50 bg-black/80 lg:relative lg:inset-auto lg:bg-transparent' : 'hidden lg:block'}
          `}>
                        <div className={`
              ${showFilters ? 'absolute right-0 top-0 h-full w-80 bg-zinc-900 p-6 overflow-y-auto' : ''}
              lg:relative lg:w-64 lg:p-0 lg:bg-transparent
            `}>
                            {/* Mobile Close Button */}
                            {showFilters && (
                                <div className="flex items-center justify-between mb-6 lg:hidden">
                                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                                    <button onClick={() => setShowFilters(false)} className="p-2 text-white/60 hover:text-white">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Make Filter */}
                                <div>
                                    <h4 className="text-sm font-medium text-white/80 mb-3">Make</h4>
                                    <div className="space-y-2">
                                        {popularMakes.map((make) => (
                                            <button
                                                key={make}
                                                onClick={() => setSelectedMake(make)}
                                                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedMake === make
                                                    ? 'bg-amber-500/20 text-amber-500'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {make}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fuel Type Filter */}
                                <div>
                                    <h4 className="text-sm font-medium text-white/80 mb-3">Fuel Type</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {fuelTypes.map((fuel) => (
                                            <button
                                                key={fuel}
                                                onClick={() => setSelectedFuel(fuel)}
                                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedFuel === fuel
                                                    ? 'bg-amber-500 text-black'
                                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {fuel}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Transmission Filter */}
                                <div>
                                    <h4 className="text-sm font-medium text-white/80 mb-3">Transmission</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {transmissionTypes.map((trans) => (
                                            <button
                                                key={trans}
                                                onClick={() => setSelectedTransmission(trans)}
                                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedTransmission === trans
                                                    ? 'bg-amber-500 text-black'
                                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {trans}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="text-sm font-medium text-white/80 mb-3">Price Range</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000000"
                                            step="100000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full accent-amber-500"
                                        />
                                        <div className="flex justify-between text-sm text-white/60">
                                            <span>₹0</span>
                                            <span>₹{(priceRange[1] / 100000).toFixed(0)} L</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Filters */}
                                <button
                                    onClick={() => {
                                        setSelectedMake('All');
                                        setSelectedFuel('All');
                                        setSelectedTransmission('All');
                                        setPriceRange([0, 10000000]);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-amber-500 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : sortedListings.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {sortedListings.map((listing, index) => (
                                    <CarCard key={listing.id} listing={listing} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                                    <Filter className="h-8 w-8 text-white/40" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
                                <p className="text-white/60">Try adjusting your filters to find more cars.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
