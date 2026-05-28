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
            titleJa: tour.title_ja || tour.titleJa || null,
            slug: { _type: 'slug', current: tour.slug },
            category: tour.category,
            shortDescription: tour.shortDescription,
            shortDescriptionJa: tour.shortDescription_ja || tour.shortDescriptionJa || null,
            longDescription: tour.longDescription,
            longDescriptionJa: tour.longDescription_ja || tour.longDescriptionJa || null,
            startDate: tour.startDate,
            endDate: tour.endDate,
            durationDays: tour.durationDays,
            dateDisplay: tour.dateDisplay || null,
            dateDisplayJa: tour.dateDisplay_ja || tour.dateDisplayJa || null,
            location: tour.location,
            locationJa: tour.location_ja || tour.locationJa || null,
            priceJPY: tour.priceJPY,
            priceRangeJPY: tour.priceRangeJPY || null,
            seatsLeft: tour.seatsLeft,
            features: tour.features,
            featuresJa: tour.features_ja || tour.featuresJa || null,
            highlightsJa: tour.features_ja || tour.highlightsJa || null, // Map features_ja to highlightsJa as queried by pages
            itinerary: (tour.itinerary || []).map(day => ({
                dayNumber: day.dayNumber,
                title: day.title,
                titleJa: day.title_ja || day.titleJa || null,
                details: day.details,
                detailsJa: day.details_ja || day.detailsJa || null,
                image: day.image || null
            })),
            whatToExpect: tour.whatToExpect,
            whatToExpectJa: tour.whatToExpect_ja || tour.whatToExpectJa || null,
            inclusions: tour.inclusions,
            inclusionsJa: tour.inclusions_ja || tour.inclusionsJa || null,
            exclusions: tour.exclusions,
            exclusionsJa: tour.exclusions_ja || tour.exclusionsJa || null,
            faq: (tour.faq || []).map(item => ({
                question: item.question,
                questionJa: item.question_ja || item.questionJa || null,
                answer: item.answer,
                answerJa: item.answer_ja || item.answerJa || null
            })),
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

    // Delete any tours in Sanity that are no longer in tours.json
    console.log('\nCleaning up removed tours in Sanity...');
    const localSlugs = localTours.map(t => t.slug);
    for (const st of sanityTours) {
        if (!localSlugs.includes(st.slug)) {
            try {
                await client.delete(st._id);
                console.log(`Deleted removed tour from Sanity: ${st.slug}`);
            } catch (err) {
                console.error(`Error deleting tour ${st.slug}:`, err.message);
            }
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
            questionJa: faq.question_ja || faq.questionJa || null,
            answer: faq.answer,
            answerJa: faq.answer_ja || faq.answerJa || null,
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
