import { client } from '@/sanity/lib/client';
import { COUNTRIES_QUERY } from '@/sanity/lib/queries';

export interface Country {
    _id: string;
    title: string;
    title_ja?: string;
    key: string;
    label: string;
}

export async function getAllCountries(locale: string = 'ja'): Promise<Country[]> {
    try {
        const isJa = locale === 'ja';
        const rawCountries = await client.fetch(COUNTRIES_QUERY, {}, { next: { revalidate: 60 } });
        
        if (rawCountries && Array.isArray(rawCountries)) {
            return rawCountries.map((c: any) => ({
                ...c,
                label: isJa && c.title_ja ? c.title_ja : c.title,
            }));
        }
    } catch (error) {
        console.error('Error fetching countries from Sanity:', error);
    }
    return [];
}
