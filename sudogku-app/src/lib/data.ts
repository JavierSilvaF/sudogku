import raw from "@/data/quiniela.json";
import type { Match, QuinielaData } from "./types";
import { fetchLiveResults } from "./liveResults";

const data = raw as unknown as QuinielaData;

export const USERS: string[] = data.users;

export function getSeedMatches(): Match[] {
  return data.matches;
}

/**
 * Merges seed matches with live API results. Finished matches overwrite the
 * scoring fields (actualHome/actualAway); in-progress matches only populate
 * the live-display fields so the quiniela isn't scored on a partial result.
 */
export async function getMatches(): Promise<Match[]> {
  const liveResults = await fetchLiveResults();
  if (liveResults.length === 0) return data.matches;

  const liveByPair = new Map(liveResults.map((r) => [`${r.home}__${r.away}`, r]));

  return data.matches.map((match) => {
    const live = liveByPair.get(`${match.home}__${match.away}`);
    if (!live) return match;
    if (live.status === "finished") {
      return { ...match, actualHome: live.homeGoals, actualAway: live.awayGoals, isLive: false };
    }
    return { ...match, isLive: true, liveHome: live.homeGoals, liveAway: live.awayGoals };
  });
}

export function getGroups(matches: Match[]): string[] {
  return Array.from(new Set(matches.map((m) => m.group))).sort();
}

export function getMatchByNo(matches: Match[], matchNo: number): Match | undefined {
  return matches.find((m) => m.matchNo === matchNo);
}
