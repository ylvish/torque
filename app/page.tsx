'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  Users,
  Car,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Clock,
  ThumbsUp
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import CarCard from '@/components/CarCard';
import { Listing, FuelType, TransmissionType, ListingStatus } from '@/types';

import { getListings } from '@/lib/actions';

// Initial empty state
const initialListings: Listing[] = [];

const stats = [
  { value: '5000+', label: 'Cars Sold', icon: Car },
  { value: '98%', label: 'Happy Customers', icon: ThumbsUp },
  { value: '150+', label: 'Expert Staff', icon: Users },
  { value: '24hrs', label: 'Avg. Response', icon: Clock },
];

const trustFeatures = [
  {
    icon: Shield,
    title: '200-Point Inspection',
    description: 'Every car undergoes rigorous multi-point inspection by our certified experts.',
  },
  {
    icon: Award,
    title: 'Verified History',
    description: 'Complete service records, ownership history, and accident reports verified.',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Guarantee',
    description: '7-day money-back guarantee if the car doesn\'t meet your expectations.',
  },
];

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>(initialListings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      // Fetch 4 latest ACTIVE listings
      const data = await getListings('ACTIVE', 4);
      setFeaturedListings(data as Listing[]);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 lg:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Star className="h-4 w-4 fill-amber-500" />
              Trusted by 50,000+ Customers
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Find Your Perfect
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Pre-Owned Car
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-10">
              Chennai's most trusted marketplace. Every car is expert-verified.
              Experience the premium way to buy pre-owned cars.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Suspense fallback={<div className="h-16 bg-white/10 rounded-2xl animate-pulse" />}>
              <SearchBar variant="hero" />
            </Suspense>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-amber-500/10 rounded-xl">
                  <stat.icon className="h-6 w-6 text-amber-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-amber-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Features */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-amber-500">Torque</span>?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We bring transparency, trust, and premium service to the pre-owned car market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group p-8 bg-zinc-900 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-6 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Featured <span className="text-amber-500">Listings</span>
              </h2>
              <p className="text-white/60">Hand-picked premium cars, verified and ready for you.</p>
            </div>
            <Link
              href="/browse"
              className="hidden md:flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] bg-zinc-900 border border-white/5 rounded-2xl animate-pulse" />
              ))
            ) : featuredListings.map((listing, index) => (
              <CarCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 text-amber-500 border border-amber-500/30 rounded-full hover:bg-amber-500/10 transition-colors"
            >
              View All Cars <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sell Your Car CTA */}
      <section className="py-20 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-500 rounded-3xl p-8 md:p-12 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                  Want to Sell Your Car?
                </h2>
                <p className="text-black/70 text-lg mb-8">
                  Submit your car details. Our experts will review, verify, and help you
                  get the best price. No hassle, complete transparency.
                </p>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-zinc-800 transition-colors"
                >
                  Sell Your Car <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full" />
                  <div className="relative bg-black/10 backdrop-blur border border-black/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">1</span>
                      </div>
                      <span className="text-black font-medium">Submit car details</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">2</span>
                      </div>
                      <span className="text-black font-medium">Expert verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">3</span>
                      </div>
                      <span className="text-black font-medium">Get the best price</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
