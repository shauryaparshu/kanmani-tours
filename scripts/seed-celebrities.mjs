import { createClient } from '@sanity/client';
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

const ACTORS = [
    { id: 'vijay_thalapathi', name: 'Vijay Thalapathy', name_ja: 'ヴィジャイ・タラパティ' },
    { id: 'sethupathi', name: 'Vijay Sethupathi', name_ja: 'ヴィジャイ・セツパティ' },
    { id: 'ram', name: 'Ram Charan', name_ja: 'ラム・チャラン' },
    { id: 'ntr', name: 'Jr NTR', name_ja: 'Jr NTR' },
    { id: 'allu', name: 'Allu Arjun', name_ja: 'アッル・アルジュン' },
    { id: 'suryah', name: 'SJ Suryah', name_ja: 'SJ スーリヤ' }
];

async function seedCelebrities() {
    console.log('Seeding celebrities to Sanity...');

    for (const actor of ACTORS) {
        // Check if exists
        const existing = await client.fetch(`*[_type == "celebrity" && name == $name][0]`, { name: actor.name });

        const doc = {
            _type: 'celebrity',
            name: actor.name,
            name_ja: actor.name_ja,
        };

        if (!existing) {
            await client.create(doc);
            console.log(`Created: ${actor.name}`);
        } else {
            console.log(`Exists: ${actor.name}`);
        }
    }
}

seedCelebrities().catch(console.error);
