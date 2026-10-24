# Project Architecture

## Tech Stack
- **Frontend**: Next.js (App Router)
- **CMS**: Sanity (Headless CMS)
- **Deployment**: Vercel
- **Internationalization**: next-intl (Supporting English and Japanese)

## Directory Structure & Purpose
- `/docs`: Project documentation and guides.
- `/src/app`: Next.js App Router pages and layouts.
- `/src/components`: Reusable UI components.
- `/src/lib`: Data access (Sanity with local JSON fallback) and shared helpers.
  - `/src/lib/site.ts`: Production URL, canonical/hreflang and Open Graph helpers.
  - `/src/lib/server`: Server-only helpers (rate limiting, HTML escaping, gallery auth).
- `/src/sanity`: Sanity client configuration, schemas, and GROQ queries.
- `/src/app/globals.css`: Global styles. Fonts are loaded in `/src/app/fonts.ts` via `next/font`.
- `/public`: Static assets (images, icons).

## Sanity & Frontend Connection
Sanity acts as the content repository. The frontend connects to Sanity using the `@sanity/client` or `next-sanity` library. 
1. **Schemas**: Defined in `/src/sanity/schemaTypes`, which dictate the data structure in the Sanity Studio.
2. **Data Fetching**: GROQ queries are used to fetch content from Sanity.
3. **Rendering**: The fetched data is typed using interfaces in `/src/types` and rendered within Next.js components and pages.
