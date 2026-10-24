import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import DestinationChoice from '@/components/sections/DestinationChoice';
import ToursSection from '@/components/sections/ToursSection';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/layout/FooterSection';
import { getImages } from '@/lib/server-images';
import { getAllTours } from '@/lib/tours';
import { getTestimonials } from '@/lib/testimonials';

import CompanySections from '@/components/sections/CompanySections';
import { pageAlternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: pageAlternates(locale, ''),
    };
}


export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const heroImages = getImages('/assets/img/home/hero');
  const customerImages = getImages('/assets/img/people/customers');

  const [allTours, testimonials] = await Promise.all([
    getAllTours(locale),
    getTestimonials(locale),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTours = (() => {
    const upcoming = allTours.filter(tour => {
      if (!tour.startDate) return false;
      const start = new Date(tour.startDate);
      start.setHours(0, 0, 0, 0);
      return start >= today;
    });

    const celebrityTours = upcoming.filter(t =>
      t.category?.toLowerCase().includes('celebrity')
    );
    const otherTours = upcoming.filter(t =>
      !t.category?.toLowerCase().includes('celebrity')
    ).sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return [...celebrityTours, ...otherTours].slice(0, 3);
  })();

  return (
    <main style={{ maxWidth: '100%', width: '100%', padding: 0 }}>
      <HeroSection
        heroImages={heroImages}
      />
      <DestinationChoice />
      <ToursSection tours={upcomingTours} locale={locale} />
      <CompanySections />
      <Testimonials testimonials={testimonials} customerImages={customerImages} />
      <Footer />
    </main>
  );
}
