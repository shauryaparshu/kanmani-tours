import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOUR_GROUP } from '@/lib/tourGroup';
import MemoriesLoginForm from './MemoriesLoginForm';

export const metadata: Metadata = {
    title: `Japan Tour ${TOUR_GROUP.dateLabel} | ${TOUR_GROUP.schoolName}`,
    description: `Private guest photo gallery access for ${TOUR_GROUP.schoolName}.`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function MemoriesLoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Memories login is English-only; return 404 for any other locale
    if (locale !== 'en') {
        notFound();
    }

    return <MemoriesLoginForm />;
}
