import faqData from '@/data/faq.json';
import { client } from '@/sanity/lib/client';
import { FAQS_QUERY } from '@/sanity/lib/queries';

export interface FAQ {
    id: string | number;
    question: string;
    answer: string;
}

export async function getFAQs(): Promise<FAQ[]> {
    let faqs: FAQ[] = [];
    try {
        const sanityFaqs = await client.fetch(FAQS_QUERY, {}, { next: { revalidate: 60 } });
        if (sanityFaqs && sanityFaqs.length > 0) {
            faqs = sanityFaqs.map((f: any) => ({
                id: f._id,
                question: f.question,
                answer: f.answer,
            }));
        }
    } catch (error) {
        console.error('Error fetching FAQs from Sanity:', error);
    }

    if (faqs.length === 0) {
        faqs = faqData as FAQ[];
    }

    // Deduplicate by question
    const seen = new Set();
    return faqs.filter(faq => {
        const duplicate = seen.has(faq.question);
        seen.add(faq.question);
        return !duplicate;
    });
}
