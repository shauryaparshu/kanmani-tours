import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import GalleryAlbum from '@/components/gallery/GalleryAlbum';
import { formatTourDates } from '@/components/tours/tourDates';
import { pageOpenGraph } from '@/lib/site';

interface IndexMedia {
    type: 'image' | 'video';
    url: string;
}

interface IndexTour {
    slug: string;
    title: string;
    shortDescription?: string;
    startDate: string;
    endDate: string;
    media: IndexMedia[];
}

// public/assets/gallery-index.json is written by scripts/generate-gallery-index.mjs
// before every dev and build run. Only tours that have ended get a gallery.
async function findTour(slug: string): Promise<IndexTour | null> {
    try {
        const file = path.join(process.cwd(), 'public', 'assets', 'gallery-index.json');
        const data = JSON.parse(await readFile(file, 'utf8')) as { tours?: IndexTour[] };
        const tour = data.tours?.find((t) => t.slug === slug);
        if (!tour || !(new Date(tour.endDate) < new Date())) return null;
        return tour;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const [tour, t] = await Promise.all([findTour(slug), getTranslations({ locale, namespace: 'Gallery' })]);
    if (!tour) return {};
    const title = `${tour.title} — ${t('metaTitle')}`;
    const description = tour.shortDescription || t('metaDescription');
    return { title, description, openGraph: pageOpenGraph(title, description) };
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const [tour, t] = await Promise.all([findTour(slug), getTranslations({ locale, namespace: 'Gallery' })]);
    if (!tour) notFound();

    // Videos are not deployed (see .vercelignore), so the album shows photographs only.
    const photos = tour.media.filter((m) => m.type === 'image').map((m) => ({ url: m.url }));

    return (
        <>
            <main>
                <PageHeader
                    title={tour.title}
                    breadcrumbs={[
                        { href: '/', label: t('breadcrumbHome') },
                        { href: '/gallery', label: t('breadcrumbGallery') },
                        { label: tour.title },
                    ]}
                />
                <GalleryAlbum
                    title={tour.title}
                    dates={formatTourDates(tour.startDate, tour.endDate, locale)}
                    tourHref={`/india/tours/${tour.slug}`}
                    photos={photos}
                />
            </main>
            <FooterSection />
        </>
    );
}
