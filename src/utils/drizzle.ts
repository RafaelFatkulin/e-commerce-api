export const takeUniqueOrThrow = <T>(values: T[]): T => {
  return values[0]!;
};
