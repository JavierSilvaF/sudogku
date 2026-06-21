import Link from "next/link";
import { getMatches, USERS } from "@/lib/data";
import { computeStandings } from "@/lib/scoring";
import { toTitleCase } from "@/lib/format";

export const revalidate = 600;

export default async function UsuariosPage() {
  const matches = await getMatches();
  const standings = computeStandings(matches, USERS);
  const rankByUser = new Map(standings.map((s) => [s.user, s]));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Participantes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {USERS.map((user) => {
          const row = rankByUser.get(user);
          return (
            <Link
              key={user}
              href={`/usuarios/${encodeURIComponent(user)}`}
              className="rounded-lg border border-stone-800 px-4 py-3 hover:bg-stone-900 hover:border-amber-600 transition flex items-center justify-between"
            >
              <span className="font-medium">{toTitleCase(user)}</span>
              <span className="text-sm text-stone-400">
                #{row?.rank} · {row?.totalPoints} pts
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
