import type { Match, Score, StandingsRow } from "./types";

/**
 * Quiniela scoring rules:
 * - 5 pts: exact score (winner/draw + both goal counts correct)
 * - 4 pts: correct winner/draw + one team's goal count correct
 * - 3 pts: correct winner/draw, no goal counts correct
 * - 1 pt:  wrong winner/draw, but one team's goal count correct
 * - 0 pts: wrong winner/draw, no goal counts correct
 */
export function scoreMatch(prediction: Score, actual: Score): number {
  const [predHome, predAway] = prediction;
  const [actualHome, actualAway] = actual;

  const predictedOutcome = Math.sign(predHome - predAway);
  const actualOutcome = Math.sign(actualHome - actualAway);
  const goalsMatched =
    (predHome === actualHome ? 1 : 0) + (predAway === actualAway ? 1 : 0);

  if (predictedOutcome === actualOutcome) {
    if (goalsMatched === 2) return 5;
    if (goalsMatched === 1) return 4;
    return 3;
  }
  return goalsMatched >= 1 ? 1 : 0;
}

export function isMatchPlayed(match: Match): boolean {
  return match.actualHome !== null && match.actualAway !== null;
}

export function pointsForUserInMatch(match: Match, user: string): number | null {
  if (!isMatchPlayed(match)) return null;
  const prediction = match.predictions[user];
  if (!prediction) return 0;
  return scoreMatch(prediction, [match.actualHome as number, match.actualAway as number]);
}

export function computeStandings(matches: Match[], users: string[]): StandingsRow[] {
  const rows: StandingsRow[] = users.map((user) => {
    let totalPoints = 0;
    let matchesScored = 0;
    let perfectCount = 0;
    let correctWinnerCount = 0;

    for (const match of matches) {
      const points = pointsForUserInMatch(match, user);
      if (points === null) continue;
      matchesScored += 1;
      totalPoints += points;
      if (points === 5) perfectCount += 1;
      if (points >= 3) correctWinnerCount += 1;
    }

    return { rank: 0, user, totalPoints, matchesScored, perfectCount, correctWinnerCount };
  });

  rows.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.perfectCount !== a.perfectCount) return b.perfectCount - a.perfectCount;
    if (b.correctWinnerCount !== a.correctWinnerCount) return b.correctWinnerCount - a.correctWinnerCount;
    return a.user.localeCompare(b.user);
  });

  let rank = 0;
  let previousScore: number | null = null;
  rows.forEach((row, index) => {
    if (row.totalPoints !== previousScore) {
      rank = index + 1;
      previousScore = row.totalPoints;
    }
    row.rank = rank;
  });

  return rows;
}
