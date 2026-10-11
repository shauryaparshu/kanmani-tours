import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { galleryImageUrl, cardImageUrl, fullResolutionImageUrl } from '@/sanity/lib/image';
import FooterSection from '@/components/layout/FooterSection';
import MemoriesGalleryClient, { TourDayData, MemoriesPhoto } from './MemoriesGalleryClient';

export const metadata: Metadata = {
    title: 'Tour Memories — Kanmani Tours',
    description: 'Private guest photo gallery archive.',
    robots: {
        index: false,
        follow: false,
    },
};

const TOUR_DAYS_QUERY = `
  *[_type == "tourDay"] | order(date asc) {
    _id,
    title,
    date,
    photos[] {
      _key,
      caption,
      featured,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            lqip
          }
        }
      }
    }
  }
`;

export default async function MemoriesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Memories gallery is English-only
    if (locale !== 'en') {
        notFound();
    }

    // Password-gated auth check via httpOnly cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('memories_access')?.value;
    const expectedToken = process.env.MEMORIES_SESSION_TOKEN;

    if (!expectedToken || !token || token !== expectedToken) {
        redirect('/en/memories-login');
    }

    // Fetch tourDay documents from Sanity
    let rawDays: any[] = [];
    try {
        rawDays = await client.fetch(TOUR_DAYS_QUERY);
    } catch (err) {
        console.error('Error fetching tourDay documents from Sanity:', err);
    }

    const processedDays: TourDayData[] = (rawDays || []).map((day: any) => {
        const photos: MemoriesPhoto[] = [];

        if (Array.isArray(day.photos)) {
            day.photos.forEach((item: any, idx: number) => {
                let fullUrl = '';
                let thumbUrl = '';
                const lqip = item.image?.asset?.metadata?.lqip;

                try {
                    if (item.image) {
                        fullUrl = fullResolutionImageUrl(item.image) || item.image?.asset?.url || '';
                        thumbUrl = cardImageUrl(item.image) || fullUrl;
                    }
                } catch {
                    fullUrl = item.image?.asset?.url || '';
                    thumbUrl = fullUrl;
                }

                if (fullUrl) {
                    photos.push({
                        id: item._key || `${day._id}-photo-${idx}`,
                        url: fullUrl,
                        thumbnailUrl: thumbUrl || fullUrl,
                        lqip,
                        caption: item.caption,
                        featured: !!item.featured,
                    });
                }
            });
        }

        return {
            id: day._id,
            title: day.title || 'Untitled Tour Day',
            date: day.date || '',
            photos,
        };
    });

    return (
        <>
            <main>
                <MemoriesGalleryClient days={processedDays} />
            </main>
            <FooterSection />
        </>
    );
}
