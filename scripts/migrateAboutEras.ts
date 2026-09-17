import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error("Error: Missing required Sanity environment variables. Make sure .env.local exists and contains NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN.")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-02-24',
  useCdn: false,
})

interface FounderPhoto {
  _key: string
  era?: string
  caption?: string
}

interface AboutDocument {
  _id: string
  founderPhotos?: FounderPhoto[]
}

async function migrate() {
  console.log("Starting migration of About page photo eras...")

  // Fetch the about document (checking both published and draft versions if present)
  const query = `*[_id in ["about", "drafts.about"]]{ _id, founderPhotos[]{ _key, era, caption } }`
  const documents: AboutDocument[] = await client.fetch(query)

  if (!documents || documents.length === 0) {
    console.error("No 'about' document found in Sanity.")
    return
  }

  for (const doc of documents) {
    console.log(`\nEvaluating document: ${doc._id}`)
    const photos = doc.founderPhotos || []

    const counts = {
      tours: 0,
      conferences: 0,
      phd: 0,
      student: 0,
    }

    const patches: Record<string, string> = {}

    for (const photo of photos) {
      if (!photo._key) {
        console.warn("Skipping photo without _key:", photo)
        continue
      }

      if (photo.era === 'tours') {
        patches[`founderPhotos[_key=="${photo._key}"].era`] = 'world-travel'
        counts.tours++
      } else if (photo.era === 'conferences') {
        patches[`founderPhotos[_key=="${photo._key}"].era`] = 'achievements'
        counts.conferences++
      } else if (photo.era === 'phd') {
        patches[`founderPhotos[_key=="${photo._key}"].era`] = 'student-phd'
        counts.phd++
      } else if (photo.era === 'student') {
        patches[`founderPhotos[_key=="${photo._key}"].era`] = 'student-phd'
        counts.student++
      }
      // Note: "others" and "arts" are deliberately left untouched per specification
    }

    const totalToPatch = Object.keys(patches).length
    if (totalToPatch === 0) {
      console.log(`No photos require migration in document '${doc._id}'.`)
      continue
    }

    console.log(`Items to patch in '${doc._id}':`)
    console.log(`- tours -> world-travel: ${counts.tours}`)
    console.log(`- conferences -> achievements: ${counts.conferences}`)
    console.log(`- phd -> student-phd: ${counts.phd}`)
    console.log(`- student -> student-phd: ${counts.student}`)
    console.log(`Total patches to apply: ${totalToPatch}`)

    try {
      await client
        .patch(doc._id)
        .set(patches)
        .commit()

      console.log(`Successfully patched ${totalToPatch} photo(s) in document '${doc._id}'.`)
      console.log(`Patched counts per category:`)
      console.log(`  - tours: ${counts.tours}`)
      console.log(`  - conferences: ${counts.conferences}`)
      console.log(`  - phd: ${counts.phd}`)
      console.log(`  - student: ${counts.student}`)
    } catch (error) {
      console.error(`Failed to patch document '${doc._id}':`, error)
    }
  }

  console.log("\nMigration finished.")
}

migrate()
