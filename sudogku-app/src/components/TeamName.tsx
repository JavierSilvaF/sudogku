import Image from "next/image";
import { getTeamFlag, getTeamFlagImageUrl } from "@/lib/flags";

export default function TeamName({ name }: { name: string }) {
  const flag = getTeamFlag(name);
  const flagImageUrl = getTeamFlagImageUrl(name);

  return (
    <span className="whitespace-nowrap inline-flex items-center gap-1">
      {flag && <span className="md:hidden">{flag}</span>}
      {flagImageUrl && (
        <Image
          src={flagImageUrl}
          alt=""
          width={20}
          height={14}
          unoptimized
          className="hidden md:inline-block rounded-[1px] align-middle"
        />
      )}
      {name}
    </span>
  );
}
