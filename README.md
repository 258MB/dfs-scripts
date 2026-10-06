# dfs-scripts

Site-wide JavaScript for the Digital Feng Shui website (Webflow).

- `main.js` — the site boilerplate (migrated from Slater).
- Served via jsDelivr, pinned to a git tag, e.g.
  `https://cdn.jsdelivr.net/gh/rimbodesigns/dfs-scripts@v1.0.0/main.js`
- Loaded in Webflow via one `<script>` tag in Site settings → Custom code → Footer, below the libraries.

## Release flow
1. Edit `main.js`, commit, push.
2. `git tag vX.Y.Z` and push the tag.
3. Update the version in the Webflow footer tag.
4. Publish to staging (webflow.io), test, then publish live.
