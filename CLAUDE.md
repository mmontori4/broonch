# CLAUDE.md

## Deploying changes

After making changes to files in `app/`, always follow the deploy steps in `README.md`:

1. Copy edited files from `app/` to repo root (`js/`, `css/`, `index.html`, `sw.js`)
2. Bump the service worker cache version in `sw.js` (`CACHE_NAME` from `broonch-vN` to `broonch-vN+1`)
3. Commit and push to `main`

Do NOT skip these steps. The deployed site at https://mmontori4.github.io/broonch/ serves from the repo root, not from `app/`. Changes to `app/` alone will not go live.
