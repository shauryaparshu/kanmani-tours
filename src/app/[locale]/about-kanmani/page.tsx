import { client } from '@/sanity/lib/client';
import { FOUNDER_PHOTOS_QUERY } from '@/sanity/lib/queries';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import FounderPageClient from './FounderPageClient';

export default async function AboutKanmaniPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const founderPhotos = await client.fetch(FOUNDER_PHOTOS_QUERY, {}, { next: { revalidate: 60 } });

  return (
    <>
      <Navigation />
      <main>
        <FounderPageClient locale={locale} photos={founderPhotos} />
      </main>
      <Footer />
    </>
  );
}
