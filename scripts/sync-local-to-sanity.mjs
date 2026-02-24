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

    const tours = JSON.parse(fs.readFileSync(toursFile, 'utf8'));

    for (const tour of tours) {
        const doc = {
            _type: 'tour',
            _id: `tour-${tour.id}`,
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
            await client.createOrReplace(doc);
            console.log(`Synced: ${tour.title}`);
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

    const faqs = JSON.parse(fs.readFileSync(faqFile, 'utf8'));

    for (const faq of faqs) {
        const doc = {
            _type: 'faq',
            _id: `faq-${faq.id}`,
            question: faq.question,
            answer: faq.answer,
            order: faq.id,
        };

        try {
            await client.createOrReplace(doc);
            console.log(`Synced: ${faq.question}`);
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
    console.log('\nSync complete!');
}

main().catch(console.error);
