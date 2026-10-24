import type { Tour } from '@/lib/tours';
import { isUpcoming } from './tourDates';

const byStart = (a: Tour, b: Tour) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

/** Upcoming tours soonest first, then recent past tours newest first. */
export function selectJourneys(tours: Tour[], limit: number, excludeSlug?: string): Tour[] {
    const dated = tours.filter((tour) => tour.startDate && tour.slug !== excludeSlug);
    const upcoming = dated.filter((tour) => isUpcoming(tour.startDate)).sort(byStart);
    const past = dated.filter((tour) => !isUpcoming(tour.startDate)).sort((a, b) => byStart(b, a));
    return [...upcoming, ...past].slice(0, limit);
}
