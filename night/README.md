# Night mode (Thomas, prototype 7 Oct 2026)

A day/night switch for the homepage, in deep night blue. Off by default: only the
moon/sun button in the nav turns it on; the choice is remembered in the browser.
`?night=1` / `?night=0` in the URL forces a mode (for testing).

- `night.css`       all night colours, under `html.dfs-night` (generated from a CSS snapshot + hand-tuned extras)
- `night-early.js`  in `<head>`: sets night mode before the page paints (no flash)
- `night.js`        end of `<body>`: the toggle button, hero image swap, the transition
- `*-night.webp`    night versions of the two mountain backgrounds (loaded from this folder)

Loaded from the homepage's page-level custom code in Webflow, and for now only on
`*.webflow.io` (staging). Generator and prototype: Thomas's handoff folder.
