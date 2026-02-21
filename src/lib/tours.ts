import toursData from '@/data/tours.json';

export interface TourItineraryDay {
    dayNumber: number;
    title: string;
    details: string;
    image: string | null;
}

export interface TourFaq {
    question: string;
    answer: string;
}

/** Shape from tours.json — coverImage may be null when no card image has been uploaded yet */
interface RawTour {
    id: number;
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
    /** Specific card thumbnail. Null = auto-derive from heroImage or galleryImages[0]. */
    coverImage: string | null;
    /** Optional dedicated hero/banner image (takes priority over galleryImages). */
    heroImage?: string | null;
    galleryImages: string[];
    features: string[];
    itinerary: TourItineraryDay[];
    whatToExpect: string[];
    inclusions: string[];
    exclusions: string[];
    faq: TourFaq[];
    bookingLink: string | null;
}

/** Normalised tour — coverImage is always a resolved string, never null */
export interface Tour extends Omit<RawTour, 'coverImage'> {
    coverImage: string;
}

// ─── Image resolution ─────────────────────────────────────────────────────────
/**
 * Resolve the best available image for a tour.
 * Priority: coverImage → heroImage → galleryImages[0] → ''
 *
 * Both the listing card AND the detail-page hero automatically share the same
 * image unless a dedicated image is uploaded separately.
 * • To use a specific card thumbnail → set `coverImage` in tours.json.
 * • To use a specific hero banner    → set `heroImage`  in tours.json.
 * • If neither is set, the first gallery image is used for both.
 */
function resolveCoverImage(t: RawTour): string {
    if (t.coverImage?.trim()) return t.coverImage;
    if (t.heroImage?.trim()) return t.heroImage;
    if (t.galleryImages?.length) return t.galleryImages[0];
    return '';
}

function normaliseTour(t: RawTour): Tour {
    return { ...t, coverImage: resolveCoverImage(t) };
}

const tours: Tour[] = (toursData as RawTour[]).map(normaliseTour);

// ─── Public API ───────────────────────────────────────────────────────────────
export function getAllTours(): Tour[] {
    return [...tours].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
}

export function getUpcomingTours(limit?: number): Tour[] {
    const now = new Date();
    const upcoming = getAllTours().filter(t => new Date(t.startDate) >= now);
    return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getTourBySlug(slug: string): Tour | undefined {
    return tours.find(t => t.slug === slug);
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
