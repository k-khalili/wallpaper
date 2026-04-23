# Goal Countdown Wallpaper

A Vercel Edge Function that generates a dynamic iPhone wallpaper showing a weekly (or daily, or monthly) dot-grid countdown to any date you choose. Each dot represents one unit of time.

- **White dots** — units already elapsed
- **Orange dot** — the current unit
- **Faded dots** — units remaining

Fetched fresh every morning via an iOS Shortcut and set automatically as your lock screen and home screen. The image is generated on every request — nothing is stored, nothing needs to run on your computer.

---

## How it works

```
6:00 AM daily
   └─ iOS Shortcut fires silently
       └─ Fetches image from Vercel Edge Function
           └─ Code checks today's date and counts weeks
               └─ Returns a fresh 1320 × 2868 PNG
                   └─ iOS sets it as wallpaper
```

Live endpoint (my graduation):

```
https://grad-wallpaper.vercel.app/api/goal?goal=Graduation&goal_date=2026-05-09&start_date=2024-01-01
```

---

## Customize it — three ways

Pick whichever tier fits you. The higher tiers are strictly opt-in.

### 1. Zero-code — just change the URL

If you just want *your own* goal and colors, fork and deploy this repo once, then edit the URL in your iOS Shortcut. Every knob is a query parameter.

```
/api/goal
  ?goal=Wedding
  &goal_date=2026-09-20
  &start_date=2024-09-20
  &current_color=%23FF3B30
  &past_color=%23F5F5F7
  &bg=%23000000
  &unit=day
  &shape=rounded
  &remaining_suffix=d%20left
```

> URL-encode `#` as `%23` and spaces as `%20`.

### 2. Light customization — edit `config.js`

Open [`config.js`](./config.js) and change the defaults. Everything is grouped and commented: goal, theme (colors), typography, layout, unit, labels. Redeploy (`git push` if you've connected Vercel to GitHub) and you're done.

### 3. Full customization — edit `app/api/goal/route.js`

The route is small and readable. Change the layout, add new shapes, add a date label, draw anything you like. The config still drives the defaults; the rendering is yours.

---

## Parameter reference

All parameters are optional. Any you omit fall back to what's in `config.js`.

### Goal

| Param        | Default       | Description                              |
| ------------ | ------------- | ---------------------------------------- |
| `goal`       | `Graduation`  | Label shown above the dot grid           |
| `goal_date`  | `2026-05-09`  | Target end date (`YYYY-MM-DD`, UTC)      |
| `start_date` | `2024-01-01`  | Start date to count from (`YYYY-MM-DD`)  |

### Layout

| Param            | Default | Description                                  |
| ---------------- | ------- | -------------------------------------------- |
| `width`          | `1320`  | Image width in px                            |
| `height`         | `2868`  | Image height in px                           |
| `cols`           | `11`    | Number of dot columns per row                |
| `shape`          | `circle`| `circle`, `square`, or `rounded`             |
| `dot_size_ratio` | `0.032` | Dot size as a fraction of width              |
| `gap_ratio`      | `0.6`   | Gap between dots as a fraction of dot size   |

### Colors

All color params accept any CSS color: `#rrggbb`, `rgba(...)`, `hsl(...)`, or names like `white`.

| Param                    | Default                     | Description                |
| ------------------------ | --------------------------- | -------------------------- |
| `bg` / `background`      | `#000000`                   | Background color           |
| `past_color`             | `#FFFFFF`                   | Units already elapsed      |
| `current_color`          | `#E8633B`                   | The current unit           |
| `future_color`           | `rgba(255,255,255,0.18)`    | Units remaining            |
| `label_color`            | `rgba(255,255,255,0.55)`    | Goal label above the grid  |
| `remaining_color`        | `#E8633B`                   | Remaining-count number     |
| `remaining_suffix_color` | `rgba(255,255,255,0.3)`     | The `" left"` text          |
| `percent_color`          | `rgba(255,255,255,0.4)`     | Percent complete text      |

### Typography

| Param                | Default       | Description                            |
| -------------------- | ------------- | -------------------------------------- |
| `font_family`        | `sans-serif`  | Any CSS font family available in the edge runtime |
| `label_size_ratio`   | `0.038`       | Label font size as a fraction of width |
| `footer_size_ratio` | `0.033`       | Footer font size as a fraction of width |

### Unit and labels

| Param              | Default   | Description                                      |
| ------------------ | --------- | ------------------------------------------------ |
| `unit`             | `week`    | `week`, `day`, or `month`                          |
| `remaining_suffix` | `w left`  | Text after the remaining count (e.g. `d left`)   |
| `show_percent`     | `true`    | Whether to show the percent-complete number      |
| `percent_suffix`   | `%`       | Character shown after the percent                |

---

## Deploy your own

**Prerequisites:** Node.js installed and a free [Vercel](https://vercel.com) account.

```bash
# 1. Clone this repo
git clone https://github.com/YOUR_USERNAME/wallpaper.git
cd wallpaper

# 2. Install dependencies
npm install

# 3. Log in to Vercel (opens browser)
npx vercel login

# 4. Deploy
npx vercel --prod
```

Vercel gives you a live URL in about 60 seconds.

### Connect to GitHub for automatic re-deploys (optional)

1. Push this repo to GitHub.
2. Go to **vercel.com → Import Project** → select your repo.
3. Every `git push` now redeploys — no CLI needed.

---

## iOS Shortcut setup

1. Open the **Shortcuts** app on your iPhone.
2. Create a new shortcut with two actions:
   1. **Get Contents of URL** → paste your Vercel endpoint URL.
   2. **Set Wallpaper Photo** → `Contents of URL` → Lock Screen and Home Screen.
3. Go to the **Automation** tab → **New Automation** → **Time of Day**.
4. Set to 6:00 AM, Daily, turn off *Notify Before Running*.
5. Add action: **Run Shortcut** → select the shortcut you just made.

Your wallpaper will now update silently every morning. Your Mac doesn't need to be on — everything runs on Vercel's servers.

---

## Project structure

```
wallpaper/
├── app/
│   └── api/
│       └── goal/
│           └── route.js    # Edge Function — renders the wallpaper
├── config.js               # Defaults for colors, dates, text, layout
├── package.json
└── vercel.json
```

---

## Tech stack

- **Next.js 14** — framework
- **next/og** — edge image generation
- **Vercel** — hosting and edge runtime

No database. No auth. No stored state.
