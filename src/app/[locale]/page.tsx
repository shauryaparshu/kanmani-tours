import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import FounderStory from '@/components/home/FounderStory';
import Destinations from '@/components/home/Destinations';
import Journeys from '@/components/home/Journeys';
import WhyUs from '@/components/home/WhyUs';
import TestimonialQuote from '@/components/home/TestimonialQuote';
import Footer from '@/components/layout/FooterSection';
import { isUpcoming } from '@/components/tours/tourDates';
import { getImages } from '@/lib/server-images';
import { getAllTours, type Tour } from '@/lib/tours';
import { getTestimonials } from '@/lib/testimonials';
import { pageAlternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: pageAlternates(locale, ''),
    };
}

const JOURNEY_LIMIT = 8;

const byStart = (a: Tour, b: Tour) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

/** Upcoming tours soonest first, then recent past tours newest first. */
function selectJourneys(tours: Tour[]): Tour[] {
    const dated = tours.filter((tour) => tour.startDate);
    const upcoming = dated.filter((tour) => isUpcoming(tour.startDate)).sort(byStart);
    const past = dated.filter((tour) => !isUpcoming(tour.startDate)).sort((a, b) => byStart(b, a));
    return [...upcoming, ...past].slice(0, JOURNEY_LIMIT);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const heroImages = getImages('/assets/img/home/hero');

    const [allTours, testimonials] = await Promise.all([
        getAllTours(locale),
        getTestimonials(locale),
    ]);

    return (
        <>
            <main>
                <HomeHero images={heroImages} />
                <FounderStory />
                <Destinations />
                <Journeys tours={selectJourneys(allTours)} />
                <WhyUs />
                <TestimonialQuote testimonials={testimonials} />
            </main>
            <Footer />
        </>
    );
}
