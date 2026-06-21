import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatches, USERS } from "@/lib/data";
import { computeStandings, pointsForUserInMatch } from "@/lib/scoring";
import { formatMatchDate } from "@/lib/format";
import TeamName from "@/components/TeamName";

export const revalidate = 600;

export default async function UserPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const user = decodeURIComponent(name);
  if (!USERS.includes(user)) notFound();

  const matches = await getMatches();
  const standings = computeStandings(matches, USERS);
  const row = standings.find((s) => s.user === user);

  const sortedMatches = [...matches].sort((a, b) => a.matchNo - b.matchNo);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{user}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Puesto #{row?.rank} · {row?.totalPoints} puntos · {row?.matchesScored} partidos jugados
          </p>
        </div>
        <Link href="/usuarios" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
          Ver todos los participantes
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Partido</th>
              <th className="px-3 py-2 text-left font-medium">Fecha</th>
              <th className="px-3 py-2 text-right font-medium">Pronóstico</th>
              <th className="px-3 py-2 text-right font-medium">Resultado</th>
              <th className="px-3 py-2 text-right font-medium">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {sortedMatches.map((match) => {
              const prediction = match.predictions[user] ?? null;
              const points = pointsForUserInMatch(match, user);
              const played = match.actualHome !== null && match.actualAway !== null;
              return (
                <tr key={match.matchNo} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2">
                    <Link href={`/partidos/${match.matchNo}`} className="hover:underline">
                      <TeamName name={match.home} /> vs <TeamName name={match.away} />
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                    {formatMatchDate(match.date)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {prediction ? `${prediction[0]} - ${prediction[1]}` : "Sin pronóstico"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {played ? `${match.actualHome} - ${match.actualAway}` : "-"}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">{points === null ? "-" : points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
