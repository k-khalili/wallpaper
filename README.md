# Graduation Countdown Wallpaper

A Vercel Edge Function that generates a dynamic iPhone wallpaper showing a weekly dot-grid countdown to a goal date. Every dot represents one week. Fetched fresh every morning via an iOS Shortcut and set automatically as your lock screen and home screen.

**White dots** = weeks elapsed · **Orange dot** = this week · **Faded dots** = weeks remaining

---

## How it works

```
6:00 AM daily
  └─ iOS Shortcut fires silently
       └─ Fetches image from Vercel Edge Function
            └─ Code checks today's date and counts weeks
                 └─ Returns a fresh 1320×2868 PNG
                      └─ iOS sets it as wallpaper
```

The image is generated on every request — nothing is stored, nothing needs to run on your computer.

---

## Live endpoint

```
https://grad-wallpaper.vercel.app/api/goal?goal=Graduation&goal_date=2026-05-09&start_date=2024-01-01&height=2868&width=1320
```

---

## URL parameters

| Parameter    | Default        | Description                           |
|-------------|----------------|---------------------------------------|
| `goal`      | `Graduation`   | Label shown above the dot grid        |
| `goal_date` | `2026-05-09`   | Target end date (YYYY-MM-DD)          |
| `start_date`| `2024-01-01`   | Start date to count from (YYYY-MM-DD) |
| `width`     | `1320`         | Image width in px                     |
| `height`    | `2868`         | Image height in px                    |
| `cols`      | `11`           | Number of dot columns per row         |

---

## Project structure

```
grad-wallpaper/
├── app/
│   └── api/
│       └── goal/
│           └── route.js   # Edge Function — all the logic lives here
├── package.json
└── vercel.json
```

---

## Deploy your own

### Prerequisites
- [Node.js](https://nodejs.org) installed
- A [Vercel](https://vercel.com) account (free)

### Steps

```bash
# 1. Clone this repo
git clone https://github.com/YOUR_USERNAME/grad-wallpaper.git
cd grad-wallpaper

# 2. Install dependencies
npm install

# 3. Log in to Vercel (opens browser)
npx vercel login

# 4. Deploy
npx vercel --prod
```

Vercel gives you a live URL in about 60 seconds.

### Connect to GitHub for automatic re-deploys (optional)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. From then on, every `git push` automatically redeploys — no CLI needed

---

## iOS Shortcut setup

1. Open the **Shortcuts** app on your iPhone
2. Create a new shortcut with two actions:
   - **Get Contents of URL** → paste your Vercel endpoint URL
   - **Set Wallpaper Photo** → Contents of URL → Lock Screen and Home Screen
3. Go to the **Automation** tab → New Automation → Time of Day
4. Set to **6:00 AM, Daily**, turn off "Notify Before Running"
5. Add action: **Run Shortcut** → select the shortcut you just made

Your wallpaper will now update silently every morning. Your Mac doesn't need to be on — everything runs on Vercel's servers.

---

## Design spec

| Element       | Value                         |
|--------------|-------------------------------|
| Background   | `#000000`                     |
| Past weeks   | `#FFFFFF`                     |
| Current week | `#E8633B` (orange)            |
| Future weeks | `rgba(255, 255, 255, 0.18)`   |
| Goal label   | `rgba(255, 255, 255, 0.55)`   |
| Image size   | 1320 × 2868 px (iPhone scale) |
| Columns      | 11                            |

---

## Tech stack

- **[Next.js 14](https://nextjs.org)** — framework
- **[next/og](https://nextjs.org/docs/app/api-reference/functions/image-response)** — edge image generation
- **[Vercel](https://vercel.com)** — hosting and edge runtime
- No database · No auth · No stored state
