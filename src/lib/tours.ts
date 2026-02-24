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
    id: number | string;
    slug: string;
    category: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    location: string;
    priceJPY: number;
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

function normaliseTour(t: RawTour): Tour {
    return {
        ...t,
        // Ensure all array fields are never null/undefined — Sanity can return null for unset arrays
        galleryImages: t.galleryImages ?? [],
        features: t.features ?? [],
        itinerary: t.itinerary ?? [],
        whatToExpect: t.whatToExpect ?? [],
        inclusions: t.inclusions ?? [],
        exclusions: t.exclusions ?? [],
        faq: t.faq ?? [],
        // Resolve cover image
        coverImage: resolveImageUrl(t.coverImage) || (t.galleryImages?.[0] ? resolveImageUrl(t.galleryImages[0]) : '')
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllTours(): Promise<Tour[]> {
    try {
        const sanityTours = await client.fetch(TOURS_QUERY);
        if (sanityTours && sanityTours.length > 0) {
            return sanityTours.map(normaliseTour);
        }
    } catch (error) {
        console.error('Error fetching tours from Sanity:', error);
    }

    // Fallback to JSON
    return (toursData as any[]).map(t => ({
        ...t,
        coverImage: t.coverImage || (t.galleryImages?.[0] || '')
    })).sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
}

export async function getUpcomingTours(limit?: number): Promise<Tour[]> {
    const all = await getAllTours();
    const now = new Date();
    const upcoming = all.filter(t => new Date(t.startDate) >= now);
    return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
    try {
        const tour = await client.fetch(TOUR_BY_SLUG_QUERY, { slug });
        if (tour) {
            return normaliseTour(tour);
        }
    } catch (error) {
        console.error(`Error fetching tour ${slug} from Sanity:`, error);
    }

    // Fallback to JSON
    const localTour = (toursData as any[]).find(t => t.slug === slug);
    if (localTour) {
        return {
            ...localTour,
            coverImage: localTour.coverImage || (localTour.galleryImages?.[0] || '')
        };
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
