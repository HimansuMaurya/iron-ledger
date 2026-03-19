# Iron Ledger

Tiny offline workout and bodyweight tracker for a Pixel phone.

## Run locally

Because the app registers a service worker, open it through a small local server instead of opening the file directly.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in Chrome on your phone or desktop.

## Use on your phone without your laptop

The cleanest option is to host it as a static site and then add it to your Pixel home screen.

### GitHub Pages

This repo includes a workflow at `.github/workflows/deploy-pages.yml`.

1. Create a GitHub repo and push this folder to the `main` branch.
2. In GitHub, open `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push any commit. The workflow will publish the app.
5. Open the published URL on your Pixel in Chrome.
6. Tap the three-dot menu and choose `Add to Home screen`.

After the first load, the app is cached offline, so it should still open in the gym even if the connection is poor.

## What it does

- Tracks daily bodyweight
- Tracks every set for the 6-day V-taper split
- Lets you edit or delete logged sets if you mistype a number
- Pre-fills weight and reps from the last matching session
- Shows a dashboard for bodyweight trend and key lift progress
- Stores everything in browser local storage
- Exports and imports JSON backups

## Pixel workflow

1. Open the app in Chrome.
2. Tap the three-dot menu.
3. Choose `Add to Home screen`.
4. Open it from the home screen like an app.
