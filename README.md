# Graduation Countdown Wallpaper

A Vercel Edge Function that generates a dynamic countdown wallpaper (PNG) showing weeks elapsed toward a goal. Designed to work with iOS Shortcuts for automatic daily wallpaper updates.

## Deploy to Vercel

1. Push this folder to a new GitHub repo (or use the Vercel CLI)
2. Connect the repo to [vercel.com](https://vercel.com) → "Add New Project"
3. Deploy — no config needed

Or via CLI:
```bash
npm i -g vercel
cd grad-wallpaper
vercel
```

## Your Shortcut URL

Once deployed, your URL will be:

```
https://YOUR-PROJECT.vercel.app/api/goal?goal=Graduation&goal_date=2026-05-09&start_date=2024-01-01&height=2868&width=1320
```

### Parameters

| Param        | Default        | Description                    |
|-------------|----------------|--------------------------------|
| `goal`      | `Graduation`   | Label shown above the grid     |
| `goal_date` | `2026-05-09`   | End date (YYYY-MM-DD)          |
| `start_date`| `2024-01-01`   | Start date (YYYY-MM-DD)        |
| `width`     | `1320`         | Image width in px              |
| `height`    | `2868`         | Image height in px             |
| `cols`      | `11`           | Dots per row                   |

## iOS Shortcut Setup

1. Create a new **Automation** → Time of Day → 6:00 AM, Daily
2. Add action: **Get Contents of URL** → paste your URL above
3. Add action: **Set Wallpaper Photo** → set to "Contents of URL" for Lock Screen and Home Screen
4. Set to **Run Immediately**, disable "Notify When Run"
