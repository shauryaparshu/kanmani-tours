# Kanmani Tours: Design Principles

Status: v1 draft. Source of truth for every UI change on this site. Update it as references are added.
Rule for any AI agent working here: read this file before touching UI, state which principle each change follows, and never override it without asking.

---

## 1. What we are building
- **Business:** Kanmani Tours, a Japan-India tour company. Content is bilingual (Japanese default locale in current code, plus English).
- **Goal of this work:** a visual reskin that feels premium, calm, fast, and trustworthy. It is NOT a rebuild.
- **Hard constraint:** the existing backend must keep working (Sanity CMS content and queries, API routes, auth, environment config, deployment on Vercel). Change the look and structure of the front end only.
- **Stack (as found in the audit):** Next.js with locale routing, Sanity CMS, Vercel hosting.

### Open decisions (the owner fills these in; the agent must ask if still empty)
- Primary audience (for example: Indian families visiting Japan, Japanese travelers to India, school groups, or several)
- Three words describing the brand feel
- The single main action on every page (enquire, book, WhatsApp, call)
- Existing brand colors or logo to keep
- Languages that must be perfect at launch

---

## 2. Design direction (derived from the reference analysis)
Warm and editorial, with confident scale. Quiet luxury, not loud luxury.

- **From Adams & Butler (luxury tour operator):** a serif display face with a light sans body, warm off-white page background, one muted deep accent, slow fade-in reveals, overlapping offset images, tall image cards with the title on the photo, a nav that is transparent over the hero and becomes a solid bar on scroll.
- **From Y.CO (superyacht company):** oversized hero type with tight line height, ONE accent color used sparingly, a nav that shrinks its logo on scroll, mega-menus that include a featured item, a big heading paired with an image that slides in.
- **Take the structure, not the surface.** Both sites are inspiration only. Do not copy their photos, copy, logos, exact layouts, or paid fonts. Mix ideas from several references into one original look.

### Measured facts from the references (for calibration, not for copying)
| | Adams & Butler | Y.CO |
|---|---|---|
| Display type | serif, weight 300, 52px, line-height 1.2 | condensed grotesque, uppercase, 160px hero, line-height 0.85, tracking -0.02em |
| Body type | light sans, 17px, line-height about 1.66 | sans, 16px, line-height 1.5 |
| Page color | warm off-white | white |
| Accent | muted burgundy | one saturated yellow |
| Motion | fade reveals, sliders | slide-in images, animated search |

---

## 3. The eight-point quality checklist (grade every page against it)
1. **Point of view:** a clear, chosen direction, not a mood board.
2. **Typography:** one display face plus one body face. No default system fonts, no Inter, Roboto, or Arial.
3. **Color:** a restrained palette. Restraint signals quality.
4. **Hierarchy:** the eye knows what to read first, second, third (clear size steps).
5. **Imagery:** real photography only (see section 8).
6. **Motion:** subtle, purposeful, one idea per section.
7. **Mobile:** designed for phones, not a shrunk desktop.
8. **Invisible polish:** speed, loading states, hover and focus states, empty and error states, consistent spacing.

---

## 4. Design tokens (the agent proposes, the owner approves, then these become the only allowed values)
Write the approved values to `docs/design-system.md` and into CSS variables or the Tailwind theme. After approval, no hardcoded colors, font sizes, or spacing in components.

Constraints for the proposal:
- **Fonts:** free-license only (for example Google Fonts), checked for commercial use. Display serif candidates to evaluate: Fraunces, Cormorant Garamond, Newsreader. Sans candidates: DM Sans, Manrope. Japanese text needs its own tested pairing (for example Noto Serif JP and Noto Sans JP). Verify licenses before locking.
- **Type scale:** a fixed modular scale, fluid between mobile and desktop, with a maximum of 6 sizes.
- **Color:** warm neutral background, one deep accent, one small highlight accent, plus dark text. Minimum 4.5:1 contrast for body text. No purple-to-blue gradients, no frosted-glass cards by default.
- **Spacing:** one base unit (8px) and a short scale. Generous whitespace. One consistent section padding.
- **Shape:** one corner radius and one shadow style, used everywhere.
- **Layout:** avoid the default row of three identical feature cards. Vary rhythm: alternate image-left and image-right, offset or overlapping images, full-bleed bands.

