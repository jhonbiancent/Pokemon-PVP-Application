export function selectMoves(moves: any[], level: number) {
  // 1. Filter for level-up moves only
  const levelUpMoves = moves
    .map((m: any) => {
      // Find the detail that matches level-up (prefer latest generation)
      const levelUpDetail = m.version_group_details.find(
        (detail: any) => detail.move_learn_method.name === "level-up",
      );

      return {
        name: m.move.name,
        url: m.move.url,
        levelLearned: levelUpDetail ? levelUpDetail.level_learned_at : 999,
      };
    })
    .filter((m) => m.levelLearned <= level); // Only moves learned at or below current level

  // 2. Sort by level learned (most recent first)
  const sortedMoves = levelUpMoves.sort((a, b) => b.levelLearned - a.levelLearned);

  // 3. Take top 4 (the most recent ones)
  return sortedMoves.slice(0, 4);
}
