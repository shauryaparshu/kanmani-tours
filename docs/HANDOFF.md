# Kanmani Tours: Handoff Brief for the Next Claude Agent

Written 2026-11-05 by the previous Claude Code agent (Opus 5.5) for the agent taking over this project on a new Claude account. It covers what the project is, how it is wired, where it runs, what has been done, what is left, and the rules the owner has set. Read all of it before you change anything.

Your previous self kept private notes ("memories") outside this folder. They will not carry over, so everything that matters from them is copied into section 12.

---

## 0. Read this first: the non-negotiable rules

1. **Never `git push`, never open a pull request, never merge into `main`, never deploy** unless the owner types explicit permission in the chat for that specific action. Pushing is also blocked mechanically: `remote.origin.pushurl` is set to `DISABLED`. Do not remove that setting.
2. **Never commit unless the owner asks.** The owner's standing preference is that changes stay unstaged for their review. The one exception: `docs/design-principles.md` §11 allows small local commits on `redesign/premium-reskin`, one per reskin step, and the previous agent made those. When unsure, ask.
3. **Work on `redesign/premium-reskin`.** Never edit `main`.
4. **Protected files** (ask before touching): Sanity schemas and queries (`src/sanity/**`), API routes (`src/app/api/**`), auth code (`src/lib/server/memoriesAuth.ts`, the auth check in `src/app/[locale]/rmk-japan-2026/page.tsx`), env files, `vercel.json`, `next.config.ts`, `src/proxy.ts`. The contact form files (`src/components/forms/ContactForm.tsx`, `src/app/[locale]/contact/page.tsx`) and `GroupInquiryForm.tsx` need the owner's explicit OK before edits.
5. **Never print, log, commit or send secrets** from `.env.local`. Read key names only.
6. **Read `docs/design-principles.md` before any UI work**, and say which principle each change follows.
7. **How the owner wants work run:** batch any decisions that are genuinely theirs into one question up front, then work autonomously end to end, showing a text progress bar after each step, for example `[████░░░░░░] 40% (4/10)`. Verify every step with real evidence (typecheck, build, screenshots at 390px and 1440px) before ticking it off. Report failures honestly.
8. Security findings are reported and fixed separately from design work, never mixed into design commits.

---

## 1. What the business is

**Kanmani Tours** (operated by **Infirise Private Limited**) runs tours in both directions between Japan and India:
- **Japanese travellers to South India**: celebrity-related tours (South Indian cinema: Kollywood, Tollywood), studio access, food tours, cultural tours, with Japanese-speaking guides. This was the original business.
- **Indian groups to Japan**: for example school groups. The current one is **RMK Residential Senior Secondary School, Japan Educational Tour, October 2026**, which has a private password-protected photo gallery on the site.

The founder is **Dr. Kanmani**; her personal story is a core part of the brand (About page, homepage founder story).

Public contacts used on the site: phone `+91 95977 16664`, email `kanmanitours@gmail.com`, Instagram `kanmani_tours`, plus Facebook, X, LINE and YouTube handles `kanmanitours`.

---

## 2. Where everything lives

