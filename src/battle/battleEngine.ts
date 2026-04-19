import { Move } from "../types/pokemon";
import { BattleState } from "./battleTypes";

export function dealDamage(defenderHp: number, move: Move) {
  return Math.max(defenderHp - move.power, 0);
}

export function isGameOver(state: BattleState) {
  if (state.enemy.hp <= 0) return "player";
  if (state.player.hp <= 0) return "enemy";
  return null;
}
