# Changelog

## [2026-10-24]
### Fixed
- Webfonts (Cormorant Garamond, Jost, Noto Sans JP) were never loaded; now self-hosted via `next/font`
- Sitemap, hreflang and canonical URLs pointed at redirecting URLs (apex domain and `/ja/` prefix); all now use `https://www.kanmanitours.com` with the unprefixed Japanese URL
- Tour pages whose slug contains spaces returned 404
- Tours without a start date were listed with "Jan 1, 1970"
- Gallery index listed a video that is never deployed (404 in production)
- `npm run lint` crashed (out of memory) on the Sanity Studio build in `dist/`
- Japanese tour feature cards now read `featuresJa`; `isComingSoon` is now fetched

### Security
- Contact API escapes all user input in the notification email, validates fields, rate-limits per IP, has a honeypot, and reports failure when no delivery channel succeeded
- Memories gallery login is rate-limited and uses constant-time comparisons; Drive folder IDs are validated

### Added
- `robots.txt`, default Open Graph / Twitter share image, `metadataBase`, homepage `<h1>`
- Testimonials are editable in Sanity Studio (current ones remain as fallback)
- Slug validation in Studio (lowercase, numbers, hyphens)

### Changed
- `/about-kanmani` permanently redirects to `/about` (duplicate page removed)
- Hero images served through Next.js image optimization; oversized homepage images recompressed

### Removed
- Unreachable fan-vote form and booking modal, plus other unused components, queries and packages (`jszip`, `file-saver`)

## [2026-04-07]
### Added
- Initial professional restructure — Phase 1
- Documentation directory (`/docs`)
- Project architecture, deployment guide, and changelog templates
- TypeScript types for Tours and Categories
- Styling tokens and global CSS placeholders
- Custom hooks directory and placeholder
