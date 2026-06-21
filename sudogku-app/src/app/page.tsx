import { getMatches, USERS } from "@/lib/data";
import { computeStandings } from "@/lib/scoring";
import StandingsTable from "@/components/StandingsTable";

export const revalidate = 600;

export default async function HomePage() {
  const matches = await getMatches();
  const standings = computeStandings(matches, USERS);
  const playedCount = matches.filter((m) => m.actualHome !== null).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">Tabla de posiciones</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {playedCount} de {matches.length} partidos jugados
        </p>
      </div>
      <StandingsTable standings={standings} />
    </div>
  );
}
