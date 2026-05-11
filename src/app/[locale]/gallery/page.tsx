import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { GALLERY_QUERY } from '@/sanity/lib/queries';
import Navigation from '@/components/layout/Navigation';
import FooterSection from '@/components/layout/FooterSection';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
    title: 'Tour Gallery — Srikan Tours',
    description: 'Relive the magic of our past tours. Explore photo galleries from celebrity encounters, cultural festivals, and culinary adventures across India.',
};

export default async function GalleryPage() {
    const rawTours = await client.fetch(GALLERY_QUERY);

    const processedTours = rawTours.map((tour: any) => {
        const images: string[] = [];
        
        if (tour.coverImage?.asset?.url) {
            images.push(tour.coverImage.asset.url);
        }
        
        if (Array.isArray(tour.galleryImages)) {
            tour.galleryImages.forEach((img: any) => {
                if (img?.asset?.url) {
                    images.push(img.asset.url);
                }
            });
        }

        return {
            id: tour._id,
            title: tour.title,
            slug: tour.slug,
            category: tour.category,
            startDate: tour.startDate,
            images
        };
    }).filter((tour: any) => tour.images.length > 0);

    return (
        <>
            <Navigation />
            <main>
                <GalleryPageClient tours={processedTours} />
            </main>
            <FooterSection />
        </>
    );
}
