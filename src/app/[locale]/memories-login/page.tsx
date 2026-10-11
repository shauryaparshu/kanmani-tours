import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MemoriesLoginForm from './MemoriesLoginForm';

export const metadata: Metadata = {
    title: 'Tour Memories Login — Kanmani Tours',
    description: 'Private guest photo gallery access.',
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
