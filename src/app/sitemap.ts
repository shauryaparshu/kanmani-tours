import { MetadataRoute } from 'next';
import { getAllTours } from '@/lib/tours';
import { localizedUrl } from '@/lib/site';

// Pages available in both languages.
const BILINGUAL_PATHS = [
    '',
    '/about',
    '/airport-transfer',
    '/contact',
    '/faq',
    '/gallery',
    '/services',
    '/services/moving',
    '/india/tours',
];

// Japan pages are English-only by design.
const ENGLISH_ONLY_PATHS = ['/japan/tours'];

function bilingualEntries(path: string): MetadataRoute.Sitemap {
    const languages = { ja: localizedUrl('ja', path), en: localizedUrl('en', path) };
    return [
        { url: languages.ja, lastModified: new Date(), alternates: { languages } },
        { url: languages.en, lastModified: new Date(), alternates: { languages } },
    ];
}

function englishOnlyEntry(path: string): MetadataRoute.Sitemap[number] {
    const en = localizedUrl('en', path);
    return { url: en, lastModified: new Date(), alternates: { languages: { en } } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const tours = await getAllTours();

    return [
        ...BILINGUAL_PATHS.flatMap(bilingualEntries),
        ...ENGLISH_ONLY_PATHS.map(englishOnlyEntry),
        ...tours.flatMap((tour) =>
            tour.destination === 'japan'
                ? [englishOnlyEntry(`/japan/tours/${encodeURIComponent(tour.slug)}`)]
                : bilingualEntries(`/india/tours/${encodeURIComponent(tour.slug)}`)
        ),
    ];
}
