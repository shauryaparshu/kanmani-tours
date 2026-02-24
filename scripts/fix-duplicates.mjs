import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-24',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function fixDuplicates() {
    console.log('Fetching all tours from Sanity...');
    const allTours = await client.fetch(`*[_type == "tour"]{ _id, title, "slug": slug.current, coverImage }`);

    // Group by slug
    const bySlug = {};
    allTours.forEach(t => {
        if (!bySlug[t.slug]) bySlug[t.slug] = [];
        bySlug[t.slug].push(t);
    });

    console.log(`Found ${allTours.length} total tours.`);

    // For any slug that has > 1 tour, delete the one with _id starting with "tour-"
    for (const slug in bySlug) {
        const tours = bySlug[slug];
        if (tours.length > 1) {
            console.log(`Found duplicates for slug: ${slug}`);
            for (const t of tours) {
                if (t._id.startsWith('tour-')) {
                    console.log(`Deleting newly created duplicate: ${t._id} (${t.title})`);
                    await client.delete(t._id);
                }
            }
        }
    }
}

async function updateExistingWithNewData() {
    console.log('\nUpdating remaining Sanity tours with new data from tours.json...');
    const toursFile = path.join(process.cwd(), 'src/data/tours.json');
    const localTours = JSON.parse(fs.readFileSync(toursFile, 'utf8'));

    const sanityTours = await client.fetch(`*[_type == "tour"]{ _id, "slug": slug.current }`);

    for (const sanityTour of sanityTours) {
        const localMatch = localTours.find(lt => lt.slug === sanityTour.slug);
        if (localMatch) {
            console.log(`Updating ${sanityTour._id} (${localMatch.title}) with latest data...`);

            // We ONLY update text/data fields, leaving images intact.
            await client.patch(sanityTour._id).set({
                title: localMatch.title,
                category: localMatch.category,
                shortDescription: localMatch.shortDescription,
                longDescription: localMatch.longDescription,
                startDate: localMatch.startDate,
                endDate: localMatch.endDate,
                durationDays: localMatch.durationDays,
                location: localMatch.location,
                priceJPY: localMatch.priceJPY,
                priceRangeJPY: localMatch.priceRangeJPY || null,
                seatsLeft: localMatch.seatsLeft,
                features: localMatch.features,
                itinerary: localMatch.itinerary,
                whatToExpect: localMatch.whatToExpect,
                inclusions: localMatch.inclusions,
                exclusions: localMatch.exclusions,
                faq: localMatch.faq,
                bookingLink: localMatch.bookingLink || null,
            }).commit();
        }
    }
}

async function main() {
    await fixDuplicates();
    await updateExistingWithNewData();
    console.log('\nFix complete!');
}

main().catch(console.error);
