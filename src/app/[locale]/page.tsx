import HeroSection from '@/components/sections/HeroSection';
import ToursSection from '@/components/sections/ToursSection';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/layout/FooterSection';
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
    <main style={{ maxWidth: '100%', width: '100%', padding: 0 }}>
      <HeroSection
        heroImages={heroImages}
      />
      <ToursSection tours={tours} cardImages={tourCardImages} />
      <Testimonials customerImages={customerImages} />
      <Footer />
    </main>
  );
}
