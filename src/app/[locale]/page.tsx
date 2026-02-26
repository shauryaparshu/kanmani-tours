import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ToursSection from '@/components/ToursSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/FooterSection';
import { getImages, getSlugs, getLatestImage } from '@/lib/server-images';
import { getAllTours } from '@/lib/tours';
import { getAllCelebrities } from '@/lib/celebrities';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const heroImages = getImages('/assets/img/home/hero');
  const pollImages = getImages('/assets/img/home/poll');
  const customerImages = getImages('/assets/img/people/customers');

  // Fetch tours and celebrities from Sanity
  const [tours, celebrities] = await Promise.all([
    getAllTours(locale),
    getAllCelebrities(locale)
  ]);

  // We'll pass the full tour objects to the section, 
  // but let's see what cardImages mapping it expects.
  // It seems it used tour.id as key.
  const tourCardImages: Record<number | string, string | null> = {};
  tours.forEach(tour => {
    tourCardImages[tour.id] = tour.coverImage;
  });

  return (
    <main>
      <TopBar />
      <Navigation />
      <HeroSection
        heroImages={heroImages}
        pollImages={pollImages}
        initialCelebrities={celebrities}
      />
      <ToursSection tours={tours} cardImages={tourCardImages} />
      <Testimonials customerImages={customerImages} />
      <Footer />
    </main>
  );
}
