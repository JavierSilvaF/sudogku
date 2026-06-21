import { getMatches, USERS } from "@/lib/data";
import { computeStandings } from "@/lib/scoring";
import { formatMatchDate } from "@/lib/format";
import StandingsTable from "@/components/StandingsTable";
import MatchPredictionsExplorer from "@/components/MatchPredictionsExplorer";
import TeamName from "@/components/TeamName";

export const revalidate = 600;

function toTimestamp(date: string): number {
  return new Date(date.replace(" ", "T")).getTime();
}

export default async function HomePage() {
  const matches = await getMatches();
  const standings = computeStandings(matches, USERS);
  const playedMatches = matches.filter((m) => m.actualHome !== null && m.actualAway !== null);
  const playedCount = playedMatches.length;
  const lastPlayedMatch = playedMatches.sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))[0];

  const liveMatch = matches.find((m) => m.isLive);
  const now = Date.now();
  const closestMatch = [...matches].sort(
    (a, b) => Math.abs(toTimestamp(a.date) - now) - Math.abs(toTimestamp(b.date) - now),
  )[0];
  const defaultMatchNo = liveMatch?.matchNo ?? closestMatch?.matchNo;

  return (
    <div className="flex flex-col gap-6">
      <MatchPredictionsExplorer matches={matches} defaultMatchNo={defaultMatchNo} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">Tabla de posiciones</h1>
        <p className="text-sm text-stone-400">
          {playedCount} de {matches.length} partidos jugados
          {lastPlayedMatch && (
            <>
              {" "}
              · Último: <TeamName name={lastPlayedMatch.home} /> {lastPlayedMatch.actualHome}-
              {lastPlayedMatch.actualAway} <TeamName name={lastPlayedMatch.away} /> (
              {formatMatchDate(lastPlayedMatch.date)})
            </>
          )}
        </p>
      </div>
      <StandingsTable standings={standings} />
    </div>
  );
}
