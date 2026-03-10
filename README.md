# broonch gym

12-week upper body hypertrophy + zone 2 cardio tracker PWA.

Live at: https://mmontori4.github.io/broonch/

## Deploying updates

The app is hosted on GitHub Pages from the `main` branch of `mmontori4/broonch`.

The deployed files live at the **repo root** (`js/`, `css/`, `index.html`, `sw.js`, etc.) — NOT inside `app/`. The `app/` folder is a local working copy.

To push changes:

```bash
cd ~/Projects/Health/gym

# 1. Copy edited files from app/ to repo root
cp app/js/*.js js/
cp app/css/style.css css/style.css
cp app/index.html index.html
cp app/sw.js sw.js

# 2. Bump the service worker cache version in sw.js
#    (change CACHE_NAME from 'broonch-vN' to 'broonch-vN+1')
#    This forces phones to pull fresh files.

# 3. Commit and push
git add -A
git commit -m "Your message here"
git push origin main
```

Changes go live within a minute or two. On your phone, close and reopen the app to pick up the new service worker.

## Project structure

```
├── app/                  # Local working copy (edit files here)
│   ├── index.html
│   ├── sw.js
│   ├── css/style.css
│   ├── js/
│   │   ├── data.js       # Workout plan, exercises, phases
│   │   ├── store.js       # localStorage abstraction
│   │   ├── tracker.js     # Workout form + stopwatch
│   │   ├── wallet.js      # Ratito wallet (missed workout fines)
│   │   ├── trends.js      # Charts + attendance grid
│   │   └── app.js         # Routing + navigation
│   └── img/
├── js/                   # Deployed copies (copied from app/js/)
├── css/                  # Deployed copies (copied from app/css/)
├── index.html            # Deployed copy
└── sw.js                 # Deployed copy
```
