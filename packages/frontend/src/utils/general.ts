export function toTimestamp(date: string): number {
  return Math.round(new Date(date).getTime() / 1000);
}
