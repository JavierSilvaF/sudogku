import Link from "next/link";
import type { StandingsRow } from "@/lib/types";

export default function StandingsTable({ standings }: { standings: StandingsRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
          <tr>
            <th className="px-3 py-2 text-left font-medium">#</th>
            <th className="px-3 py-2 text-left font-medium">Participante</th>
            <th className="px-3 py-2 text-right font-medium">Puntos</th>
            <th className="px-3 py-2 text-right font-medium">Resultados exactos</th>
            <th className="px-3 py-2 text-right font-medium">Ganadores acertados</th>
            <th className="px-3 py-2 text-right font-medium">Partidos jugados</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.user}
              className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">{row.rank}</td>
              <td className="px-3 py-2">
                <Link href={`/usuarios/${encodeURIComponent(row.user)}`} className="hover:underline">
                  {row.user}
                </Link>
              </td>
              <td className="px-3 py-2 text-right font-bold">{row.totalPoints}</td>
              <td className="px-3 py-2 text-right">{row.perfectCount}</td>
              <td className="px-3 py-2 text-right">{row.correctWinnerCount}</td>
              <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">{row.matchesScored}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
