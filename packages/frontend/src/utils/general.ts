export function toTimestamp(date: string): number {
  return Math.round(new Date(date).getTime() / 1000);
}

export function valueToString(number: number, decimals: number = 3) {
  return number.toPrecision(Math.floor(number).toString().length + decimals);
}
