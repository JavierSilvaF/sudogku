import { resolveTeamName } from "./teamNames";

export interface LiveResult {
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
}

interface FootballDataMatch {
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

/**
 * Pulls finished World Cup results from the free football-data.org API
 * (https://www.football-data.org). Requires a free API key set as
 * FOOTBALL_DATA_API_KEY. Returns an empty array if no key is configured or
 * the request fails for any reason, so the site always falls back to the
 * results already stored in src/data/quiniela.json.
 */
export async function fetchLiveResults(): Promise<LiveResult[]> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { matches?: FootballDataMatch[] };
    if (!Array.isArray(data.matches)) return [];

    const results: LiveResult[] = [];
    for (const m of data.matches) {
      if (m.status !== "FINISHED") continue;
      const home = resolveTeamName(m.homeTeam?.name ?? "");
      const away = resolveTeamName(m.awayTeam?.name ?? "");
      const homeGoals = m.score?.fullTime?.home;
      const awayGoals = m.score?.fullTime?.away;
      if (!home || !away || homeGoals === null || awayGoals === null || homeGoals === undefined || awayGoals === undefined) {
        continue;
      }
      results.push({ home, away, homeGoals, awayGoals });
    }
    return results;
  } catch {
    return [];
  }
}
