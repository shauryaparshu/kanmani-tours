# Changelog

## [2026-11-05] Homepage hero and trust band from the owner's mockup (branch `redesign/premium-reskin`)
### Changed
- Homepage hero: copy on paper beside an arch-shaped photo slideshow framed by gold botanical line art (`HomeHero`, `Botanicals`). The cinema-banner group photo opens the slideshow
- Hero photos are never cropped: each photo is shown at its own shape (read from the file header by `src/lib/image-size.ts`), with the gold arch drawn around and above it and the line art kept outside the photo
- Founder section rebuilt from the owner's second mockup (`FounderStory`): gold-framed portrait, a line-drawn bridge, three story cards that lift and highlight on hover, the founder's quote, role pills and a "Read Our Full Story" link to About. Its text is now translated in `ja.json`
- Navigation: solid paper bar on every page (no longer transparent over the homepage), gold logo, `EN | 日本語` divider, ENQUIRE button with soft corners and a shadow
- New tokens: `--color-gold`, `--color-gold-deep`, `--radius-soft`, `--radius-card`, `--radius-photo`, `--radius-pill`, `--shadow-button`, `--shadow-card`, `--shadow-card-hover`

## [2026-11-05] Premium reskin, direction A "Programme" (branch `redesign/premium-reskin`)
### Changed
- Every page now uses the design system (`src/app/tokens.css` + CSS Modules): shared shell, homepage, tour lists and detail, About, Gallery and gallery albums, FAQ, contact, Japan group inquiry, services, moving, airport transfer, the RMK private gallery and its login, and a new localised 404 page
- Contact and group inquiry forms restyled only: same fields, validation rules, honeypot, phone input props and `/api/contact` payloads. Labels are tied to fields; errors use `aria-invalid`/`aria-describedby` and an icon
- All UI strings for the restyled pages are in `messages/en.json` and `messages/ja.json` (English-only pages mirror English in `ja.json`)
- Static rendering: the locale layout and pages call `setRequestLocale`, both locales are prerendered, and pages that read Sanity revalidate every 60 seconds. The RMK gallery and login stay dynamic
- Gallery albums (`/gallery/[slug]`) render on the server and return a real 404 for unknown or upcoming tours

### Fixed
- Tour list filters no longer drop the list from the prerendered HTML (they read the URL after hydration)

### Removed
- Legacy `globals.css` (3,200 lines, including the `p, li` 19px `!important` rule and the old `:root` variables), the Cormorant Garamond and Jost fonts, the `data-ds` migration markers, `airport-transfer.css` and `MoreDetailsButton`

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
