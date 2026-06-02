import aboutData from '@/data/about.json';
import { client } from '@/sanity/lib/client';
import { cardImageUrl } from '@/sanity/lib/image';

export async function getAboutData() {
    try {
        const sanityAbout = await client.fetch(`*[_type == "about"][0]`, {}, { next: { revalidate: 60 } });
        if (sanityAbout) {
            // Process images
            if (sanityAbout.story?.image) {
                sanityAbout.story.image = cardImageUrl(sanityAbout.story.image);
            }
            // ... process other images as needed
            return sanityAbout;
        }
    } catch (error) {
        console.error('Error fetching About data from Sanity:', error);
    }

    // Fallback to JSON
    return aboutData;
}
