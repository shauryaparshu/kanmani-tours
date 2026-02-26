import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
const TOUR_CATEGORIES = [
    { key: 'Cultural', label: 'Culture Tours', color: '#2563eb', priority: true },
    { key: 'Food', label: 'Food Tours', color: '#16a34a', priority: true },
    { key: 'Celebrity', label: 'Celebrity-Related Tours', color: '#7c3aed', priority: true },
    { key: 'Short', label: 'Short Tours (1–2 days)', color: '#f59e0b', priority: true },
    { key: 'Ayurveda', label: 'Ayurveda Tours', color: '#14b8a6', priority: true },
    { key: 'Homestay', label: 'Homestay with Indian Family', color: '#e11d48', priority: true },
    { key: 'Education', label: 'Education Tours', color: '#6366f1', priority: false },
    { key: 'Industrial', label: 'Industrial Tours', color: '#475569', priority: false },
    { key: 'Village', label: 'Village Tours', color: '#84cc16', priority: false },
    { key: 'Cooking', label: 'Cooking Classes', color: '#ea580c', priority: false },
    { key: 'Temple', label: 'Temple Tours', color: '#b45309', priority: false },
];
// Load .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-24',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function seedCategories() {
    console.log('Seeding tour categories to Sanity...');

    for (const cat of TOUR_CATEGORIES) {
        // Check if exists by key
        const existing = await client.fetch(`*[_type == "tourCategory" && key == $key][0]`, { key: cat.key });

        const doc = {
            _type: 'tourCategory',
            title: cat.label,
            key: cat.key,
            color: cat.color,
            priority: cat.priority,
        };

        if (!existing) {
            await client.create(doc);
            console.log(`Created: ${cat.label}`);
        } else {
            console.log(`Exists: ${cat.label}`);
        }
    }
}

seedCategories().catch(console.error);
