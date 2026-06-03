import toursData from '@/data/tours.json';
import { client } from '@/sanity/lib/client';
import { TOURS_QUERY, TOUR_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { cardImageUrl, heroImageUrl } from '@/sanity/lib/image';

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

export interface FaqItem {
    _id: string;
    category: string;
    question: string;
    answer: string;
}

export const FAQ_CATEGORIES = [
    { value: 'booking', label: 'Booking & Payment', star: false },
    { value: 'visa', label: 'Visa & Travel Documents', star: false },
    { value: 'experience', label: 'The Tour Experience', star: false },
    { value: 'health', label: 'Safety & Health', star: false },
    { value: 'money', label: 'Money & Practical', star: false },
    { value: 'weather', label: 'Weather & Timing', star: false },
    { value: 'celebrity', label: 'Celebrity & Special Tours', star: true },
] as const;

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
    durationDays: number;
    isComingSoon?: boolean;
    dateDisplay?: string;
    country?: { title: string; title_ja?: string; key: string };
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
    bookingClosed?: boolean;
}

export interface Tour extends Omit<RawTour, 'coverImage'> {
    coverImage: string;
    coverImageLqip?: string;
    country?: { label: string; key: string };
}

function resolveImageUrl(image: any): string {
    if (!image) return '';
    if (typeof image === 'string') return image;
    try {
        return cardImageUrl(image) || '';
    } catch (e) {
        return '';
    }
}

function resolveHeroImageUrl(image: any): string {
    if (!image) return '';
    if (typeof image === 'string') return image;
    try {
        return heroImageUrl(image) || '';
    } catch (e) {
        return '';
    }
}

function resolveLqip(image: any): string {
    return image?.asset?.metadata?.lqip || '';
}

function normaliseTour(t: any, locale: string = 'ja'): Tour {
    const isJa = locale === 'ja';

    return {
        ...t,
        title: (isJa && (t.titleJa || t.title_ja)) ? (t.titleJa || t.title_ja) : t.title,
        shortDescription: (isJa && (t.shortDescriptionJa || t.shortDescription_ja)) ? (t.shortDescriptionJa || t.shortDescription_ja) : t.shortDescription,
        longDescription: (isJa && (t.longDescriptionJa || t.longDescription_ja)) ? (t.longDescriptionJa || t.longDescription_ja) : t.longDescription,
        country: t.country ? {
            label: isJa && t.country.title_ja ? t.country.title_ja : t.country.title,
            key: t.country.key,
        } : undefined,
        location: (isJa && (t.locationJa || t.location_ja)) ? (t.locationJa || t.location_ja) : t.location,
        isComingSoon: t.isComingSoon || false,
        dateDisplay: (isJa && (t.dateDisplayJa || t.dateDisplay_ja)) ? (t.dateDisplayJa || t.dateDisplay_ja) : (t.dateDisplay || ''),
        durationDays: (() => {
            if (!t.startDate || !t.endDate) return 0;
            const start = new Date(t.startDate);
            const end = new Date(t.endDate);
            const diffMs = end.getTime() - start.getTime();
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            return diffDays + 1;
        })(),
        // Ensure all array fields are never null or undefined because Sanity can return null for unset arrays.
        galleryImages: t.galleryImages ?? [],
        features: (isJa && (t.highlightsJa || t.features_ja)) ? (t.highlightsJa || t.features_ja) : (t.features ?? []),
        itinerary: (t.itinerary ?? []).map((day: any) => ({
            ...day,
            title: (isJa && (day.titleJa || day.title_ja)) ? (day.titleJa || day.title_ja) : day.title,
            details: (isJa && (day.detailsJa || day.details_ja)) ? (day.detailsJa || day.details_ja) : day.details,
            image: day.image ?? null,
        })),
        whatToExpect: (isJa && (t.whatToExpectJa || t.whatToExpect_ja)) ? (t.whatToExpectJa || t.whatToExpect_ja) : (t.whatToExpect ?? []),
        inclusions: (isJa && (t.inclusionsJa || t.inclusions_ja)) ? (t.inclusionsJa || t.inclusions_ja) : (t.inclusions ?? []),
        exclusions: (isJa && (t.exclusionsJa || t.exclusions_ja)) ? (t.exclusionsJa || t.exclusions_ja) : (t.exclusions ?? []),
        faq: (t.faq ?? []).map((f: any) => ({
            question: (isJa && (f.questionJa || f.question_ja)) ? (f.questionJa || f.question_ja) : f.question,
            answer: (isJa && (f.answerJa || f.answer_ja)) ? (f.answerJa || f.answer_ja) : f.answer,
        })),
        coverImage: resolveHeroImageUrl(t.coverImage) || (t.galleryImages?.[0] ? resolveHeroImageUrl(t.galleryImages[0]) : ''),
        coverImageLqip: resolveLqip(t.coverImage) || (t.galleryImages?.[0] ? resolveLqip(t.galleryImages[0]) : ''),
        featured: t.featured || false,
        bookingClosed: t.bookingClosed || false,
    };
}

export async function getAllTours(locale: string = 'ja'): Promise<Tour[]> {
    try {
        const sanityTours = await client.fetch(TOURS_QUERY, {}, { next: { revalidate: 60 } });
        if (sanityTours && sanityTours.length > 0) {
            return sanityTours.map((t: any) => normaliseTour(t, locale));
        }
    } catch (error) {
        console.error('Error fetching tours from Sanity:', error);
    }

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

    const localTour = (toursData as any[]).find(t => t.slug === slug);
    if (localTour) {
        return normaliseTour(localTour, locale);
    }
    return undefined;
}

function getDateRangeLocaleTag(locale?: string): string {
    return locale?.startsWith('ja') ? 'ja-JP' : 'en-US';
}

export function formatDateRange(startDate: string, endDate: string, locale?: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const localeTag = getDateRangeLocaleTag(locale);
    const opts: Intl.DateTimeFormatOptions = localeTag === 'ja-JP'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' };
    const separator = localeTag === 'ja-JP' ? ' 〜 ' : ' — ';
    return `${start.toLocaleDateString(localeTag, opts)}${separator}${end.toLocaleDateString(localeTag, opts)}`;
}

export function formatPriceJPY(price: number): string {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
}

export function formatPriceRange(range: { min: number; max: number }): string {
    return `${formatPriceJPY(range.min)} - ${formatPriceJPY(range.max)}`;
}
