import { resolveTeamName } from "./teamNames";

export interface LiveResult {
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  status: "live" | "finished";
}

interface OpenFootballMatch {
  team1: string;
  team2: string;
  score?: { ft?: [number, number] };
}

const SOURCE_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// Module-level cache of the last successful fetch, so a transient network
// blip doesn't regress the site all the way back to the bare seed snapshot
// in src/data/quiniela.json. Only helps within a single warm server process
// (e.g. local dev, or a reused serverless instance).
let lastGoodResults: LiveResult[] = [];

async function fetchGames(timeoutMs: number): Promise<OpenFootballMatch[] | null> {
  try {
    const res = await fetch(SOURCE_URL, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { matches?: OpenFootballMatch[] };
    return Array.isArray(data.matches) ? data.matches : null;
  } catch {
    return null;
  }
}

/**
 * Pulls finished World Cup results from openfootball/worldcup.json, a
 * hand-maintained but reliably-hosted (GitHub raw CDN) public-domain dataset.
 * It has no in-progress "live" score field — only a final score once the
 * maintainer records it, sometimes hours after the final whistle — so this
 * never reports "live" status, only "finished". Falls back to the last
 * successful fetch (if any) on failure, and ultimately to the results
 * already stored in src/data/quiniela.json if nothing has ever succeeded.
 */
export async function fetchLiveResults(): Promise<LiveResult[]> {
  const games = await fetchGames(8000);
  if (!games) return lastGoodResults;

  const results: LiveResult[] = [];
  for (const g of games) {
    const ft = g.score?.ft;
    if (!ft) continue;

    const home = resolveTeamName(g.team1 ?? "");
    const away = resolveTeamName(g.team2 ?? "");
    const [homeGoals, awayGoals] = ft;
    if (!home || !away || !Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) {
      continue;
    }
    results.push({ home, away, homeGoals, awayGoals, status: "finished" });
  }

  if (results.length > 0) lastGoodResults = results;
  return results.length > 0 ? results : lastGoodResults;
}
