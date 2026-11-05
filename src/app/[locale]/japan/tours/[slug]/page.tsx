import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { decodeSlug, getTourBySlug, getToursByDestination } from '@/lib/tours';
import Footer from '@/components/layout/FooterSection';
import TourDetail from '@/components/tours/detail/TourDetail';
import { selectJourneys } from '@/components/tours/selectJourneys';
import { pageAlternates } from '@/lib/site';
import { setRequestLocale } from 'next-intl/server';

// Static with incremental regeneration: Sanity edits appear within 60 seconds.
export const revalidate = 60;

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
    const { locale, slug: rawSlug } = await params;
    const slug = decodeSlug(rawSlug);
    if (locale === 'ja') return { title: 'Tour Not Found — Kanmani Tours' };

    const tour = await getTourBySlug(slug, locale);
    if (!tour || tour.destination !== 'japan') return { title: 'Tour Not Found — Kanmani Tours' };

    const heroImage = tour.coverImage;

    return {
        title: `${tour.title} — Kanmani Tours`,
        description: tour.shortDescription,
        openGraph: {
            title: tour.title,
            description: tour.shortDescription,
            images: [{ url: heroImage || '/assets/og-default.jpg' }],
        },
        alternates: pageAlternates(locale, `/japan/tours/${encodeURIComponent(slug)}`, { englishOnly: true }),
    };
}

export default async function JapanTourDetailPage({ params }: PageProps) {
    const { locale, slug: rawSlug } = await params;
    setRequestLocale(locale);
    const slug = decodeSlug(rawSlug);

    // Japan tours must never render in Japanese under any circumstance
    if (locale === 'ja') {
        notFound();
    }

    const [tour, allTours] = await Promise.all([
        getTourBySlug(slug, locale),
        getToursByDestination('japan', locale)
    ]);

    if (!tour || tour.destination !== 'japan') notFound();

    const moreTours = selectJourneys(allTours, 4, tour.slug);

    return (
        <>
            <main>
                <TourDetail tour={tour} moreTours={moreTours} />
            </main>
            <Footer />
        </>
    );
}
