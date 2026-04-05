import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Torque Cars Chennai | Buy, Sell & Luxury Car Service',
    description: 'Contact Torque Cars Chennai showroom in Kilpauk. Visit for trusted used cars, expert assistance & luxury car services. Call or enquire today.',
    keywords: "contact torque cars chennai, torque cars chennai, the torque chennai, torque cars showroom kilpauk, torque used cars kilpauk chennai, trusted used car showroom chennai, best used car dealer chennai, used car showroom chennai, luxury car service centre chennai, car service centre kilpauk chenna".split(", "),
    openGraph: {
        title: "Contact Torque Cars Chennai | Visit Our Showroom",
        description: "Get in touch with Torque Cars Chennai. Visit our Kilpauk showroom for premium used cars, expert support & luxury car services.",
    },
    twitter: {
        title: "Contact Torque Cars Chennai",
        description: "Reach Torque Cars Chennai for trusted used cars & services. Visit our Kilpauk showroom or connect with our team today.",
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
