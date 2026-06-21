import { getTeamFlag } from "@/lib/flags";

export default function TeamName({ name }: { name: string }) {
  const flag = getTeamFlag(name);
  return (
    <span className="whitespace-nowrap">
      {flag && <span className="mr-1">{flag}</span>}
      {name}
    </span>
  );
}
