import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Buy Used Cars in Chennai | Certified & Luxury Cars',
    description: 'Browse used & luxury cars in Chennai. Explore certified, low mileage, single-owner cars with warranty from trusted dealers near you.',
    keywords: "used cars chennai, second hand cars chennai, torque cars inventory chennai, certified used cars chennai, used luxury cars chennai, used car showroom chennai, used cars under 20 lakh chennai, used bmw mercedes audi chennai, low mileage used car chennai, used car dealers in chennai".split(", "),
    openGraph: {
        title: "Used Cars Chennai | Browse Luxury Car Inventory",
        description: "Explore a wide range of used & luxury cars in Chennai. Certified vehicles, best prices & premium brands like BMW, Audi & Mercedes.",
    },
    twitter: {
        title: "Used Cars Chennai | Luxury Inventory",
        description: "Find certified used & luxury cars in Chennai. Browse BMW, Audi, Mercedes & more with best deals and trusted showroom experience.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
