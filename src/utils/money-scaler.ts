export function scaleMoney(value: number) {
  return BigInt(Math.round(value * 100));
}
export function unscaleMoney(value: bigint) {
  const bigVal = BigInt(value);
  const sign = bigVal < 0n ? -1 : 1;
  const abs = bigVal < 0n ? -bigVal : bigVal;
  const major = Number(abs / 100n);
  const minor = Number(abs % 100n) / 100;
  return sign * (major + minor);
}
