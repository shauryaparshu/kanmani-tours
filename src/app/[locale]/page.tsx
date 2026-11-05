import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import TrustBand from '@/components/home/TrustBand';
import Destinations from '@/components/home/Destinations';
import Journeys from '@/components/home/Journeys';
import WhyUs from '@/components/home/WhyUs';
import TestimonialQuote from '@/components/home/TestimonialQuote';
import Footer from '@/components/layout/FooterSection';
import { selectJourneys } from '@/components/tours/selectJourneys';
import { getImages } from '@/lib/server-images';
import { getAllTours } from '@/lib/tours';
import { getTestimonials } from '@/lib/testimonials';
import { pageAlternates } from '@/lib/site';
import { setRequestLocale } from 'next-intl/server';

// Static with incremental regeneration: Sanity edits appear within 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: pageAlternates(locale, ''),
    };
}

const JOURNEY_LIMIT = 8;
const HERO_FIRST = 'IMG_0616';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    // The group photo with the cinema banner opens the slideshow; the rest follow in folder order.
    const heroImages = getImages('/assets/img/home/hero').sort(
        (a, b) => Number(b.includes(HERO_FIRST)) - Number(a.includes(HERO_FIRST)),
    );

    const [allTours, testimonials] = await Promise.all([
        getAllTours(locale),
        getTestimonials(locale),
    ]);

    return (
        <>
            <main>
                <HomeHero images={heroImages} />
                <TrustBand />
                <Destinations />
                <Journeys tours={selectJourneys(allTours, JOURNEY_LIMIT)} />
                <WhyUs />
                <TestimonialQuote testimonials={testimonials} />
            </main>
            <Footer />
        </>
    );
}
