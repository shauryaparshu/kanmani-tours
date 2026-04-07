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
- `/src/hooks`: Custom React hooks for data fetching and logic.
- `/src/sanity`: Sanity client configuration, schemas, and GROQ queries.
- `/src/styles`: CSS variables, global styles, and tokens.
- `/src/types`: TypeScript interfaces and type definitions.
- `/public`: Static assets (icons, fonts, static images).

## Sanity & Frontend Connection
Sanity acts as the content repository. The frontend connects to Sanity using the `@sanity/client` or `next-sanity` library. 
1. **Schemas**: Defined in `/src/sanity/schemaTypes`, which dictate the data structure in the Sanity Studio.
2. **Data Fetching**: GROQ queries are used to fetch content from Sanity.
3. **Rendering**: The fetched data is typed using interfaces in `/src/types` and rendered within Next.js components and pages.
