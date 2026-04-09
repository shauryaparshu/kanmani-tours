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
  const [allTours, celebrities] = await Promise.all([
    getAllTours(locale),
    getAllCelebrities(locale)
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTours = allTours
    .filter(tour => {
      if (!tour.startDate) return false;
      const start = new Date(tour.startDate);
      start.setHours(0, 0, 0, 0);
      return start >= today;
    })
    .sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 3);

  return (
    <main style={{ maxWidth: '100%', width: '100%', padding: 0 }}>
      <HeroSection
        heroImages={heroImages}
      />
      <ToursSection tours={upcomingTours} />
      <Testimonials customerImages={customerImages} />
      <Footer />
    </main>
  );
}
