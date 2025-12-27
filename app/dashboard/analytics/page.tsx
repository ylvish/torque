'use client';

import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Users,
    Car,
    FileText,
    DollarSign
} from 'lucide-react';

const metrics = [
    { label: 'Total Submissions', value: 156, change: '+12%', trend: 'up', icon: FileText },
    { label: 'Approval Rate', value: '78%', change: '+5%', trend: 'up', icon: BarChart3 },
    { label: 'Active Listings', value: 48, change: '+8', trend: 'up', icon: Car },
    { label: 'Total Leads', value: 234, change: '+23%', trend: 'up', icon: Users },
    { label: 'Lead Conversion', value: '18%', change: '-2%', trend: 'down', icon: TrendingUp },
    { label: 'Avg. Response Time', value: '2.4h', change: '-15%', trend: 'up', icon: PieChart },
];

const topMakes = [
    { make: 'BMW', count: 24, percentage: 20 },
    { make: 'Mercedes-Benz', count: 22, percentage: 18 },
    { make: 'Audi', count: 18, percentage: 15 },
    { make: 'Toyota', count: 15, percentage: 12 },
    { make: 'Hyundai', count: 14, percentage: 11 },
    { make: 'Maruti Suzuki', count: 12, percentage: 10 },
];

const recentSales = [
    { car: '2021 BMW 3 Series', price: 4500000, buyer: 'Rahul M.', date: 'Jan 18' },
    { car: '2022 Mercedes C-Class', price: 5200000, buyer: 'Priya S.', date: 'Jan 15' },
    { car: '2021 Toyota Fortuner', price: 3800000, buyer: 'Amit K.', date: 'Jan 12' },
    { car: '2023 Hyundai Creta', price: 1850000, buyer: 'Sneha V.', date: 'Jan 10' },
];

export default function AnalyticsPage() {
    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(1)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(1)} L`;
        }
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-white/50">Track performance and key metrics</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="bg-zinc-900 border border-white/5 rounded-xl p-5"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-lg bg-amber-500/10">
                                <metric.icon className="h-5 w-5 text-amber-500" />
                            </div>
                            <span className={`flex items-center gap-1 text-sm ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {metric.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                        <div className="text-sm text-white/50">{metric.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Makes */}
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Top Makes by Listings</h3>
                    <div className="space-y-4">
                        {topMakes.map((item) => (
                            <div key={item.make}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-white/80">{item.make}</span>
                                    <span className="text-white/50 text-sm">{item.count} cars</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                                        style={{ width: `${item.percentage * 5}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Funnel */}
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Lead Funnel</h3>
                    <div className="space-y-3">
                        {[
                            { stage: 'Total Leads', value: 234, percentage: 100 },
                            { stage: 'Contacted', value: 180, percentage: 77 },
                            { stage: 'Test Drives', value: 95, percentage: 41 },
                            { stage: 'Negotiating', value: 52, percentage: 22 },
                            { stage: 'Closed Won', value: 42, percentage: 18 },
                        ].map((stage, index) => (
                            <div key={stage.stage} className="flex items-center gap-4">
                                <div className="w-28 text-sm text-white/60">{stage.stage}</div>
                                <div className="flex-1 h-8 bg-white/5 rounded overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 flex items-center"
                                        style={{ width: `${stage.percentage}%` }}
                                    >
                                        <span className="absolute left-3 text-sm font-medium text-white">{stage.value}</span>
                                    </div>
                                </div>
                                <div className="w-12 text-right text-sm text-white/50">{stage.percentage}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-zinc-900 border border-white/5 rounded-xl">
                <div className="p-4 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-white">Recent Sales</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {recentSales.map((sale, index) => (
                        <div key={index} className="flex items-center justify-between p-4">
                            <div>
                                <p className="font-medium text-white">{sale.car}</p>
                                <p className="text-sm text-white/50">Buyer: {sale.buyer}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-amber-500">{formatPrice(sale.price)}</p>
                                <p className="text-sm text-white/40">{sale.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
                    <DollarSign className="h-8 w-8 text-emerald-500 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">₹2.4 Cr</div>
                    <div className="text-sm text-white/60">Total Revenue This Month</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
                    <Car className="h-8 w-8 text-blue-500 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">12</div>
                    <div className="text-sm text-white/60">Cars Sold This Month</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                    <Users className="h-8 w-8 text-purple-500 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">89</div>
                    <div className="text-sm text-white/60">New Leads This Month</div>
                </div>
            </div>
        </div>
    );
}
