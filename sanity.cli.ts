/**
* This configuration file lets you run `$ sanity [command]` from your terminal
* @see https://www.sanity.io/docs/cli
*/
import { defineCliConfig } from 'sanity/cli'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
    api: { projectId, dataset },
    deployment: {
        appId: 'hsqcajpa98rc4evssvktv97u',
    },
})

