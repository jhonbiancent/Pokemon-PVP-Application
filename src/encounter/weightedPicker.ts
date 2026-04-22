import type { EncounterEntry, EncounterTable } from "./types";

/**
 * Picks one encounter entry from a table using weighted random selection.
 * Rates in the table should sum to 1.0 but this handles floating point drift gracefully.
 */
export function weightedPick(table: EncounterTable): EncounterEntry {
  const totalWeight = table.reduce((sum, entry) => sum + entry.rate, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of table) {
    roll -= entry.rate;
    if (roll <= 0) return entry;
  }

  // Floating point fallback — return last entry
  return table[table.length - 1];
}

/**
 * Picks `count` entries from the table independently (with replacement).
 * Same Pokémon can appear multiple times — this is intentional and game-accurate.
 */
export function weightedPickMany(
  table: EncounterTable,
  count: number,
): EncounterEntry[] {
  return Array.from({ length: count }, () => weightedPick(table));
}
