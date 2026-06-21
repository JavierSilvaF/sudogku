import Link from "next/link";
import type { Match } from "@/lib/types";
import { formatMatchDate } from "@/lib/format";
import TeamName from "./TeamName";

export default function MatchCard({ match }: { match: Match }) {
  const played = match.actualHome !== null && match.actualAway !== null;

  return (
    <Link
      href={`/partidos/${match.matchNo}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-stone-800 px-4 py-3 hover:bg-stone-900 hover:border-amber-600 transition"
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">
          <TeamName name={match.home} /> <span className="text-stone-500">vs</span>{" "}
          <TeamName name={match.away} />
        </span>
        <span className="text-xs text-stone-400">
          {formatMatchDate(match.date)} · {match.venue}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {match.isLive ? (
          <>
            <span className="font-bold tabular-nums">
              {match.liveHome} - {match.liveAway}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              En vivo
            </span>
          </>
        ) : played ? (
          <span className="font-bold tabular-nums">
            {match.actualHome} - {match.actualAway}
          </span>
        ) : (
          <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Pendiente
          </span>
        )}
      </div>
    </Link>
  );
}
