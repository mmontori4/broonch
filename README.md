# broonch gym

Road to Reunions workout tracker PWA.

Live at: https://mmontori4.github.io/broonch/

## Current app

The active app state is the Reunions flow:

- `Today`, `Plan`, `Check-in`, and `Log` views
- per-day `Home / Gold's` workout variants
- home equipment model: weighted rings, dumbbells, bands, erg
- root deployment via GitHub Pages

The older 12-week hypertrophy materials are no longer the primary app state.

## Source of truth

The Git-tracked source of truth is the repo root:

- `index.html`
- `css/style.css`
- `js/reunions.js`
- `js/app.js`
- `js/store.js`
- `js/sync.js`
- `js/tracker.js`
- `js/trends.js`
- `js/wallet.js`
- `sw.js`

`app/` is a local untracked working copy / wrapper and is ignored by this repo.

## Deploying updates

The app is hosted on GitHub Pages from the `main` branch of `mmontori4/broonch`.

To ship changes:

```bash
cd ~/Projects/Health/gym
git add -A
git commit -m "Update reunions app"
git push origin main
```

If `sw.js` changed asset behavior, bump `CACHE_NAME` first so installed PWAs fetch fresh files.

## Project structure

```text
├── css/style.css         # Main app styles
├── index.html            # Main PWA entrypoint
├── js/
│   ├── app.js            # Navigation + screen routing
│   ├── data.js           # Older tracker data
│   ├── reunions.js       # Active Road to Reunions plan + UI logic
│   ├── store.js          # localStorage helpers
│   ├── sync.js           # Sheets sync
│   ├── tracker.js        # Older workout tracker UI
│   ├── trends.js         # Charts + attendance
│   └── wallet.js         # Ratito wallet
├── hybrid-reunions-plan.md
├── hybrid-workout-memo.md
├── reunions-plan.md
├── reunions-workout.jsx
└── sw.js                 # Service worker / cache versioning
```
