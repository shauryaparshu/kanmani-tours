import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-24',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function uploadImage(imagePath) {
    if (!imagePath) return null;
    try {
        const fullPath = path.join(process.cwd(), 'public', imagePath.split('?')[0]);
        if (!fs.existsSync(fullPath)) {
            console.warn(`File not found: ${fullPath}`);
            return null;
        }
        console.log(`Uploading ${imagePath}...`);
        const asset = await client.assets.upload('image', fs.createReadStream(fullPath), {
            filename: path.basename(fullPath)
        });
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id
            }
        };
    } catch (err) {
        console.error(`Failed to upload image ${imagePath}:`, err.message);
        return null;
    }
}

async function restore() {
    const toursFile = path.join(process.cwd(), 'src/data/tours.json');
    const tours = JSON.parse(fs.readFileSync(toursFile, 'utf8'));

    // Check which tours exist
    const sanityTours = await client.fetch(`*[_type == "tour"]{ _id, "slug": slug.current }`);
    const existingSlugs = sanityTours.map(t => t.slug);

    for (const tour of tours) {
        // We will recreate tour 1, 2, 3, 4 which were deleted
        // Or any tour that doesn't exist.
        if (!existingSlugs.includes(tour.slug) || tour.id <= 4) {
            console.log(`\nRestoring ${tour.title}...`);

            const coverImageRef = await uploadImage(tour.coverImage);

            const galleryImageRefs = [];
            for (const img of (tour.galleryImages || [])) {
                const ref = await uploadImage(img);
                if (ref) galleryImageRefs.push(ref);
            }

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

            if (coverImageRef) doc.coverImage = coverImageRef;
            if (galleryImageRefs.length > 0) doc.galleryImages = galleryImageRefs;

            await client.createOrReplace(doc);
            console.log(`Successfully restored ${tour.title}`);
        }
    }
}

restore().then(() => console.log('Done')).catch(console.error);
