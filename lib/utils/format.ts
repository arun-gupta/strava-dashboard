export function formatDistance(metres: number): string {
  const km = metres / 1000;
  return km.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " km";
}

export function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toLocaleString("en-US")}h ${minutes}m`;
}
