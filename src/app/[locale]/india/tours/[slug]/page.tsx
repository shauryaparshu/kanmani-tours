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
    const { locale, slug: rawSlug } = await params;
    const slug = decodeSlug(rawSlug);
    const tour = await getTourBySlug(slug, locale);
    if (!tour || tour.destination !== 'india') return { title: 'Tour Not Found — Kanmani Tours' };

    const heroImage = tour.coverImage;

    return {
        title: `${tour.title} — Kanmani Tours`,
        description: tour.shortDescription,
        openGraph: {
            title: tour.title,
            description: tour.shortDescription,
            images: [{ url: heroImage || '/assets/og-default.jpg' }],
        },
        alternates: pageAlternates(locale, `/india/tours/${encodeURIComponent(slug)}`),
    };
}

export default async function TourDetailPage({ params }: PageProps) {
    const { locale, slug: rawSlug } = await params;
    setRequestLocale(locale);
    const slug = decodeSlug(rawSlug);
    const [tour, allTours] = await Promise.all([
        getTourBySlug(slug, locale),
        getToursByDestination('india', locale)
    ]);

    if (!tour || tour.destination !== 'india') notFound();

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
