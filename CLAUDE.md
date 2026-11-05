# Kanmani Tours: rules for Claude

Next.js 16 + next-intl (ja default, unprefixed; en under /en) + Sanity CMS (project 31klefy7, Studio at /studio), hosted on Vercel at https://www.kanmanitours.com.

**Before anything else, read `docs/HANDOFF.md`** (full project brief). Before any UI work, read `docs/design-principles.md` and `docs/design-system.md`.

Hard rules:
- Never `git push`, open a PR, merge into `main` or deploy without the owner's explicit permission in chat. `remote.origin.pushurl` is `DISABLED` on purpose; leave it.
- Do not commit unless asked (reskin step commits on `redesign/premium-reskin` are the documented exception). Work on `redesign/premium-reskin`, never on `main`.
- Ask before touching: `src/sanity/**`, `src/app/api/**`, auth code, the RMK gallery auth check, env files, `vercel.json`, `next.config.ts`, `src/proxy.ts`, and the contact/group inquiry form files.
- Never read out or send secret values from `.env.local`.
- Scripts in `scripts/` write to the production Sanity dataset. Ask first.
- Redesigned components: CSS Modules + tokens from `src/app/tokens.css` only, `data-ds` on the root, UI strings in both `messages/en.json` and `messages/ja.json`.
- Work style: batch the owner's decisions into one question up front, then run autonomously with a text progress bar after each step, and verify (tsc, build, screenshots at 390px and 1440px) before claiming done.
