import Link from "next/link";
import type { StandingsRow } from "@/lib/types";
import { toTitleCase } from "@/lib/format";

export default function StandingsTable({ standings }: { standings: StandingsRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-800">
      <table className="w-full text-sm">
        <thead className="bg-stone-900 text-stone-200">
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
              className={`border-t border-stone-800 hover:bg-stone-900 ${
                row.rank === 1 ? "bg-amber-950/40" : ""
              }`}
            >
              <td className="px-3 py-2 font-semibold text-stone-400">
                <span className="inline-flex items-center gap-1">
                  {row.rank === 1 && <span title="Líder">🏆</span>}
                  {row.rank}
                </span>
              </td>
              <td className="px-3 py-2">
                <Link href={`/usuarios/${encodeURIComponent(row.user)}`} className="hover:underline">
                  {toTitleCase(row.user)}
                </Link>
              </td>
              <td className="px-3 py-2 text-right font-bold text-amber-400">{row.totalPoints}</td>
              <td className="px-3 py-2 text-right">{row.perfectCount}</td>
              <td className="px-3 py-2 text-right">{row.correctWinnerCount}</td>
              <td className="px-3 py-2 text-right text-stone-400">{row.matchesScored}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
