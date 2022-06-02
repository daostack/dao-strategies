export const toNumber = (bn: bigint | null | undefined): number | undefined => {
  if (bn === undefined || bn == null) {
    return undefined;
  }
  if (bn > Number.MAX_SAFE_INTEGER) {
    throw new Error('cannot convert bigint to number');
  }
  return Number(bn);
};
