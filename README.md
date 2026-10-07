# dfs-scripts

Site-wide JavaScript for the Digital Feng Shui website (Webflow), migrated from Slater.

- `main.js` — everything in one file. Each former Slater script is its own
  section (`dfsGlobal`, `dfsHome`, `dfsCourse`, …); the router at the bottom
  decides which sections run on which page.
- `styles.css` — the hand-written CSS (Client-First base, Osmo components,
  forms, homepage blocks) that used to sit in Webflow code embeds. Loaded in
  Site settings → Head (see below).
- `archive/` — old/unused snippets kept for reuse. Not loaded on the site.
- Served from GitHub Pages, which only ever gets a version that passed the tests:
  - Footer: `<script src="https://digital-feng-shui.github.io/dfs-scripts/main.min.js"></script>` (no `defer`)
  - Head: `<link rel="stylesheet" href="https://digital-feng-shui.github.io/dfs-scripts/styles.min.css">`
  - `https://digital-feng-shui.github.io/dfs-scripts/version.json` shows which version is live.
- Every version is also a git tag, so `cdn.jsdelivr.net/gh/Digital-Feng-Shui/dfs-scripts@vX.Y.Z/...`
  keeps working as a fixed copy.

Not in here (still inline in Webflow): Lenis setup, Meta pixel/events, and
Thomas's checkout / setup-pack / onboarding-picker / price-test code.

## Release flow (automatic)
See `RULES.md` for the house rules.
1. Make a branch, edit `main.js` / `styles.css`, open a pull request.
2. GitHub tests it on the real site (live + staging, desktop + phone + iPhone):
   both Enroll buttons open a popup on screen, the email form goes to the right
   Stripe link, no JavaScript errors, styles applied. Nothing is published by the test.
3. Green? Merge. GitHub tags a new version and puts it live within a minute or two.
   No Webflow publish needed for code changes.
4. Red? Nothing goes live. Open the failed run to see screenshots.

Every 15 minutes the **Live monitor** checks the real buy flow. If it breaks it opens a
`site-down` issue and sends alerts. **Rollback**: Actions > Rollback > Run workflow
(empty = one version back).

Run the tests on your own computer: `npm install`, `npx playwright install`, `npm test`.
Check the live site as-is: `npm run test:live`.
