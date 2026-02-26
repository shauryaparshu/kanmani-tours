import { client } from '@/sanity/lib/client';
import { CELEBRITIES_QUERY } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

export interface Celebrity {
    id: string;
    name: string;
    photo: string;
    orderRank?: string;
}

function resolveImageUrl(image: any): string {
    if (!image) return '';
    if (typeof image === 'string') return image;
    try {
        const url = urlForImage(image)?.url();
        return url || '';
    } catch (e) {
        return '';
    }
}

export async function getAllCelebrities(locale: string = 'ja'): Promise<Celebrity[]> {
    const isJa = locale === 'ja';
    try {
        const sanityCelebrities = await client.fetch(CELEBRITIES_QUERY, {}, { next: { revalidate: 60 } });
        if (sanityCelebrities && sanityCelebrities.length > 0) {
            return sanityCelebrities.map((c: any) => ({
                id: c._id,
                name: (isJa && c.name_ja) ? c.name_ja : c.name,
                photo: resolveImageUrl(c.photo),
                orderRank: c.orderRank
            }));
        }
    } catch (error) {
        console.error('Error fetching celebrities from Sanity:', error);
    }

    return [];
}
