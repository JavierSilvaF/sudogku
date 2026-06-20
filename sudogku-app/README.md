This is a [Next.js](https://nextjs.org) app: a tracker for a World Cup 2026 quiniela (prediction pool). It shows the leaderboard, every match, and every participant's predictions, scored automatically.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- `src/data/quiniela.json` is the seed data: the 72 group-stage matches and all participants' predictions, imported from the original quiniela spreadsheet. Actual results already known at import time are filled in; the rest are `null` (pending).
- `src/lib/scoring.ts` implements the point system:
  - **5 pts** — exact score
  - **4 pts** — correct winner/draw + one team's goal count right
  - **3 pts** — correct winner/draw, no goal counts right
  - **1 pt** — wrong winner/draw, but one team's goal count right
  - **0 pts** — wrong winner/draw, no goal counts right
- `src/lib/data.ts` merges the seed results with live results (see below) and exposes them to the pages.
- Pages (`/`, `/partidos`, `/usuarios`) revalidate every 10 minutes, so results refresh automatically without a redeploy.

## Updating results

You have two ways to keep match results current:

1. **Automatic (recommended):** sign up for a free API key at [football-data.org](https://www.football-data.org/client/register), then set it as the `FOOTBALL_DATA_API_KEY` environment variable (locally in `.env.local`, or in your Vercel project settings). The site will pull finished World Cup results from that API every 10 minutes and override the seed data automatically. If the key isn't set, or the API call fails for any reason, the site silently falls back to whatever is in `src/data/quiniela.json` — nothing breaks.
2. **Manual fallback:** edit `actualHome`/`actualAway` for the relevant match in `src/data/quiniela.json` and push — Vercel will redeploy with the new result.

Team names are matched between the API and the seed data via `src/lib/teamNames.ts`. If a team's result isn't picking up, check that its alias list there matches the name the API returns.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to [Vercel](https://vercel.com), import the repository.
3. (Optional) Add the `FOOTBALL_DATA_API_KEY` environment variable for automatic live results.
4. Deploy.

### Build Settings

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
