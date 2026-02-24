import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-24',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function fixFaqDuplicates() {
    console.log('Fetching all FAQs from Sanity...');
    const allFaqs = await client.fetch(`*[_type == "faq"]{ _id, question }`);

    // Group by question text
    const byQuestion = {};
    allFaqs.forEach(f => {
        // use lowercased trimmed question string to be safe
        const key = f.question ? f.question.trim().toLowerCase() : 'unknown';
        if (!byQuestion[key]) byQuestion[key] = [];
        byQuestion[key].push(f);
    });

    console.log(`Found ${allFaqs.length} total FAQs in Sanity.`);

    // For any question that has > 1 entry, delete the duplicates
    let deletedCount = 0;
    for (const key in byQuestion) {
        const faqs = byQuestion[key];
        if (faqs.length > 1) {
            console.log(`\nFound ${faqs.length} duplicates for question: "${faqs[0].question}"`);

            // Keep the first one, delete the rest
            const toKeep = faqs[0];
            const toDelete = faqs.slice(1);

            for (const f of toDelete) {
                console.log(`Deleting duplicate FAQ ID: ${f._id}`);
                await client.delete(f._id);
                deletedCount++;
            }
        }
    }
    console.log(`\nFinished cleanup. Deleted ${deletedCount} duplicate FAQs.`);
}

fixFaqDuplicates().catch(console.error);
