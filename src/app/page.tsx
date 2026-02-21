import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ToursSection from '@/components/ToursSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/FooterSection';
import { getImages, getSlugs, getLatestImage } from '@/lib/server-images';
import { getAllTours } from '@/lib/tours';

export default function Home() {
  const heroImages = getImages('/assets/img/home/hero');
  const pollImages = getImages('/assets/img/home/poll');
  const customerImages = getImages('/assets/img/people/customers');

  // Get latest card image for each tour from the cards folder
  const tours = getAllTours();
  const tourCardImages: Record<number, string | null> = {};
  tours.forEach(tour => {
    tourCardImages[tour.id] = getLatestImage(`/assets/img/tours/${tour.slug}/cards`);
  });

  return (
    <main>
      <TopBar />
      <Navigation />
      <HeroSection heroImages={heroImages} pollImages={pollImages} />
      <ToursSection cardImages={tourCardImages} />
      <Testimonials customerImages={customerImages} />
      <Footer />
    </main>
  );
}
