import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { FAQS_QUERY } from '@/sanity/lib/queries';
import FaqPageClient from './FaqPageClient';
import FooterSection from '@/components/layout/FooterSection';
import { pageAlternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: pageAlternates(locale, '/faq'),
    };
}


export default async function FaqPage() {
  const faqs = await client.fetch(FAQS_QUERY, {}, { 
    next: { revalidate: 60 } 
  });
  return (
    <>
      <FaqPageClient faqs={faqs} />
      <FooterSection />
    </>
  );
}
