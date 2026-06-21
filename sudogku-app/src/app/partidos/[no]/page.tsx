import { notFound } from "next/navigation";
import { getMatchByNo, getMatches, USERS } from "@/lib/data";
import { pointsForUserInMatch } from "@/lib/scoring";
import { formatMatchDate } from "@/lib/format";
import TeamName from "@/components/TeamName";

export const revalidate = 600;

export default async function MatchPage({ params }: { params: Promise<{ no: string }> }) {
  const { no } = await params;
  const matches = await getMatches();
  const match = getMatchByNo(matches, Number(no));
  if (!match) notFound();

  const played = match.actualHome !== null && match.actualAway !== null;

  const rows = USERS.map((user) => {
    const prediction = match.predictions[user] ?? null;
    const points = pointsForUserInMatch(match, user);
    return { user, prediction, points };
  }).sort((a, b) => {
    if (played) return (b.points ?? -1) - (a.points ?? -1);
    return a.user.localeCompare(b.user);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {match.group} · {formatMatchDate(match.date)} · {match.venue}
        </p>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <TeamName name={match.home} />
          <span className="tabular-nums">
            {match.isLive
              ? `${match.liveHome} - ${match.liveAway}`
              : played
                ? `${match.actualHome} - ${match.actualAway}`
                : "vs"}
          </span>
          <TeamName name={match.away} />
        </h1>
        {match.isLive ? (
          <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
            En vivo
          </span>
        ) : (
          !played && (
            <span className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Pendiente
            </span>
          )
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Participante</th>
              <th className="px-3 py-2 text-right font-medium">Pronóstico</th>
              <th className="px-3 py-2 text-right font-medium">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ user, prediction, points }) => (
              <tr key={user} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-3 py-2">{user}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {prediction ? `${prediction[0]} - ${prediction[1]}` : "Sin pronóstico"}
                </td>
                <td className="px-3 py-2 text-right font-semibold">{points === null ? "-" : points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