---

## 5. Motion rules
- Maximum **one** motion idea per section. Reveal, parallax, or cursor effect, never all three.
- Hover and focus transitions: 150-300ms. Scroll reveals: 600-900ms with an ease-out curve.
- Always respect `prefers-reduced-motion`.
- GSAP is allowed (it is free for commercial use). A 3D library may be used at most once, and only if it clearly earns its weight and the page still passes the performance targets.
- If a first attempt feels obvious, make it more subtle, not busier.
- Autoplay hero video must be muted, compressed, have a poster image, and never block loading.

---

## 6. Accessibility and performance targets (release gates)
- **Accessibility:** WCAG 2.1 AA. Contrast 4.5:1 for body text. Visible focus on every interactive element. Full keyboard navigation. Labeled form fields. Touch targets at least 44px. Semantic headings in order. Meaningful alt text in each language.
- **Performance (mobile):** Lighthouse 90+ for Performance and Accessibility. LCP 2.5s or better, CLS 0.1 or better, INP 200ms or better.
- **Images:** use the framework image component, correct sizes, modern formats, lazy loading below the fold.
- **Fonts:** subset and preload only what is used, with a sane fallback to avoid layout shift.

---

## 7. Page and section patterns for a tour site
Hero with one clear action, tour or itinerary cards, day-by-day itinerary layout, what is included, real testimonials, FAQ, enquiry form, footer with contact details.
- One main idea and one main call to action per screen.
- Name the visitor's concern first (language, safety, logistics, food), then the offer.
- Make each page scannable. Short paragraphs, never walls of text.
- Navigation: simple, with a clear enquiry button always reachable. A mega-menu only if the content justifies it.

---

## 8. Imagery rules
- Use only photos and video the company owns or has written rights to. Clients who are identifiable need consent.
- No fabricated testimonials, reviews, or credentials. Display real ones only.
- Every image has alt text. Hero and key images are art-directed (crop for mobile, not just scaled).
- If an image is missing, mark a clear placeholder. Never insert stock or generated imagery as if it were real.

---

## 9. Copy rules
- Specific beats generic ("Kyoto at dawn, before the crowds" instead of "amazing experiences").
- Cut adjectives. No AI cliches. No over-explaining.
- One call to action per section. Plain verbs ("Plan your trip", "Ask us").
- Japanese and English are written for their own audiences, not machine-translated word for word. Native review before launch.

---

## 10. Anti-patterns (reject on sight)
Default system fonts. Indigo-to-violet gradients. Three identical cards everywhere. Frosted glass on everything. Decorative motion on every element. Text on busy images without a readable overlay. Desktop layout merely shrunk for phones. Hardcoded colors or sizes. Placeholder lorem ipsum left in.

---

## 11. Rules for the AI agent (process, not look)
1. Work only on the redesign branch. Never edit `main`.
2. **Never run `git push`, never open a pull request, never merge into main,** and never deploy, without the owner typing explicit permission in the chat.
3. Local commits on the redesign branch are allowed, small and descriptive, one per section or concern.
4. Do not modify protected backend files: Sanity schemas and queries, API routes, authentication code, environment files, and deployment config. If a UI change seems to require touching one, stop and ask.
5. Read-only audit and a written plan first. Wait for approval before editing.
6. Work section by section. After each section: screenshot at 390px and 1440px, run the accessibility checks, and report what changed in two sentences.
7. State which principle from this file each change follows.
8. If anything is ambiguous, ask one short question instead of guessing.
9. Security findings are reported and fixed separately from the design pass, never mixed into design commits.

---

## 12. Reference log
- Adams & Butler, https://www.adamsandbutler.com/ : typography feel, color restraint, image layout, card slider, scroll-state nav.
- Y.CO, https://y.co/ : hierarchy and scale, accent discipline, nav behavior, mega-menu structure.
- (add more with: what you like, what you dislike, what to use it for)
