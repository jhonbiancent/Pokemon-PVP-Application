export function calculateHp(baseHp: number, level: number) {
  return Math.floor((baseHp * 2 * level) / 100 + level + 10);
}
