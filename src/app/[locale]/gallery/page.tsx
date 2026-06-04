import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { GALLERY_QUERY } from '@/sanity/lib/queries';
import FooterSection from '@/components/layout/FooterSection';
import GalleryPageClient from './GalleryPageClient';
import { galleryImageUrl } from '@/sanity/lib/image';

export const metadata: Metadata = {
    title: 'Tour Gallery — Srikan Tours',
    description: 'Relive the magic of our past tours. Explore photo galleries from celebrity encounters, cultural festivals, and culinary adventures across India.',
};

export default async function GalleryPage() {
    const rawTours = await client.fetch(GALLERY_QUERY);

    const processedTours = rawTours.map((tour: any) => {
        const images: { url: string; lqip?: string }[] = [];
        
        if (tour.coverImage) {
            try {
                const url = galleryImageUrl(tour.coverImage);
                if (url) {
                    images.push({ 
                        url, 
                        lqip: tour.coverImage.asset?.metadata?.lqip 
                    });
                }
            } catch {
                if (tour.coverImage.asset?.url) {
                    images.push({ 
                        url: tour.coverImage.asset.url, 
                        lqip: tour.coverImage.asset?.metadata?.lqip 
                    });
                }
            }
        }
        
        if (Array.isArray(tour.galleryImages)) {
            tour.galleryImages.forEach((img: any) => {
                try {
                    const url = galleryImageUrl(img);
                    if (url) {
                        images.push({ 
                            url, 
                            lqip: img?.asset?.metadata?.lqip 
                        });
                    }
                } catch {
                    if (img?.asset?.url) {
                        images.push({ 
                            url: img.asset.url, 
                            lqip: img?.asset?.metadata?.lqip 
                        });
                    }
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
            <main>
                <GalleryPageClient tours={processedTours} />
            </main>
            <FooterSection />
        </>
    );
}
