import toursData from '@/data/tours.json';
import { client } from '@/sanity/lib/client';
import { TOURS_QUERY, TOUR_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

export interface TourItineraryDay {
    dayNumber: number;
    title: string;
    details: string;
    image: any;
}

export interface TourFaq {
    question: string;
    answer: string;
}

interface RawTour {
    _id?: string;
    id: number | string;
    slug: string;
    category: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    startDate: string;
    endDate: string;
    isComingSoon?: boolean;
    dateDisplay?: string;
    durationDays: number;
    location: string;
    priceJPY: number;
    priceRangeJPY?: { min: number; max: number };
    seatsLeft: number;
    coverImage: any;
    galleryImages: any[];
    features: string[];
    itinerary: TourItineraryDay[];
    whatToExpect: string[];
    inclusions: string[];
    exclusions: string[];
    faq: TourFaq[];
    bookingLink: string | null;
    featured?: boolean;
    status?: string;
}

export interface Tour extends Omit<RawTour, 'coverImage'> {
    coverImage: string;
}

function resolveImageUrl(image: any): string {
    if (!image) return '';
    if (typeof image === 'string') return image;
    try {
        return urlForImage(image)?.url() || '';
    } catch (e) {
        return '';
    }
}

function normaliseTour(t: any, locale: string = 'ja'): Tour {
    const isJa = locale === 'ja';

    return {
        ...t,
        title: (isJa && t.title_ja) ? t.title_ja : t.title,
        shortDescription: (isJa && t.shortDescription_ja) ? t.shortDescription_ja : t.shortDescription,
        longDescription: (isJa && t.longDescription_ja) ? t.longDescription_ja : t.longDescription,
        location: (isJa && t.location_ja) ? t.location_ja : t.location,
        isComingSoon: t.isComingSoon || false,
        dateDisplay: (isJa && t.dateDisplay_ja) ? t.dateDisplay_ja : (t.dateDisplay || ''),
        // Ensure all array fields are never null/undefined — Sanity can return null for unset arrays
        galleryImages: t.galleryImages ?? [],
        features: (isJa && t.features_ja) ? t.features_ja : (t.features ?? []),
        itinerary: (t.itinerary ?? []).map((day: any) => ({
            ...day,
            title: (isJa && day.title_ja) ? day.title_ja : day.title,
            details: (isJa && day.details_ja) ? day.details_ja : day.details,
        })),
        whatToExpect: (isJa && t.whatToExpect_ja) ? t.whatToExpect_ja : (t.whatToExpect ?? []),
        inclusions: (isJa && t.inclusions_ja) ? t.inclusions_ja : (t.inclusions ?? []),
        exclusions: (isJa && t.exclusions_ja) ? t.exclusions_ja : (t.exclusions ?? []),
        faq: (t.faq ?? []).map((f: any) => ({
            question: (isJa && f.question_ja) ? f.question_ja : f.question,
            answer: (isJa && f.answer_ja) ? f.answer_ja : f.answer,
        })),
        // Resolve cover image
        coverImage: resolveImageUrl(t.coverImage) || (t.galleryImages?.[0] ? resolveImageUrl(t.galleryImages[0]) : ''),
        featured: t.featured || false,
        status: t.status || 'upcoming',
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllTours(locale: string = 'ja'): Promise<Tour[]> {
    try {
        const sanityTours = await client.fetch(TOURS_QUERY, {}, { next: { revalidate: 60 } });
        if (sanityTours && sanityTours.length > 0) {
            return sanityTours.map((t: any) => normaliseTour(t, locale));
        }
    } catch (error) {
        console.error('Error fetching tours from Sanity:', error);
    }

    // Fallback to JSON
    return (toursData as any[]).map(t => normaliseTour(t, locale)).sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
}

export async function getUpcomingTours(limit?: number, locale: string = 'ja'): Promise<Tour[]> {
    const all = await getAllTours(locale);
    const now = new Date();
    const upcoming = all.filter(t => new Date(t.startDate) >= now);
    return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getTourBySlug(slug: string, locale: string = 'ja'): Promise<Tour | undefined> {
    try {
        const tour = await client.fetch(TOUR_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
        if (tour) {
            return normaliseTour(tour, locale);
        }
    } catch (error) {
        console.error(`Error fetching tour ${slug} from Sanity:`, error);
    }

    // Fallback to JSON
    const localTour = (toursData as any[]).find(t => t.slug === slug);
    if (localTour) {
        return normaliseTour(localTour, locale);
    }
    return undefined;
}

export function formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} — ${end.toLocaleDateString('en-US', opts)}`;
}

export function formatPriceJPY(price: number): string {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
}

export function formatPriceRange(range: { min: number; max: number }): string {
    return `${formatPriceJPY(range.min)} – ${formatPriceJPY(range.max)}`;
}
