export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
