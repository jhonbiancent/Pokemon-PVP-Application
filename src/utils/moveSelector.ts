import type { RawMove, SelectedMove } from "@/src/encounter/types";

const STRUGGLE: SelectedMove = {
  name: "struggle",
  url: "",
  levelLearned: 0,
};

/**
 * Filters a raw moves array down to the 4 most recently learned moves
 * at or below the given level. Game-accurate: most recent = highest levelLearned.
 *
 * Falls back to [Struggle] if no level-up moves exist at the given level.
 * This matches Gen 1 behaviour exactly.
 */
export function selectMoves(
  rawMoves: RawMove[],
  level: number,
): SelectedMove[] {
  const eligible = rawMoves
    .filter((m) => m.levelLearned > 0 && m.levelLearned <= level)
    .sort((a, b) => b.levelLearned - a.levelLearned)
    .slice(0, 4);

  if (eligible.length === 0) return [STRUGGLE];
  return eligible;
}

/**
 * Parses raw PokeAPI move data into our RawMove shape.
 * Filters to level-up method only, picks latest generation detail.
 */
export function parseRawMoves(apiMoves: any[]): RawMove[] {
  return apiMoves
    .map((m: any) => {
      const levelUpDetail = m.version_group_details
        .filter((d: any) => d.move_learn_method.name === "level-up")
        .sort((a: any, b: any) =>
          b.version_group.url.localeCompare(a.version_group.url),
        )[0];

      if (!levelUpDetail) return null;

      return {
        name: m.move.name,
        url: m.move.url,
        levelLearned: levelUpDetail.level_learned_at,
      } satisfies RawMove;
    })
    .filter((m): m is RawMove => m !== null);
}
