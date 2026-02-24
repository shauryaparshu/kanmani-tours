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

async function check() {
    const tours = await client.fetch(`*[_type == "tour"]{ _id, title, "slug": slug.current, coverImage }`);
    console.log(JSON.stringify(tours, null, 2));
}

check().catch(console.error);
