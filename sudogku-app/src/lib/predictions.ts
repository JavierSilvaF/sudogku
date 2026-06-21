import type { Match } from "./types";

export interface PredictionGroup {
  label: string;
  home: number;
  away: number;
  users: string[];
}

/**
 * Groups predictions by exact score, ordered left-to-right by goal
 * difference: biggest home-team wins first, down through the tie in the
 * middle, then growing away-team wins toward the right.
 */
export function groupPredictionsByScore(match: Match): PredictionGroup[] {
  const byScore = new Map<string, { home: number; away: number; users: string[] }>();
  const noPrediction: string[] = [];

  for (const [user, prediction] of Object.entries(match.predictions)) {
    if (!prediction) {
      noPrediction.push(user);
      continue;
    }
    const [home, away] = prediction;
    const label = `${home}-${away}`;
    const entry = byScore.get(label) ?? { home, away, users: [] };
    entry.users.push(user);
    byScore.set(label, entry);
  }

  const groups: PredictionGroup[] = Array.from(byScore.values()).map(({ home, away, users }) => ({
    label: `${home}-${away}`,
    home,
    away,
    users: users.sort((a, b) => a.localeCompare(b)),
  }));

  groups.sort((a, b) => {
    const diffDelta = (b.home - b.away) - (a.home - a.away);
    if (diffDelta !== 0) return diffDelta;
    return b.home - a.home;
  });

  if (noPrediction.length > 0) {
    groups.push({
      label: "Sin pronóstico",
      home: 0,
      away: 0,
      users: noPrediction.sort((a, b) => a.localeCompare(b)),
    });
  }

  return groups;
}
