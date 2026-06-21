import { resolveTeamName } from "./teamNames";

export interface LiveResult {
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  status: "live" | "finished";
}

interface WorldCup26Game {
  home_score: string;
  away_score: string;
  time_elapsed: string;
  home_team_name_en: string;
  away_team_name_en: string;
}

/**
 * Pulls in-progress and finished World Cup scores from worldcup26.ir, a free
 * community API that needs no key or signup. Returns an empty array if the
 * request fails for any reason, so the site always falls back to the results
 * already stored in src/data/quiniela.json.
 */
export async function fetchLiveResults(): Promise<LiveResult[]> {
  try {
    const res = await fetch("https://worldcup26.ir/get/games", {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { games?: WorldCup26Game[] };
    if (!Array.isArray(data.games)) return [];

    const results: LiveResult[] = [];
    for (const g of data.games) {
      const status = g.time_elapsed?.toLowerCase();
      if (status !== "live" && status !== "finished") continue;

      const home = resolveTeamName(g.home_team_name_en ?? "");
      const away = resolveTeamName(g.away_team_name_en ?? "");
      const homeGoals = Number(g.home_score);
      const awayGoals = Number(g.away_score);
      if (!home || !away || !Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) {
        continue;
      }
      results.push({ home, away, homeGoals, awayGoals, status });
    }
    return results;
  } catch {
    return [];
  }
}
