export function formatDistance(metres: number): string {
  return (metres / 1000).toFixed(1) + " km";
}

export function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
