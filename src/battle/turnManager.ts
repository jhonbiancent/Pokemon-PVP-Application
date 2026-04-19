import { getRandomMove } from "./ai";
import { dealDamage, isGameOver } from "./battleEngine";
import { BattleState } from "./battleTypes";

export function playerAttack(state: BattleState, moveIndex: number) {
  if (state.winner) return state;

  const move = state.player.moves[moveIndex];

  const newEnemyHp = dealDamage(state.enemy.hp, move);

  state.enemy.hp = newEnemyHp;
  state.log.push(`Player used ${move.name}`);

  const winner = isGameOver(state);
  if (winner) {
    state.winner = winner;
    return state;
  }

  return enemyTurn(state);
}

export function enemyTurn(state: BattleState) {
  const move = getRandomMove(state.enemy);

  const newPlayerHp = dealDamage(state.player.hp, move);

  state.player.hp = newPlayerHp;
  state.log.push(`Enemy used ${move.name}`);

  const winner = isGameOver(state);
  if (winner) {
    state.winner = winner;
  }

  return state;
}
