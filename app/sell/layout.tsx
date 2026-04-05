import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sell Used & Luxury Car Chennai | Get Best Price Instantly',
    description: 'Sell your car in Chennai with best price, free valuation & quick payment. Hassle-free process with dealer support and doorstep inspection.',
    keywords: "sell car chennai, sell used car chennai, sell car for best price chennai, car valuation online chennai, park and sell car chennai, sell luxury car chennai, car exchange chennai, doorstep car evaluation chennai, sell car without middleman chennai, get instant cash for car chennai".split(", "),
    openGraph: {
        title: "Sell Car Chennai | Best Price & Instant Payment",
        description: "Sell your used or luxury car in Chennai easily. Get top value, instant offers, free inspection & hassle-free selling experience.",
    },
    twitter: {
        title: "Sell Car Chennai | Instant Cash & Best Deals",
        description: "Looking to sell your car in Chennai? Get best price, quick payment & smooth selling with expert dealer support.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
