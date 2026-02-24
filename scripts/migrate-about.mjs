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
const about = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/about.json'), 'utf8'))

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '31klefy7',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-02-24',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
})

async function uploadImage(imagePath) {
    if (!imagePath) return null
    const localPath = path.resolve(__dirname, '../public', imagePath.replace(/^\//, ''))
    if (!fs.existsSync(localPath)) return null
    try {
        const imageData = fs.readFileSync(localPath)
        const asset = await client.assets.upload('image', imageData, { filename: path.basename(localPath) })
        return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    } catch (err) {
        return null
    }
}

async function migrate() {
    if (!process.env.SANITY_WRITE_TOKEN) return console.error('Token missing')

    console.log('🚀 Final Migration (About, Tours, FAQs)...')

    // About Page
    console.log('📝 Migrating About Page...')
    const heroImage = await uploadImage(about.hero.image)
    const storyImage = await uploadImage(about.story.image)

    const founders = []
    for (const m of about.founders.members) {
        const photo = await uploadImage(m.photo)
        founders.push({ ...m, photo })
    }

    await client.createOrReplace({
        _id: 'about',
        _type: 'about',
        hero: { ...about.hero, image: heroImage },
        story: { ...about.story, image: storyImage },
        founders: { title: about.founders.title, members: founders },
        visionMission: about.visionMission,
    })

    // FAQs
    for (const f of faqs) {
        await client.createOrReplace({ _id: `faq-${f.id}`, _type: 'faq', question: f.question, answer: f.answer, order: f.id })
    }

    // Tours (already done but safe to rerun)
    // ... existing tour logic ...
    console.log('✅ Migration complete!')
}

migrate()
