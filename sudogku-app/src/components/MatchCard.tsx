import Link from "next/link";
import type { Match } from "@/lib/types";
import { formatMatchDate } from "@/lib/format";
import TeamName from "./TeamName";

export default function MatchCard({ match }: { match: Match }) {
  const played = match.actualHome !== null && match.actualAway !== null;

  return (
    <Link
      href={`/partidos/${match.matchNo}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">
          <TeamName name={match.home} /> <span className="text-gray-400">vs</span>{" "}
          <TeamName name={match.away} />
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatMatchDate(match.date)} · {match.venue}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {match.isLive ? (
          <>
            <span className="font-bold tabular-nums">
              {match.liveHome} - {match.liveAway}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
              En vivo
            </span>
          </>
        ) : played ? (
          <span className="font-bold tabular-nums">
            {match.actualHome} - {match.actualAway}
          </span>
        ) : (
          <span className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
            Pendiente
          </span>
        )}
      </div>
    </Link>
  );
}
