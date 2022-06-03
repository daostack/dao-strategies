export const TimeService = jest.fn().mockImplementation(function () {
  return {
    now: (): number => {
      return 100;
    },
    set: (n: number): void => {},

    advance: (n: number): void => {},
  };
});
