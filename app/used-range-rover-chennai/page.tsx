import BrowsePage from '../used-cars-chennai/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Used Range Rover Cars in Chennai | Torque',
    description: 'Browse premium verified pre-owned vehicles at Torque Chennai.',
};

export default function Page() {
    return <BrowsePage initialMake="Range Rover" />;
}
