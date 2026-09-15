import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTourBySlug, getToursByDestination } from '@/lib/tours';
import Footer from '@/components/layout/FooterSection';
import TourDetailClient from '@/components/TourDetailClient';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

// Generate all static slugs for India tours at build time
export async function generateStaticParams() {
    const tours = await getToursByDestination('india');
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
    const { locale, slug } = await params;
    const tour = await getTourBySlug(slug, locale);
    if (!tour || tour.destination !== 'india') return { title: 'Tour Not Found — Srikan Tours' };

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
    const [tour, allTours] = await Promise.all([
        getTourBySlug(slug, locale),
        getToursByDestination('india', locale)
    ]);

    if (!tour || tour.destination !== 'india') notFound();

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
