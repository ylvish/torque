import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Park & Sell Used Cars in Chennai | Quick & Easy Sale',
    description: 'Sell your car in Chennai with Torque Park & Sell. Get best price, free valuation, doorstep inspection & hassle-free dealer sale with quick payment.',
    keywords: "sell car chennai, torque park and sell service chennai, sell used car chennai, sell car for best price chennai, sell luxury car chennai, car valuation online chennai, park and sell car chennai, car exchange chennai, sell car without middleman chennai, doorstep car evaluation chennai".split(", "),
    openGraph: {
        title: "Sell Car Chennai | Park & Sell Service",
        description: "Get the best price for your car in Chennai with Torque's Park & Sell service. Free valuation, showroom display & quick hassle-free sale.",
    },
    twitter: {
        title: "Sell Your Car Chennai | Best Price Guaranteed",
        description: "Sell your used or luxury car in Chennai easily. Get top value, instant offers & smooth dealer-assisted selling with Torque Park & Sell.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
