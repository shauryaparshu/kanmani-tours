import { client } from '@/sanity/lib/client';
import { FAQS_QUERY } from '@/sanity/lib/queries';
import FaqPageClient from './FaqPageClient';
import FooterSection from '@/components/layout/FooterSection';

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
