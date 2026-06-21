"use client";

import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import { groupPredictionsByScore } from "@/lib/predictions";
import { formatMatchDate, toTitleCase } from "@/lib/format";
import { getTeamFlag } from "@/lib/flags";

function toTimestamp(date: string): number {
  return new Date(date.replace(" ", "T")).getTime();
}

export default function MatchPredictionsExplorer({
  matches,
  defaultMatchNo,
}: {
  matches: Match[];
  defaultMatchNo?: number;
}) {
  const sorted = useMemo(
    () => [...matches].sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date)),
    [matches],
  );
  const [matchNo, setMatchNo] = useState(defaultMatchNo ?? sorted[0]?.matchNo);
  const match = sorted.find((m) => m.matchNo === matchNo) ?? sorted[0];

  if (!match) return null;

  const played = match.actualHome !== null && match.actualAway !== null;
  const groups = groupPredictionsByScore(match);

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border px-4 py-3 min-w-0 ${
        match.isLive ? "border-red-900 bg-red-950/40" : "border-stone-800"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select
          value={match.matchNo}
          onChange={(e) => setMatchNo(Number(e.target.value))}
          className="w-full sm:w-auto sm:max-w-xs min-w-0 rounded-md border border-stone-700 bg-stone-900 text-stone-100 px-2 py-1 text-sm"
        >
          {sorted.map((m) => (
            <option key={m.matchNo} value={m.matchNo}>
              {getTeamFlag(m.home)} {m.home} vs {getTeamFlag(m.away)} {m.away} — {formatMatchDate(m.date)}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          {match.isLive ? (
            <>
              <span className="font-bold tabular-nums text-lg">
                {match.liveHome} - {match.liveAway}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                En vivo
              </span>
            </>
          ) : played ? (
            <span className="font-bold tabular-nums text-lg">
              {match.actualHome} - {match.actualAway}
            </span>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Pendiente
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1 min-w-[7rem]">
            <span className="text-center font-bold tabular-nums rounded-md bg-stone-900 border border-amber-600 text-amber-300 px-2 py-1">
              {group.label}
            </span>
            <div className="flex flex-col gap-0.5">
              {group.users.map((user) => (
                <span key={user} className="text-xs text-stone-400 truncate">
                  {toTitleCase(user)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
