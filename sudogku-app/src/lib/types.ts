export type Score = [number, number];

export interface Match {
  group: string;
  home: string;
  away: string;
  homeId: number;
  awayId: number;
  actualHome: number | null;
  actualAway: number | null;
  matchNo: number;
  date: string;
  venue: string;
  predictions: Record<string, Score>;
}

export interface QuinielaData {
  users: string[];
  matches: Match[];
}

export interface MatchPrediction {
  user: string;
  prediction: Score | null;
  points: number | null;
}

export interface StandingsRow {
  rank: number;
  user: string;
  totalPoints: number;
  matchesScored: number;
  perfectCount: number;
  correctWinnerCount: number;
}
