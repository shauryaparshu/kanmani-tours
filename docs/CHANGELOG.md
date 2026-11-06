# Changelog

## 2026-11-06 Gold theme (branch `redesign/gold-theme`)

- New look from the owner's gold mockup, on its own branch and preview URL; `redesign/premium-reskin` is unchanged.
- Palette: champagne paper, deep brown ink, metallic gold and red gradients (`tokens.css`). Paper grain and a fixed double gold page frame with filigree corners (`PageFrame`).
- Nav (owner's second mockup): a two-tone band with a line-drawn Taj Mahal and Mount Fuji, To India and To Japan either side of a gold shield logo, About, Gallery and FAQ as pointed buttons below it, Enquire then language at the top right. The art draws in on load, the sun rises, and hovering a destination lights its side. On scroll the band shrinks to one line and the page buttons move left. Phone bar keeps the menu.
- Hero: embossed bold title, intro and slide controls in a filigree panel, gold and red lacquered buttons (`OrnateLink`), the slideshow inside a bevelled gold frame on a lattice panel with a Mughal crest (`PhotoFrame`), each photo filling it edge to edge from its top edge, so any trimming comes off the bottom, and previous/next lozenges on the frame's bottom rule.
- Sticky panels work again: `body` used `overflow-x: hidden`, which made it a scroll container and silently stopped every `position: sticky` on the site (Contact aside, About photos, FAQ side list). It is now `overflow-x: clip`. The FAQ side list scrolls inside itself on short screens. Sticky offsets use `--nav-compact`.
- Founder link uses `OrnateLink`; homepage section titles are letterpressed. Destination tiles get a dark base under their photos.

## 2026-11-06 Homepage section transitions

- New `src/components/ui/SectionReveal` wraps the founder, destinations, journeys, why-us and testimonial sections: a gold seal loader, then the section rises in as it scrolls into view. Opacity and transform only (CLS 0); off for reduced motion and no-JS.

## [2026-11-05] Homepage hero and trust band from the owner's mockup (branch `redesign/premium-reskin`)
### Changed
- Homepage hero: copy on paper beside an arch-shaped photo slideshow framed by gold botanical line art (`HomeHero`, `Botanicals`). The cinema-banner group photo opens the slideshow
- Hero slideshow sits in one fixed, larger frame (1.75 : 1 on desktop, 1.6 : 1 on phones; the hero grows to 1920px on wide screens). Photos fill it anchored to their top edge, so heads are never trimmed and only the bottom of taller photos is cut. The gold arch rises above the frame and the line art sits outside the photo
- The 9 hero photos were colour-corrected: partial white balance, adaptive brightening of dark shots, mild clarity and vibrance with skin-tone protection, chroma denoise and light sharpening (originals are in git history)
- Founder section rebuilt from the owner's second mockup (`FounderStory`): gold-framed portrait, a line-drawn bridge, three story cards that lift and highlight on hover, the founder's quote, role pills and a "Read Our Full Story" link to About. Its text is now translated in `ja.json`
- Founder section polish: cards carry a gold programme numeral, the icon in a gold ring and a short rule (ring fills vermilion and the rule extends on hover); the quote sits in a paper panel with a large gold quotation mark and the attribution on its own line ("Dr. Kanmani" never splits); the roles are icon badges in a 2 x 2 grid
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
