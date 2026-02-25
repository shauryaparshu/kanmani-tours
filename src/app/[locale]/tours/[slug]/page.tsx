import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTours, getTourBySlug } from '@/lib/tours';
import { getLatestImage } from '@/lib/server-images';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import TourDetailClient from './TourDetailClient';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate all static slugs at build time
export async function generateStaticParams() {
    const tours = await getAllTours();
    return tours.map(tour => ({ slug: tour.slug }));
}

// Dynamic SEO metadata per tour
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);
    if (!tour) return { title: 'Tour Not Found — Srikan Tours' };

    const heroImage = tour.coverImage;

    return {
        title: `${tour.title} — Srikan Tours`,
        description: tour.shortDescription,
        openGraph: {
            title: tour.title,
            description: tour.shortDescription,
            images: heroImage ? [{ url: heroImage }] : [],
        },
    };
}

export default async function TourDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);

    if (!tour) notFound();

    // Other upcoming tours (exclude current)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allTours = await getAllTours();
    const otherTours = allTours
        .filter(t => {
            const start = new Date(t.startDate);
            start.setHours(0, 0, 0, 0);
            return t.slug !== slug && start > today;
        })
        .slice(0, 3);

    return (
        <>
            <TopBar />
            <Navigation />
            <main style={{ paddingBottom: '80px' }}>
                <TourDetailClient tour={tour} otherTours={otherTours} />
            </main>
            <Footer />
        </>
    );
}
