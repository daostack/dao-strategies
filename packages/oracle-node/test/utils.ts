export const hours = (s: number): number => {
  return 60 * 60 * s;
};

export const days = (s: number): number => {
  return 24 * hours(s);
};

export const months = (s: number): number => {
  return 31 * days(s);
};
