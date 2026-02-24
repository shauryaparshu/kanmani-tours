import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const tours = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/tours.json'), 'utf8'))
const faqs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/faq.json'), 'utf8'))

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '31klefy7',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-02-24',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
})

async function uploadImage(imagePath) {
    if (!imagePath) return null

    // Convert web path (/assets/img/...) to local path
    const localPath = path.resolve(__dirname, '../public', imagePath.replace(/^\//, ''))

    if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ Skipping image (not found): ${localPath}`)
        return null
    }

    try {
        const imageData = fs.readFileSync(localPath)
        const asset = await client.assets.upload('image', imageData, {
            filename: path.basename(localPath)
        })
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id
            }
        }
    } catch (err) {
        console.error(`❌ Failed to upload image ${imagePath}:`, err.message)
        return null
    }
}

async function migrate() {
    if (!process.env.SANITY_WRITE_TOKEN) {
        console.error('❌ Error: SANITY_WRITE_TOKEN is missing in .env.local')
        return
    }

    console.log('🚀 Starting Full Migration (including images)...')

    // Migrate FAQs (no images here)
    console.log('\n📝 Migrating FAQs...')
    // We'll skip if they already exist or just re-import (Sanity creates new IDs unless specified)
    // For simplicity, we'll just run it. 

    // Migrate Tours
    console.log('\n🌍 Migrating Tours with Images...')
    for (const tour of tours) {
        try {
            console.log(`\n📦 Processing: ${tour.title}`)

            const coverImageAsset = await uploadImage(tour.coverImage)

            const galleryAssets = []
            if (tour.galleryImages) {
                for (const imgPath of tour.galleryImages) {
                    const asset = await uploadImage(imgPath)
                    if (asset) galleryAssets.push(asset)
                }
            }

            const itineraryWithImages = []
            if (tour.itinerary) {
                for (const day of tour.itinerary) {
                    const dayImage = await uploadImage(day.image)
                    itineraryWithImages.push({
                        ...day,
                        image: dayImage
                    })
                }
            }

            const doc = {
                _type: 'tour',
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
                seatsLeft: tour.seatsLeft,
                features: tour.features,
                whatToExpect: tour.whatToExpect,
                inclusions: tour.inclusions,
                exclusions: tour.exclusions,
                faq: tour.faq,
                coverImage: coverImageAsset,
                galleryImages: galleryAssets,
                itinerary: itineraryWithImages
            }

            // We use createOrReplace based on slug to avoid duplicates if run multiple times
            // Note: Sanity needs a stable ID for createOrReplace. We'll use the slug as ID.
            const id = `tour-${tour.slug}`
            await client.createOrReplace({ _id: id, ...doc })
            console.log(`✅ Successfully Imported: ${tour.title}`)
        } catch (err) {
            console.error(`❌ Failed to import Tour: ${tour.title}`, err.message)
        }
    }

    console.log('\n✨ Migration finished!')
}

migrate().catch(console.error)
