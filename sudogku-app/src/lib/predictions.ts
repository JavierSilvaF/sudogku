import type { Match } from "./types";

export interface PredictionGroup {
  label: string;
  users: string[];
}

export function groupPredictionsByScore(match: Match): PredictionGroup[] {
  const byScore = new Map<string, string[]>();
  const noPrediction: string[] = [];

  for (const [user, prediction] of Object.entries(match.predictions)) {
    if (!prediction) {
      noPrediction.push(user);
      continue;
    }
    const label = `${prediction[0]}-${prediction[1]}`;
    const users = byScore.get(label) ?? [];
    users.push(user);
    byScore.set(label, users);
  }

  const groups = Array.from(byScore.entries()).map(([label, users]) => ({
    label,
    users: users.sort((a, b) => a.localeCompare(b)),
  }));
  groups.sort((a, b) => b.users.length - a.users.length);

  if (noPrediction.length > 0) {
    groups.push({ label: "Sin pronóstico", users: noPrediction.sort((a, b) => a.localeCompare(b)) });
  }

  return groups;
}
