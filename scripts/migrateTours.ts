import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Support both CJS and ESM depending on the ts-node environment
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

async function migrate() {
  console.log("Starting migration to set default destination and bookingType on tours...")
  
  // Fetch documents that either don't have destination or bookingType set
  const query = `*[_type == "tour" && (!defined(destination) || !defined(bookingType))]`
  const documents = await client.fetch(query)
  
  if (documents.length === 0) {
    console.log("No documents found that require migration.")
    return
  }

  console.log(`Found ${documents.length} document(s) to migrate.`)

  const transaction = client.transaction()

  documents.forEach((doc: any) => {
    transaction.patch(doc._id, (p) => 
      p.setIfMissing({ 
        destination: 'india', 
        bookingType: 'private' 
      })
    )
  })

  try {
    await transaction.commit()
    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
  }
}

migrate()
