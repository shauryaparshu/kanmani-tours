# Kanmani Tours: Design System

Status: v1, approved. Direction A "Programme" and its palette were approved by the owner on 2026-10-24. The type scale, spacing and motion values below were approved as they are on 2026-11-05.

Code: `src/app/tokens.css` (values) and `src/app/fonts.ts` (font loading). Rules for working here: `docs/design-principles.md`.

After a section is migrated, its components use only these tokens. No hex values, font names, or pixel sizes inside components (principles §4).

---

## 1. Direction in one paragraph

The site is set like the printed programme Japanese filmgoers buy at the cinema, and like the *shiori* (旅のしおり) booklet every Japanese school trip hands out: matte paper, one large photograph, the title set big, and a credits block that lists dates, cities and seats. One visual language serves both audiences: Japanese travellers going to India, and Indian groups going to Japan. Brand feel: **warm, personal, trusted**. Dr. Kanmani's own voice is part of the design, not hidden behind it.

## 2. Colour

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--color-paper` | `#F6F1E7` | Page background | |
| `--color-paper-deep` | `#EDE5D6` | Alternate section band | ink 13.7 : 1 |
| `--color-surface` | `#FCFAF5` | Credits panel, form fields | ink 16.4 : 1 |
| `--color-ink` | `#1F1B17` | Text; dark bands | 15.2 : 1 on paper |
| `--color-ink-muted` | `#5C554D` | Secondary text on paper | 6.5 : 1 on paper |
| `--color-on-ink` | `#F6F1E7` | Text on ink and on photos | 15.2 : 1 on ink |
| `--color-on-ink-muted` | `#B5AB9C` | Secondary text on ink | 7.6 : 1 on ink |
| `--color-line` | `#DDD4C5` | Hairline separators (decorative only) | |
| `--color-line-strong` | `#8C8276` | Form field borders | 3.4 : 1 on paper |
| `--color-accent` | `#A8352A` | Vermilion: buttons, links, active filter, focus | 5.8 : 1 on paper; paper on it 5.8 : 1 |
| `--color-accent-deep` | `#8A2A21` | Hover and pressed | paper on it 7.7 : 1 |
| `--color-highlight` | `#C99A2E` | Turmeric: on ink only | 6.6 : 1 on ink; **2.3 : 1 on paper, never use there** |
| `--color-error` | `#8E2A20` | Form errors, always with text | 7.5 : 1 on paper |
| `--color-success` | `#2E6142` | Form success, always with text | 6.4 : 1 on paper |
| `--scrim-photo` | gradient | Under any text set on a photo (tour cards) | paper text 8.3 : 1 or better |
| `--scrim-hero` | gradient | Under the homepage headline and destination tiles | paper text 5.1 : 1 even over white sky |
| `--scrim-nav` | gradient | Under the transparent nav on the homepage hero | paper text 5.1 : 1 over white sky |
| `--scrim-side` | gradient | Copy set at the left of a busy photo | adds to `--scrim-hero` |
| `--scrim-top` | gradient | Labels at the top of a photo (card location) | |

Rules:
- **Restraint.** Vermilion marks what you can act on (buttons, links, the active filter, focus) and the credits labels. Headings are ink, not vermilion.
- Turmeric appears only on ink bands: small rules, dots, the footer.
- Text on a photo always sits on `--scrim-photo`.
- Errors never rely on colour alone; each one has a message and an icon.

Vermilion is the shared red of Indian kumkum and the ink of Japanese seals (朱肉), not a borrowed luxury burgundy.

## 3. Type

| Role | Latin | Japanese | Token |
|---|---|---|---|
| Display and headings | Newsreader (variable, optical sizing) | Shippori Mincho 400 / 500 | `--font-display` |
| Body, UI, labels | DM Sans (variable, optical sizing) | Noto Sans JP | `--font-body` |

Each token lists the Latin face first; Japanese characters fall through to the Japanese face in the same stack. All four families are under the **SIL Open Font License**, verified in the `google/fonts` METADATA files on 2026-10-24, and self-hosted through `next/font`.

### Scale (six sizes, fluid from 390px to 1440px)

| Token | Phone | Desktop | Line height | Use |
|---|---|---|---|---|
| `--text-display` | 40px | 72px | 1.06 | Hero headline, one per page |
| `--text-heading` | 30px | 46px | 1.12 | Section headings |
| `--text-title` | 22px | 30px | 1.2 | Card titles, subsections |
| `--text-lead` | 18px | 21px | 1.5 | Intro paragraph under a heading |
| `--text-body` | 16px | 17px | 1.65 (Japanese 1.9) | Running text |
| `--text-label` | 13px | 13px | 1.3 | Nav, buttons, credits labels (uppercase, `--tracking-caps`) |

Rules:
- Display and headings in Newsreader **light (300)**; body in DM Sans regular (400); labels medium (500).
- Running text is capped at `--measure` (65 characters).
- Headings use `text-wrap: balance`; Japanese headings add `word-break: auto-phrase` so lines break between words, not mid-word.
- **Never italicise or letter-space Japanese.** Shippori Mincho has no italic, so the browser would fake one.
- Numbers in dates, prices and seats use `.num` (lining, tabular).
- **No eyebrow labels above headings.** The heading carries its own weight; metadata lives in the credits line.

## 4. Space and layout

