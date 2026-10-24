import { client } from '@/sanity/lib/client';
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries';

export interface Testimonial {
    id: string;
    name: string;
    location: string;
    text: string;
    tour: string;
}

interface SanityTestimonial {
    _id: string;
    name?: string;
    location?: string;
    locationJa?: string;
    text?: string;
    textJa?: string;
    tourName?: string;
    tourNameJa?: string;
}

// Shown until testimonials are added in Sanity Studio.
export const FALLBACK_TESTIMONIALS: Testimonial[] = [
    {
        id: 'fallback-1',
        name: "Ram Charan Fan Community",
        location: "Tokyo, Japan",
        text: "Dr. Kanmani has been a wonderful friend to me and to our Ram Charan fan community in Tokyo. Her strong personal connections with top film personalities are truly remarkable. Thanks to her personal contacts, she arranged our visit to Ram Charan's home in Hyderabad. He spent 1.5 hours with all 16 of us, spoke individually, and even gave us gifts. All credit goes to Dr. Kanmani — caring, trustworthy, and deeply committed to people.",
        tour: "Celebrity Home Visit — Ram Charan"
    },
    {
        id: 'fallback-2',
        name: "S.J. Surya Fan Group",
        location: "Japan",
        text: "We are devoted S.J. Surya fans from Japan, and we asked Dr. Kanmani to help us meet him. She contacted director Karthik Subbaraj, who immediately reached out to S.J. Surya at her request. The very next day, we were welcomed into S.J. Surya's home — a dream we never thought possible. This unforgettable experience happened entirely because of Dr. Kanmani's care and influence. She understands exactly what we need, and her dedication and Japanese language skills make her truly exceptional.",
        tour: "Celebrity Home Visit — S.J. Surya"
    },
    {
        id: 'fallback-3',
        name: "Karthik Subbaraj Admirers",
        location: "Japan",
        text: "We have always admired director Karthik Subbaraj and dreamed of meeting him. During our Chennai visit, he was shooting near Madurai, yet Dr. Kanmani secured an appointment instantly. She arranged transportation from Chennai, and we spent the entire day with him and his film crew — he even hosted us for lunch. With just a few calls, Kanmani makes the impossible happen. To us, she is Akka — quick, caring, and a true leader who turns dreams into reality.",
        tour: "Film Director Meet — Karthik Subbaraj"
    }
];

export async function getTestimonials(locale: string = 'ja'): Promise<Testimonial[]> {
    const isJa = locale === 'ja';
    try {
        const docs: SanityTestimonial[] = await client.fetch(TESTIMONIALS_QUERY, {}, { next: { revalidate: 60 } });
        const testimonials = (docs ?? [])
            .filter((d) => d.name && (d.text || d.textJa))
            .map((d) => ({
                id: d._id,
                name: d.name!,
                location: (isJa && d.locationJa) || d.location || '',
                text: (isJa && d.textJa) || d.text || d.textJa || '',
                tour: (isJa && d.tourNameJa) || d.tourName || '',
            }));
        if (testimonials.length > 0) return testimonials;
    } catch (error) {
        console.error('Error fetching testimonials from Sanity:', error);
    }

    return FALLBACK_TESTIMONIALS;
}
