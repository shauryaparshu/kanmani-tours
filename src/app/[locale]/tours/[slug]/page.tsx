import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTours, getTourBySlug } from '@/lib/tours';
import { getLatestImage } from '@/lib/server-images';
import TopBar from '@/components/layout/TopBar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import TourDetailClient from './TourDetailClient';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

// Generate all static slugs at build time
export async function generateStaticParams() {
    const tours = await getAllTours();
    const locales = ['en', 'ja'];

    const params: { locale: string; slug: string }[] = [];
    locales.forEach(locale => {
        tours.forEach(tour => {
            params.push({ locale, slug: tour.slug });
        });
    });

    return params;
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
    const { locale, slug } = await params;
    const tour = await getTourBySlug(slug, locale);

    if (!tour) notFound();

    // Other upcoming tours (exclude current)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allTours = await getAllTours(locale);
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
