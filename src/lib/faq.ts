import faqData from '@/data/faq.json';
import { client } from '@/sanity/lib/client';
import { FAQS_QUERY } from '@/sanity/lib/queries';

export interface FAQ {
    id: string | number;
    question: string;
    answer: string;
}

export async function getFAQs(): Promise<FAQ[]> {
    try {
        const sanityFaqs = await client.fetch(FAQS_QUERY);
        if (sanityFaqs && sanityFaqs.length > 0) {
            return sanityFaqs.map((f: any) => ({
                id: f._id,
                question: f.question,
                answer: f.answer,
            }));
        }
    } catch (error) {
        console.error('Error fetching FAQs from Sanity:', error);
    }

    // Fallback to JSON
    return faqData as FAQ[];
}
