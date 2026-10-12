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
  console.log("Starting migration: patching 'humanitarian' photos to 'student-phd'...")

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

    let humanitarianCount = 0
    const patches: Record<string, string> = {}

    for (const photo of photos) {
      if (!photo._key) {
        console.warn("Skipping photo without _key:", photo)
        continue
      }

      if (photo.era === 'humanitarian') {
        patches[`founderPhotos[_key=="${photo._key}"].era`] = 'student-phd'
        humanitarianCount++
      }
    }

    if (humanitarianCount === 0) {
      console.log(`No 'humanitarian' photos found to migrate in document '${doc._id}'.`)
      continue
    }

    console.log(`Found ${humanitarianCount} photo(s) with era 'humanitarian' in '${doc._id}'.`)
    console.log(`Applying patch to set era to 'student-phd'...`)

    try {
      await client
        .patch(doc._id)
        .set(patches)
        .commit()

      console.log(`Successfully patched ${humanitarianCount} photo(s) from 'humanitarian' to 'student-phd' in document '${doc._id}'.`)
    } catch (error) {
      console.error(`Failed to patch document '${doc._id}':`, error)
    }
  }

  console.log("\nMigration completed.")
}

migrate()
