import { createClient } from '@sanity/client'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '31klefy7',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-02-24',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
})

async function removeDuplicates() {
    console.log('🔍 Fetching all tour documents...')

    // Fetch ALL tour documents (including duplicates)
    const allTours = await client.fetch(`*[_type == "tour"] { _id, slug, title }`)
    console.log(`Found ${allTours.length} total tour documents.\n`)

    // Group by slug
    const bySlug = {}
    for (const t of allTours) {
        const slug = t.slug?.current || t.slug
        if (!bySlug[slug]) bySlug[slug] = []
        bySlug[slug].push(t)
    }

    // Find slugs with duplicates
    const toDelete = []
    for (const [slug, docs] of Object.entries(bySlug)) {
        if (docs.length > 1) {
            console.log(`⚠️  Duplicate slug: "${slug}" (${docs.length} documents)`)

            // Keep the one with our stable ID format (tour-*), or the first published one
            // Sort: prefer IDs starting with "tour-", otherwise keep the first one
            const sorted = docs.sort((a, b) => {
                if (a._id.startsWith('tour-')) return -1
                if (b._id.startsWith('tour-')) return 1
                return 0
            })

            const keep = sorted[0]
            const deleteThese = sorted.slice(1)

            console.log(`   ✅ Keeping: ${keep._id}`)
            for (const d of deleteThese) {
                console.log(`   🗑️  Deleting: ${d._id}`)
                toDelete.push(d._id)
            }
        }
    }

    if (toDelete.length === 0) {
        console.log('\n✨ No duplicates found! Your Studio is clean.')
        return
    }

    console.log(`\n🗑️  Deleting ${toDelete.length} duplicate document(s)...`)
    for (const id of toDelete) {
        try {
            await client.delete(id)
            console.log(`   ✅ Deleted: ${id}`)
        } catch (err) {
            console.error(`   ❌ Failed to delete ${id}:`, err.message)
        }
    }

    console.log('\n✨ Cleanup complete! Refresh your Sanity Studio to see the results.')
}

removeDuplicates().catch(console.error)
