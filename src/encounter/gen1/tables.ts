import type { EncounterTable } from "@/src/encounter/types";

export const gen1Cave: EncounterTable = [
  { id: 41, rate: 0.35, levels: { min: 6, max: 11 } }, // Zubat
  { id: 74, rate: 0.25, levels: { min: 8, max: 12 } }, // Geodude
  { id: 46, rate: 0.15, levels: { min: 8, max: 12 } }, // Paras
  { id: 35, rate: 0.1, levels: { min: 10, max: 12 } }, // Clefairy
  { id: 27, rate: 0.1, levels: { min: 7, max: 11 } }, // Sandshrew
  { id: 95, rate: 0.04, levels: { min: 12, max: 18 } }, // Onix
  { id: 104, rate: 0.01, levels: { min: 15, max: 20 } }, // Cubone (rare)
];

export const gen1Grass: EncounterTable = [
  { id: 16, rate: 0.3, levels: { min: 3, max: 8 } }, // Pidgey
  { id: 19, rate: 0.25, levels: { min: 3, max: 7 } }, // Rattata
  { id: 10, rate: 0.2, levels: { min: 3, max: 7 } }, // Caterpie
  { id: 13, rate: 0.15, levels: { min: 3, max: 7 } }, // Weedle
  { id: 43, rate: 0.07, levels: { min: 5, max: 10 } }, // Oddish
  { id: 69, rate: 0.02, levels: { min: 8, max: 12 } }, // Bellsprout
  { id: 123, rate: 0.01, levels: { min: 15, max: 20 } }, // Scyther (rare)
];

export const gen1Water: EncounterTable = [
  { id: 60, rate: 0.35, levels: { min: 5, max: 10 } }, // Poliwag
  { id: 79, rate: 0.25, levels: { min: 5, max: 10 } }, // Slowpoke
  { id: 90, rate: 0.2, levels: { min: 5, max: 12 } }, // Shellder
  { id: 98, rate: 0.1, levels: { min: 8, max: 12 } }, // Krabby
  { id: 54, rate: 0.07, levels: { min: 5, max: 10 } }, // Psyduck
  { id: 116, rate: 0.02, levels: { min: 10, max: 15 } }, // Horsea
  { id: 131, rate: 0.01, levels: { min: 20, max: 30 } }, // Lapras (rare)
];

export const gen1Forest: EncounterTable = [
  { id: 10, rate: 0.25, levels: { min: 3, max: 8 } }, // Caterpie
  { id: 13, rate: 0.25, levels: { min: 3, max: 8 } }, // Weedle
  { id: 43, rate: 0.2, levels: { min: 5, max: 10 } }, // Oddish
  { id: 46, rate: 0.15, levels: { min: 5, max: 10 } }, // Paras
  { id: 102, rate: 0.1, levels: { min: 8, max: 14 } }, // Exeggcute
  { id: 114, rate: 0.04, levels: { min: 10, max: 15 } }, // Tangela
  { id: 127, rate: 0.01, levels: { min: 15, max: 25 } }, // Pinsir (rare)
];
