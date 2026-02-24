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
    token: process.env.SANITY_API_TOKEN, // Requires a write token
    useCdn: false,
});

async function syncTours() {
    console.log('Syncing tours from tours.json to Sanity...');
    const toursFile = path.join(process.cwd(), 'src/data/tours.json');
    if (!fs.existsSync(toursFile)) {
        console.error('Tours file not found.');
        return;
    }

    const localTours = JSON.parse(fs.readFileSync(toursFile, 'utf8'));
    const sanityTours = await client.fetch(`*[_type == "tour"]{ _id, "slug": slug.current }`);

    for (const tour of localTours) {
        const existingTour = sanityTours.find(st => st.slug === tour.slug);

        const docFields = {
            title: tour.title,
            slug: { _type: 'slug', current: tour.slug },
            category: tour.category,
            shortDescription: tour.shortDescription,
            longDescription: tour.longDescription,
            startDate: tour.startDate,
            endDate: tour.endDate,
            durationDays: tour.durationDays,
            location: tour.location,
            priceJPY: tour.priceJPY,
            priceRangeJPY: tour.priceRangeJPY || null,
            seatsLeft: tour.seatsLeft,
            features: tour.features,
            itinerary: tour.itinerary,
            whatToExpect: tour.whatToExpect,
            inclusions: tour.inclusions,
            exclusions: tour.exclusions,
            faq: tour.faq,
            bookingLink: tour.bookingLink,
        };

        try {
            if (existingTour) {
                // Update existing tour without touching its random ID or cover image
                await client.patch(existingTour._id).set(docFields).commit();
                console.log(`Updated existing: ${tour.title}`);
            } else {
                // Create new tour
                await client.create({ _type: 'tour', ...docFields });
                console.log(`Created new: ${tour.title}`);
            }
        } catch (err) {
            console.error(`Error syncing ${tour.title}:`, err.message);
        }
    }
}

async function syncFAQs() {
    console.log('\nSyncing FAQs from faq.json to Sanity...');
    const faqFile = path.join(process.cwd(), 'src/data/faq.json');
    if (!fs.existsSync(faqFile)) {
        console.error('FAQ file not found.');
        return;
    }

    const localFaqs = JSON.parse(fs.readFileSync(faqFile, 'utf8'));
    const sanityFaqs = await client.fetch(`*[_type == "faq"]{ _id, question }`);

    for (const faq of localFaqs) {
        // Find existing FAQ by question text to avoid duplicates
        const existingFaq = sanityFaqs.find(sf =>
            sf.question && faq.question && sf.question.trim().toLowerCase() === faq.question.trim().toLowerCase()
        );

        const docFields = {
            question: faq.question,
            answer: faq.answer,
            order: faq.id,
        };

        try {
            if (existingFaq) {
                // Update existing
                await client.patch(existingFaq._id).set(docFields).commit();
                console.log(`Updated existing: ${faq.question}`);
            } else {
                // Create new
                await client.create({ _type: 'faq', ...docFields });
                console.log(`Created new: ${faq.question}`);
            }
        } catch (err) {
            console.error(`Error syncing ${faq.question}:`, err.message);
        }
    }
}

async function main() {
    if (!process.env.SANITY_API_TOKEN) {
        console.error('ERROR: SANITY_API_TOKEN is missing in .env.local');
        console.log('Please create a write token in Sanity Manage (https://www.sanity.io/manage) and add it to .env.local');
        process.exit(1);
    }

    await syncTours();
    await syncFAQs();
    console.log('\nSync methodology updated to guarantee no duplicates!');
}

main().catch(console.error);
