import { getGroups, getMatches } from "@/lib/data";
import MatchCard from "@/components/MatchCard";

export const revalidate = 600;

export default async function PartidosPage() {
  const matches = await getMatches();
  const groups = getGroups(matches);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Partidos</h1>
      {groups.map((group) => {
        const groupMatches = matches
          .filter((m) => m.group === group)
          .sort((a, b) => a.matchNo - b.matchNo);
        return (
          <section key={group} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-stone-300 border-l-4 border-amber-500 pl-2">
              {group}
            </h2>
            <div className="flex flex-col gap-2">
              {groupMatches.map((match) => (
                <MatchCard key={match.matchNo} match={match} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