- Base unit 8px: `--space-1` (8) through `--space-8` (128), plus `--space-half` (4).
- **One section padding** for every section: `--section-pad`, 64px on phones to 128px on desktop.
- Page side margin `--gutter`, 20px to 64px. Content container `--container`, 1240px.
- Rhythm: alternate image-left and image-right, overlap offset photo pairs, and break the column with full-bleed photo bands. Never a row of three identical cards.
- Tight inside a group, generous between groups, and more space above a heading than below it.

## 5. Shape and depth

- `--radius: 0`. Square corners everywhere; the page is paper.
- Separation comes from `--rule` hairlines and the dotted leaders of the credits block, not from boxes.
- One shadow, `--shadow-float`, and only for things that float above the page: dropdowns, the mobile menu, the lightbox controls.

## 6. Motion

- One idea per section. The site's signature: **photos develop**, fading up from slightly muted to full colour as they enter the screen.
- Hover and focus: `--dur-hover` (200ms). Reveals: `--dur-reveal` (750ms). Easing: `--ease-out`.
- Everything starts from a visible resting state; content is never hidden waiting for scroll.
- `prefers-reduced-motion` sets every duration to 1ms (already wired in `tokens.css`).

## 7. Component contracts (built from step 2 onwards)

- **Credits block.** Label (uppercase, `--text-label`, vermilion) · dotted leader · value (`.num` where numeric). Rows: dates, cities, seats left, booking type, guide language. For Japan group visits, the same block reads like a *shiori*: dates, cities, group size, what's included.
- **Tour card.** Tall photo (3:4), title on the photo over the scrim, location at the top of the photo, credits line below. Status ("Past") stated in text, not colour alone.
- **Primary button.** Filled vermilion, paper text, square, uppercase label. One per section.
- **Text link.** Uppercase label, 1px underline offset 0.22em, vermilion.
- **Enquire tab.** Fixed on the left edge on every page; opens the existing contact page. The site's single main action.
- **Forms.** Label above the field, `--color-line-strong` border, `--color-surface` fill, error text below in `--color-error` with an icon.
- **Focus.** 2px outline in `--focus-color`, offset 3px. On ink bands (`.surface-ink`) it switches to turmeric.

## 8. Browser surfaces

Themed site-wide in `tokens.css`: text selection (vermilion), caret and native controls (`accent-color`), focus rings, link underline offset and thickness. The scrollbar is themed with the shell in step 2.

## 9. Content rules that affect design

- **English is the launch priority**; Japanese follows. Every component is still tested with real Japanese strings so translations drop in without layout fixes.
- Testimonials: the three current ones, in English on both language versions.
- Trust: no logo row. The footer shows Infirise Private Limited and contact details only. Nothing invented.
- Hero: the 9 real tour photos as a slow slideshow. No video.
- Real photography only; identifiable clients need consent (principles §8).

## 10. Rejected on sight

Eyebrow labels above headings. Gradient text. Three identical cards. Glass or blur as decoration. Shadows other than `--shadow-float`. Coloured side borders on cards. Emoji or Unicode glyphs as icons. Turmeric on paper. Hard-coded colours, sizes or font names in migrated components.

## 11. Migration notes

The migration finished on 2026-11-05. Every page uses these tokens and CSS Modules.

- `src/app/globals.css` is now only a small base (box sizing, reset, body font and colours from the tokens). Do not add component styles there.
- The `data-ds` markers, the legacy `p, li` rule, the old `:root` variables and the Cormorant Garamond and Jost fonts are gone.
- Japanese line-breaking rules in `tokens.css` apply site-wide (`:root:lang(ja) body`).
- Shared form styles live in `src/components/forms/Form.module.css`; the enquiry page layout in `src/components/contact/EnquiryPage.module.css`; the services pages in `src/components/services/ServicePage.module.css`.

## 12. Homepage exceptions (owner's mockup, approved 2026-11-05)

The owner supplied mockups for the homepage hero and the founder section below it. It deliberately departs from some rules above; these departures apply **only** where listed.

- **Gold on paper.** `--color-gold` (#B8924F) is for line art, frames, icons, pill and button borders only, never text (2.6 : 1). Gold text on paper uses `--color-gold-deep` (#87652A, 4.7 : 1): the hero eyebrow and the logo wordmark. Turmeric (`--color-highlight`) is still ink-only.
- **Hero frame.** One fixed frame (1.75 : 1 desktop, 1.6 : 1 phone); photos cover it anchored to the top (`object-position: 50% 0`), so faces stay and only the bottom is trimmed. A thin gold arch rises above it; the botanical line art sits outside the photo. New hero photos should keep people in the upper part of the picture.
- **Rounded shapes.** The founder portrait (`--radius-photo`) in a gold frame with heavier corner accents, the story cards (`--radius-card`, `--shadow-card`, lifting to `--shadow-card-hover` on hover; numerals in `--color-gold-deep` so they pass contrast), the quote panel (`--radius-card` on `--color-paper-deep`) and the role badges and founder link (`--radius-pill`). Everything else stays square.
- **Soft buttons.** The hero buttons and the nav ENQUIRE button use `--radius-soft` (3px); filled vermilion buttons there carry `--shadow-button`.
- **Eyebrows.** The hero ("East & West Bound Journeys") and the founder section ("Our Founder's Story", underlined in vermilion) each have one. No other heading gets one.
- **Botanical line art** (`src/components/home/Botanicals.tsx`) is drawn as SVG paths from code: lotus, leaf sprigs and five-petal flowers, gold strokes with paper fill. Decorative and hidden from assistive tech.
