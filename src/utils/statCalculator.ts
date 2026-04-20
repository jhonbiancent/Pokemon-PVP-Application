export function calculateHp(baseHp: number, level: number) {
  return Math.floor(((baseHp * 2 + 31) * level) / 100 + level + 10);
}

export function calculateStat(baseStat: number, level: number) {
  return Math.floor(((baseStat * 2 + 31) * level) / 100 + 5);
}
