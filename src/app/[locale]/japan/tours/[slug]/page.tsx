import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTourBySlug, getToursByDestination } from '@/lib/tours';
import Footer from '@/components/layout/FooterSection';
import TourDetailClient from '@/components/TourDetailClient';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

// Generate all static slugs for Japan tours at build time (English only)
export async function generateStaticParams() {
    const tours = await getToursByDestination('japan');
    
    return tours.map(tour => ({
        locale: 'en',
        slug: tour.slug,
    }));
}

// Dynamic SEO metadata per tour
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    if (locale === 'ja') return { title: 'Tour Not Found — Srikan Tours' };

    const tour = await getTourBySlug(slug, locale);
    if (!tour || tour.destination !== 'japan') return { title: 'Tour Not Found — Srikan Tours' };

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

export default async function JapanTourDetailPage({ params }: PageProps) {
    const { locale, slug } = await params;

    // Japan tours must never render in Japanese under any circumstance
    if (locale === 'ja') {
        notFound();
    }

    const [tour, allTours] = await Promise.all([
        getTourBySlug(slug, locale),
        getToursByDestination('japan', locale)
    ]);

    if (!tour || tour.destination !== 'japan') notFound();

    // Other upcoming tours (exclude current)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const otherTours = allTours
        .filter(t => {
            const start = new Date(t.startDate);
            start.setHours(0, 0, 0, 0);
            return t.slug !== slug && start > today;
        })
        .slice(0, 3);

    return (
        <>
            <main style={{ paddingBottom: '80px' }}>
                <TourDetailClient tour={tour} otherTours={otherTours} />
            </main>
            <Footer />
        </>
    );
}
