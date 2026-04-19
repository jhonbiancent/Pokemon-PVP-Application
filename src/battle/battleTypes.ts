import { Pokemon } from "../types/pokemon";

export type BattleState = {
  player: Pokemon;
  enemy: Pokemon;
  turn: "player" | "enemy";
  log: string[];
  winner: "player" | "enemy" | null;
  isAttacking: boolean;
};
