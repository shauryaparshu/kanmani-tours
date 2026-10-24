import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { FOUNDER_PHOTOS_QUERY } from '@/sanity/lib/queries';
import Footer from '@/components/layout/FooterSection';
import AboutKanmaniClient from './AboutKanmaniClient';
import { pageAlternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: pageAlternates(locale, '/about'),
    };
}


export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const founderPhotos = await client.fetch(FOUNDER_PHOTOS_QUERY, {}, { next: { revalidate: 60 } });

  return (
    <>
      <AboutKanmaniClient locale={locale} photos={founderPhotos} />
      <Footer />
    </>
  );
}
