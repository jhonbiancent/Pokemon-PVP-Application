import { generateLevel, generateShiny } from "@/src/encounter/generators";
import { weightedPickMany } from "@/src/encounter/weightedPicker";
import { buildFallback, fetchBatch } from "./fetchWithCache";
import type { EncounterTable, GeneratedEncounter, QueueEntry } from "./types";

/**
 * Region/area → encounter table registry.
 * Extend this as you add more regions and tables.
 */
import { gen1Cave, gen1Forest, gen1Grass, gen1Water } from "./gen1/tables";
import { gen2Cave, gen2Forest, gen2Grass, gen2Water } from "./gen2/tables";

export type Region = "gen1" | "gen2";
export type Area = "cave" | "grass" | "water" | "forest";

const TABLE_REGISTRY: Record<Region, Record<Area, EncounterTable>> = {
  gen1: {
    cave: gen1Cave,
    grass: gen1Grass,
    water: gen1Water,
    forest: gen1Forest,
  },
  gen2: {
    cave: gen2Cave,
    grass: gen2Grass,
    water: gen2Water,
    forest: gen2Forest,
  },
};

/**
 * Resolves a table from the registry.
 * Throws early if the combination doesn't exist — better to fail loud here
 * than silently produce wrong encounters.
 */
export function getTable(region: Region, area: Area): EncounterTable {
  const table = TABLE_REGISTRY[region]?.[area];
  if (!table) {
    throw new Error(`No encounter table for region="${region}" area="${area}"`);
  }
  return table;
}

/**
 * Generates `count` encounters from a given region/area, then fetches
 * all required Pokémon data (deduplicated via fetchBatch).
 *
 * Returns ready-to-queue QueueEntry objects: each has the generated
 * encounter data AND the raw API data needed at dequeue time.
 *
 * Uses Promise.allSettled internally so partial API failures still
 * produce a full batch (missing data gets fallback stats/moves).
 */
export async function generateBatch(
  region: Region,
  area: Area,
  count: number = 10,
): Promise<QueueEntry[]> {
  const table = getTable(region, area);

  // Step 1: Generate encounters (pure JS, instant)
  const picks = weightedPickMany(table, count);
  const generated: GeneratedEncounter[] = picks.map((entry) => ({
    id: entry.id,
    level: generateLevel(entry),
    isShiny: generateShiny(entry),
  }));

  // Step 2: Deduplicate IDs before fetching
  const uniqueIds = [...new Set(generated.map((g) => g.id))];

  // Step 3: Fetch all unique IDs in parallel (cache + promise registry handle deduplication)
  const dataMap = await fetchBatch(uniqueIds);

  // Step 4: Assemble QueueEntry for each generated encounter
  return generated.map((enc) => {
    const rawData = dataMap.get(enc.id) ?? buildFallback();
    return {
      ...enc,
      rawData,
    };
  });
}