| Thing | Where |
|---|---|
| Local folder | `C:\Users\shour\.gemini\antigravity\playground\kanmani-tours` (Windows 11) |
| GitHub repo | `https://github.com/shauryaparshu/kanmani-tours` (owner's GitHub user: `shauryaparshu`) |
| Production site | **https://www.kanmanitours.com** (canonical host). The apex `kanmanitours.com` 308-redirects to `www`. |
| Hosting | **Vercel**, project `kanmani-tours` (link details in `.vercel/project.json`, gitignored). Old Vercel URL `srikan-tours-kuox.vercel.app` redirects to the real domain via `vercel.json`. Pushes to `main` auto-deploy to production; other branches get preview deployments. |
| CMS | **Sanity**, project ID `31klefy7`, dataset `production`. The Studio is embedded in the site at **`/studio`** (`src/app/studio/[[...index]]`, config in `sanity.config.ts`). |
| Analytics | Vercel Web Analytics (`<Analytics />` in the locale layout) |
| Contact form delivery | Google Sheet (via a Google Apps Script webhook) **and** email via **Resend** |
| RMK gallery photos | A Google Drive folder, read through the Drive API v3 with an API key |

The project was originally named "Srikan Tours"; any leftover "Srikan" is old branding. `package.json` still says `"name": "solitary-astro"` (scaffold leftover, harmless).

---

## 3. Tech stack

- **Next.js 16.1.6** (App Router, React 19, TypeScript). Note: in Next 16 the middleware file is **`src/proxy.ts`**, not `middleware.ts`.
- **next-intl 4** for i18n. Locales `ja` (default) and `en`, `localePrefix: 'as-needed'`.
- **Sanity 5** + `next-sanity` 12, plugins: orderable-document-list, vision, media, image-asset-picker.
- **Styling:** plain CSS. Design tokens in `src/app/tokens.css`; redesigned components use **CSS Modules** next to the component. The legacy global stylesheet is `src/app/globals.css` (~3,200 lines, being shrunk). No Tailwind.
- **Fonts:** self-hosted through `next/font` in `src/app/fonts.ts`.
- **Icons:** `lucide-react`. Phone input: `react-phone-number-input`.
- **Node:** v24 locally. `.npmrc` has `legacy-peer-deps=true` (needed for installs).
- No test suite. Verification = `npx tsc --noEmit`, `npm run lint`, `npm run build`, and screenshots in a real browser (Playwright MCP is available).

### Commands
```bash
npm install          # legacy-peer-deps is set in .npmrc
npm run dev          # regenerates public/assets/gallery-index.json, then next dev (http://localhost:3000)
npm run build        # same index step, then next build
npm run lint
npx tsc --noEmit     # passed clean on 2026-11-05 at commit afe00c6
```
Windows gotcha: Git Bash rewrites `/path` arguments to native programs into Windows paths. Set `MSYS_NO_PATHCONV=1` when passing URL paths to node or curl helpers.

---

## 4. Routing and URLs

- All pages live under `src/app/[locale]/...`.
- **Japanese is the default locale and has no prefix**: `/about` is Japanese, `/en/about` is English. `/ja/...` redirects to the unprefixed URL.
- `src/proxy.ts` runs the next-intl middleware. Its matcher **skips `api`, `_next`, `studio`, `assets` and any path containing a dot**. Consequence: a tour slug containing `.` 404s on the unprefixed Japanese route. Slugs must be lowercase letters, numbers and hyphens only (the Studio now validates this).
- Redirects in `next.config.ts`: `/tours/*` to `/india/tours/*` (old URLs), and `/about-kanmani` to `/about` (the duplicate page was deleted).
- `src/lib/site.ts` builds canonical and hreflang URLs (`SITE_URL = https://www.kanmanitours.com`) and Open Graph blocks. Use `pageAlternates()` and `pageOpenGraph()` on every new page.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`. `/studio` and `/api/` are disallowed. The RMK gallery is deliberately **not** in robots.txt (it is `noindex` and password-gated instead).

### Pages
| Route | File | Status in reskin |
|---|---|---|
| `/` home | `src/app/[locale]/page.tsx` | Redesigned |
| `/india/tours`, `/india/tours/[slug]` | `src/app/[locale]/india/tours/...` | Redesigned |
| `/japan/tours`, `/japan/tours/[slug]` | `src/app/[locale]/japan/tours/...` | Redesigned |
| `/about` | `src/app/[locale]/about/page.tsx` | Redesigned |
| `/gallery` | `src/app/[locale]/gallery/page.tsx` | Redesigned |
| `/gallery/[slug]` | `src/app/[locale]/gallery/[slug]/page.tsx` | **Not yet** (old classes) |
| `/faq` | `src/app/[locale]/faq/page.tsx` | Redesigned |
| `/contact` | `src/app/[locale]/contact/page.tsx` + `components/forms/ContactForm.tsx` | **Not yet. Owner OK required.** |
| `/japan/groups` | `src/app/[locale]/japan/groups/page.tsx` + `GroupInquiryForm.tsx` | **Not yet** (unlinked group inquiry page; form, so owner OK required) |
| `/services`, `/services/moving`, `/airport-transfer` | under `src/app/[locale]/` | **Not yet** (`SHOW_SERVICES_NAV = false`, so the nav hides them) |
| `/en/rmk-japan-2026` (+ `/login`) | `src/app/[locale]/rmk-japan-2026/...` | **Not yet.** May be restyled; auth lines untouched. English only (ja returns 404). |
| `/studio` | Sanity Studio | Not part of the site design |

Feature flags: `src/lib/featureFlags.ts` (`SHOW_JAPAN_DESTINATION = true`, `SHOW_SERVICES_NAV = false`). RMK group details: `src/lib/tourGroup.ts`.

---

## 5. Data flow: Sanity first, local JSON as fallback

- `src/sanity/env.ts` holds the project ID, dataset and API version used by the site (hardcoded, public values). `src/sanity/lib/client.ts` creates the client (`useCdn: false`, `perspective: 'published'`).
- GROQ queries: `src/sanity/lib/queries.ts` (tours, tours by destination, tour by slug, FAQs, categories, countries, gallery, testimonials, founder photos).
- Image URL helpers: `src/sanity/lib/image.ts`.
- **Data access layer in `src/lib/`**:
  - `tours.ts`: `getAllTours`, `getToursByDestination`, `getUpcomingTours`, `getTourBySlug`, date and price formatting. It fetches from Sanity with `revalidate: 60` and **falls back to `src/data/tours.json`** if Sanity fails or returns nothing. `normaliseTour()` picks the Japanese fields (`titleJa`, `featuresJa`, and so on) when the locale is `ja`. Tours with no start date and not marked "coming soon" are hidden (they used to show "Jan 1, 1970").
  - `testimonials.ts`, `categories.ts`, `countries.ts`: same pattern, Sanity with fallbacks.
  - `server-images.ts`: reads image folders under `public/` at request time (homepage hero uses `public/assets/img/home/hero`).
  - `site.ts`: URLs and SEO helpers (above). `server/`: `rateLimit.ts` (in-memory, per instance, best effort), `escapeHtml.ts`, `memoriesAuth.ts`.
- **Sanity schemas** (`src/sanity/schemaTypes/`): `tour` (with `tourDay` itinerary), `tourCategory`, `country`, `faq`, `celebrity` (old fan-vote poll, now unused on the site), `testimonial`, and the singleton `about` (founder page and photos). Custom Studio inputs live in `src/sanity/components/`. Tour `destination` is `india` or `japan`; `bookingType` is `private` or `group`.
- Static params: tour detail pages use `generateStaticParams`. Most data is ISR with 60s revalidation.
- `public/assets/gallery-index.json` is generated by `scripts/generate-gallery-index.mjs` on every dev and build run. Videos are not indexed because `.gitignore` and `.vercelignore` exclude them from deploys.
- `scripts/` holds one-off seed and migration scripts for Sanity (seed tours, FAQs, categories, celebrities; migrate About content; fix duplicates). They need `SANITY_API_TOKEN` (some older ones read `SANITY_WRITE_TOKEN` or `SANITY_TOKEN`). **They write to the live production dataset. Do not run any of them without the owner's permission.**

---

## 6. API routes (backend, protected)

- **`POST /api/contact`** (`src/app/api/contact/route.ts`): used by the contact form and group inquiry form. Validates and length-limits fields, honeypot field `website`, rate limit 5 per IP per 10 minutes, escapes all input in the email HTML. Sends in parallel to the Google Sheet webhook and Resend (`from: onboarding@resend.dev`, to `CONTACT_EMAIL`). Succeeds if at least one channel worked. **If any of `GOOGLE_SHEET_WEBHOOK`, `RESEND_API_KEY`, `CONTACT_EMAIL` is missing, it returns 500.**
- **`POST /api/memories-auth`**: RMK gallery login. Rate limit 10 per IP per 15 minutes, constant-time password check, sets the httpOnly cookie `memories_access` (120 days) to `MEMORIES_SESSION_TOKEN`.
- **`GET /api/memories-drive`**: lists the Drive folder's photos for the RMK gallery, only with a valid cookie. Validates Drive folder IDs.

Accepted risk (owner's decision): the Drive folder is shared as "anyone with the link", which the API key needs. The password only hides the page. Making it truly private would need a Google service account.

---

## 7. Environment variables

Template: `.env.example` (committed). Real values: `.env.local` (gitignored, exists locally) and in the Vercel project settings for production. Keys:

| Key | Used by |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Scripts and `sanity.cli.ts` (the site itself reads `src/sanity/env.ts`) |
| `SANITY_API_TOKEN` | Write token for scripts only |
| `RESEND_API_KEY`, `GOOGLE_SHEET_WEBHOOK`, `CONTACT_EMAIL` | `/api/contact` |
| `MEMORIES_GALLERY_PASSWORD`, `MEMORIES_SESSION_TOKEN` | RMK gallery login. Changing the token logs everyone out. |
| `MEMORIES_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_API_KEY` | RMK gallery photos |

---

## 8. Git state (as of 2026-11-05)

- **Current branch: `redesign/premium-reskin`** at `afe00c6`. Never pushed.
- **`origin/main` = `117549d`** ("Merge feature/two-way-tours"). This is what production runs.
- Reskin history (oldest first), built on `1382124` "WIP checkpoint before redesign":
  - `d41d1fb` design principles and references
  - `fddce9e` step 1: tokens, fonts, design-system doc (direction A "Programme")
  - `11e859b` step 2: shared shell (nav, Enquire tab, footer, back-to-top)
  - `e96cf87` step 3: homepage
  - `ab8456b` step 4: tour list pages (India and Japan) and shared page header
  - `d136ee6` step 5: tour detail page (India and Japan)
  - `afe00c6` step 6: About, Gallery and FAQ pages
- **`fix/pre-reskin-fixes`** (`4187be8`, branched from `main`): the 2026-10-24 security, SEO and performance fix pass (see `docs/CHANGELOG.md`). Its file tree is identical to `1382124`, so the reskin branch already contains those fixes. The **owner pushes this branch themselves**. Before it goes live, production must have `GOOGLE_SHEET_WEBHOOK`, `RESEND_API_KEY` and `CONTACT_EMAIL` set in Vercel, or the contact form will return errors.
- Many older feature and fix branches exist locally and on origin; they are history. Do not delete or rebase them.
- Untracked and intentionally not committed: `.agents/` (installed `web-design-guidelines` skill), `.mcp.json` (magicui MCP server), `.playwright-mcp/` (screenshots and console logs from verification runs), `skills-lock.json`, and this handoff's `CLAUDE.md` and `docs/HANDOFF.md` until the owner decides.

---

## 9. The redesign ("premium reskin")

**Goal:** make the site feel premium, calm, fast and trustworthy. It is a visual reskin, **not a rebuild**: backend, CMS content, queries, APIs, auth and deployment must keep working unchanged.

**Chosen direction: A · "Programme".** The site is set like a Japanese cinema programme and the *shiori* booklet of a Japanese school trip: matte paper, one large photograph, big titles, and a "credits" block per tour (dates, cities, seats, booking type, guide language) with dotted leaders. One visual language serves both audiences. The direction comparison page the owner chose from: https://claude.ai/artifact/CcFYBap3RnUtKQZVdEesyh (it was on the previous Claude account; you may not be able to open it).

**Palette:** paper `#F6F1E7`, ink `#1F1B17`, vermilion accent `#A8352A`, turmeric highlight `#C99A2E` (on dark ink bands only, never on paper). Square corners, hairline rules, one shadow for floating things only.
**Type:** Newsreader (display, light 300) + DM Sans (body); Japanese: Shippori Mincho + Noto Sans JP. All SIL OFL, self-hosted. Six-size fluid scale.
**Motion:** one idea per section; the signature is photos "developing" from muted to full colour. Respect `prefers-reduced-motion`.

**Documents that define it (read in this order):**
1. `docs/design-principles.md`: the rules, quality checklist, accessibility and performance gates, and agent process rules. Source of truth.
2. `docs/design-system.md`: the approved tokens, type scale, component contracts (credits block, tour card, buttons, Enquire tab, forms, focus) and migration notes. All of it is approved (palette 2026-10-24; type scale, spacing and motion 2026-11-05).
3. `docs/references/notes.md`, `adams-and-butler.md`, `y-co.md`: the inspiration sites (structure only, never copy).
4. Code: `src/app/tokens.css` (all values), `src/app/fonts.ts`.

**Migration mechanics:**
- Each redesigned component has its own `*.module.css` and uses only tokens: no hex values, font names or pixel sizes inside components.
- `globals.css` still forces every `p` and `li` to 19px with `!important` for the old pages. Redesigned components put the **`data-ds` attribute** on their root to opt out. That rule, the old `:root` variables (`--primary`, `--bg-color`, ...) and the old fonts Cormorant Garamond and Jost are removed in the final step.
- Every step is checked at 390px and 1440px, with Japanese strings too, before its commit.

**Owner's answers (2026-10-24) that shape the design:**
- Brand feel: **warm, personal, trusted.**
- Audience: both directions equally.
- Main action on every page: the existing contact form, reached through the Enquire tab and `/contact`.
- The lotus logo stays, recoloured.
- **English must be perfect first**, Japanese after. `ja` stays the default locale, but test every layout with real Japanese strings.
- No trust or logo row. The footer shows Infirise Private Limited and contact details only. Never invent credentials.
- Testimonials: the current three, in English on both locales.
- Hero: the 9 real tour photos as a slow slideshow. No video.
- Real photography only. No stock or generated images presented as real.
- The RMK gallery may be restyled, but the auth lines stay untouched.
- Static rendering should be added as its own commit.

**Owner's answers (2026-11-05) for the remaining steps:**
- `/contact`, `ContactForm.tsx`, `/japan/groups` and `GroupInquiryForm.tsx` may be restyled: visuals and markup only. No change to fields, validation, the honeypot, the phone input or the API payload. `/japan/groups` stays unlinked (shared with schools directly).
- Services, moving and airport-transfer: redesign simply with existing components; no page may stay on the old styles. Ask before any page needs a lot of new design.
- RMK: the JSX of `rmk-japan-2026/page.tsx` may change; the cookie check, redirect, non-English `notFound` and metadata/robots lines stay exactly as they are.
- Static rendering as its own commit; keep the 60-second revalidation; RMK stays dynamic.
- Type scale, spacing and motion values approved as they are.
- One local commit per step on `redesign/premium-reskin`. Never push.

### What is left to do (suggested order; confirm with the owner first)
1. `/contact` page and `ContactForm.tsx` (**get the owner's OK first**; keep the API contract, field names and honeypot unchanged).
2. `/japan/groups` and `GroupInquiryForm.tsx` (same rule).
3. `/gallery/[slug]` detail page.
4. `/services`, `/services/moving`, `/airport-transfer` (hidden from nav; ask whether to redesign, keep or retire them).
5. RMK gallery and its login page (restyle only; `DriveGallery.tsx` and `MemoriesLoginForm.tsx` are UI, the cookie and redirect logic in `page.tsx` is not to be touched).
6. Static rendering commit (the owner asked for it as a separate commit).
7. Final cleanup: delete the `p, li` `!important` rule, the old `:root` variables, Cormorant and Jost, the `data-ds` markers, and the remaining dead CSS in `globals.css`. Update `docs/design-system.md` and `docs/CHANGELOG.md`.
8. Full verification pass: typecheck, lint, build, Lighthouse mobile (90+ Performance and Accessibility, LCP ≤ 2.5s, CLS ≤ 0.1), keyboard and screen reader checks, both locales, 390px and 1440px.
9. Then **the owner** decides about pushing, the PR into `main`, and deployment.

---

## 10. Folder map

```
src/
  app/
    [locale]/            pages (see section 4); layout.tsx = html/body, fonts, nav, Enquire tab, analytics
    api/contact/         enquiry endpoint (protected)
    api/memories-auth/   RMK gallery login (protected)
    api/memories-drive/  RMK gallery photo listing (protected)
    studio/              embedded Sanity Studio
    tokens.css           design tokens (new system)
    globals.css          legacy global CSS, shrinking
    fonts.ts             next/font definitions
    sitemap.ts, robots.ts
  components/
    layout/   Navigation, FooterSection, EnquireTab, BackToTop, PageHeader, Logo (redesigned)
    home/     HomeHero, FounderStory, Destinations, Journeys, WhyUs, TestimonialQuote (redesigned)
    tours/    TourList, TourCard, ToursComingSoon, detail/TourDetail, detail/TourGallery, helpers (redesigned)
    about/    FounderIntro, FounderChapters, AlbumGrid, founderPhotos.ts (redesigned)
    gallery/  GalleryEvents (redesigned)
    faq/      FaqList (redesigned)
    ui/       UnifiedLightbox (redesigned modal dialog), Develop (photo "develop" effect), ArrowBox, useReducedMotion, MoreDetailsButton (old)
    forms/    ContactForm, GroupInquiryForm (old; owner OK before edits)
  lib/        data access + helpers (section 5)
  sanity/     env, client, queries, image helpers, schemas, Studio inputs (protected)
  i18n/       routing.ts (locales), request.ts (loads messages)
  proxy.ts    next-intl middleware (Next 16 name for middleware)
  data/       tours.json, faq.json, about.json: local fallbacks
messages/     en.json, ja.json: all UI strings. Add new strings to BOTH files.
public/assets/ images (img/home/hero = hero slideshow; img/tours/<slug>/...; logo.svg; og-default.jpg)
public/images/ older image set, partly still referenced
scripts/      Sanity seed and migration scripts (write to production; ask first)
docs/         this brief, design principles, design system, references, architecture, deployment, changelog, image management
```

Older docs to read with care: `docs/ARCHITECTURE.md` and `docs/DEPLOYMENT.md` are short and partly generic (`/src/types` mentioned there no longer exists). `docs/IMAGE_MANAGEMENT.md` describes the older filesystem image workflow; tour images now come mostly from Sanity. `README.md` is the unedited create-next-app template.

---

## 11. Open content tasks the owner was asked to do in Sanity (not code)

- Add the Japan tours in Sanity (the Japan tours page shows a "coming soon" state until then).
- Merge the dateless duplicate tour "Mr.Vijay's..." (it has 43 photos) into the real one, then delete the duplicate.
- Fix title typos: "Arrenaged" and "Hydrabad".

Do not do these yourself through scripts unless asked.

---

## 12. Notes carried over from the previous agent's memory

- Decisions of 2026-10-24: the fan-vote form and booking modal were **removed**, not wired up (both were unreachable). Tour pages use the contact route only; "Book this tour" appears only when a tour has an external booking link in Sanity, and "Booking closed" follows the Sanity toggle.
- `/about-kanmani` permanently redirects to `/about`.
- The production canonical host is `https://www.kanmanitours.com`; Japanese URLs are unprefixed.
- Slugs with a dot break the Japanese route (proxy matcher). Lowercase-hyphen only.
- `MSYS_NO_PATHCONV=1` for Git Bash URL arguments.
- The owner relies on the agent heavily ("I completely rely on you") and was explicitly worried about anything being pushed to GitHub. Be conservative with anything outward-facing.

---

## 13. Tools that were set up for this project

- **Playwright MCP** was used to screenshot pages at 390px and 1440px and read console logs (outputs in `.playwright-mcp/`).
- **magicui MCP** is configured in `.mcp.json` (enabled in `.claude/settings.local.json`).
- The **`web-design-guidelines`** skill is installed under `.agents/skills/`.
- On the new account you may need to re-authorise connectors and plugins (Vercel, Figma and so on). The Vercel CLI is not installed globally.

---

## 14. How to start

1. Read this file, then `docs/design-principles.md`, then `docs/design-system.md`.
2. Run `git status` and `git log --oneline -10` and confirm you are on `redesign/premium-reskin` at `afe00c6` or later.
3. Run `npx tsc --noEmit` and `npm run dev`, open http://localhost:3000 and http://localhost:3000/en, and compare against https://www.kanmanitours.com (production, still on the old design).
4. Tell the owner in a few lines what you understood and what you propose to do next (section 9 list), and ask the decisions that are theirs in one batch.
