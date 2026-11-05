import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { GALLERY_QUERY } from '@/sanity/lib/queries';
import { galleryImageUrl } from '@/sanity/lib/image';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import GalleryEvents, { type GalleryEvent } from '@/components/gallery/GalleryEvents';
import type { GalleryPhoto } from '@/components/tours/detail/TourGallery';
import { formatTourDates } from '@/components/tours/tourDates';
import { getAllCategories } from '@/lib/categories';
import { localizeCategories } from '@/components/tours/categoryLabels';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

// Static with incremental regeneration: Sanity edits appear within 60 seconds.
export const revalidate = 60;

interface GalleryImage {
    asset?: { url?: string; metadata?: { lqip?: string } };
}

interface GalleryTour {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    startDate: string;
    endDate?: string;
    coverImage?: GalleryImage;
    galleryImages?: GalleryImage[];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Gallery' });
    const title = t('metaTitle');
    const description = t('metaDescription');
    return {
        alternates: pageAlternates(locale, '/gallery'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

function toPhoto(image: GalleryImage | undefined): GalleryPhoto | null {
    if (!image?.asset) return null;
    let url = '';
    try {
        url = galleryImageUrl(image);
    } catch {
        url = image.asset.url ?? '';
    }
    return url ? { url, lqip: image.asset.metadata?.lqip } : null;
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const [tours, allCategories, t, tTours] = await Promise.all([
        client.fetch<GalleryTour[]>(GALLERY_QUERY),
        getAllCategories(locale),
        getTranslations({ locale, namespace: 'Gallery' }),
        getTranslations({ locale, namespace: 'Tours' }),
    ]);
    const categories = localizeCategories(allCategories, locale, tTours);

    const events: GalleryEvent[] = (tours ?? [])
        .map((tour) => {
            // The cover first, then the gallery, each picture once.
            const seen = new Set<string>();
            const photos = [tour.coverImage, ...(tour.galleryImages ?? [])]
                .map(toPhoto)
                .filter((photo): photo is GalleryPhoto => !!photo && !seen.has(photo.url) && !!seen.add(photo.url));
            return {
                id: tour._id,
                title: tour.title,
                href: `/india/tours/${tour.slug}`,
                category: tour.category,
                categoryLabel: categories.find((c) => c.key === tour.category)?.label,
                dates: formatTourDates(tour.startDate, tour.endDate ?? tour.startDate, locale),
                photos,
            };
        })
        .filter((event) => event.photos.length > 0);

    return (
        <>
            <main>
                <PageHeader
                    title={t('title')}
                    lead={t('subtitle')}
                    breadcrumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: t('breadcrumbGallery') }]}
                />
                <GalleryEvents events={events} />
            </main>
            <FooterSection />
        </>
    );
}
