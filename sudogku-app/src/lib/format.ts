/**
 * Seed match times are stored in UTC. Format them as EST (fixed UTC-5, no
 * DST) since that's the timezone the quiniela's audience expects, and label
 * it explicitly so it's unambiguous regardless of the viewer's own timezone.
 */
export function formatMatchDate(dateString: string): string {
  const date = new Date(`${dateString.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return dateString;
  const formatted = new Intl.DateTimeFormat("es", {
    timeZone: "Etc/GMT+5",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${formatted} EST`;
}

/**
 * Seed names are a mix of ALL CAPS and lowercase, since they were imported
 * as-typed from the original spreadsheet. Normalize to Title Case for
 * display only — the underlying string (used as the predictions key and in
 * URLs) is left untouched.
 */
export function toTitleCase(name: string): string {
  return name.toLowerCase().replace(/(^|[\s(])([a-zà-ÿ])/g, (_, sep, letter) => sep + letter.toUpperCase());
}
