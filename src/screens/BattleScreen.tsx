import { useState } from "react";
import { Text, View } from "react-native";

import MoveButton from "../components/moveButton";
import PokemonCard from "../components/pokemonCard";

import { getRandomMove } from "../battle/ai";
import { dealDamage, isGameOver } from "../battle/battleEngine";
import { BattleState } from "../battle/battleTypes";

export default function BattleScreen({ route }: any) {
  const { player, enemy } = route.params;

  const [state, setState] = useState<BattleState>({
    player,
    enemy,
    turn: "player",
    log: [],
    winner: null,
    isAttacking: false,
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const attack = async (index: number) => {
    if (state.isAttacking || state.winner) return;

    // 1. Start Attack
    setState((s) => ({ ...s, isAttacking: true }));

    const move = state.player.moves[index];

    // 2. Display "Player used..." message after 0.5s
    await delay(500);
    setState((s) => ({
      ...s,
      log: [...s.log, `Player used ${move.name}!`],
    }));

    // 3. Take 1 second for damage to hit
    await delay(1000);
    const newEnemyHp = dealDamage(state.enemy.hp, move);
    const afterPlayerAttack: BattleState = {
      ...state,
      enemy: { ...state.enemy, hp: newEnemyHp },
      isAttacking: false, // temporarily false to check game over
    };

    const winnerAfterPlayer = isGameOver(afterPlayerAttack);
    if (winnerAfterPlayer) {
      setState({ ...afterPlayerAttack, winner: winnerAfterPlayer, isAttacking: false });
      return;
    }

    // Update state with damage
    setState(afterPlayerAttack);

    // 4. Enemy Turn (with similar delays)
    await delay(1000); // 1s delay between attacks
    setState((s) => ({ ...s, isAttacking: true, turn: "enemy" }));

    const enemyMove = getRandomMove(state.enemy);

    await delay(500);
    setState((s) => ({
      ...s,
      log: [...s.log, `Enemy used ${enemyMove.name}!`],
    }));

    await delay(1000);
    const newPlayerHp = dealDamage(state.player.hp, enemyMove);
    const afterEnemyAttack: BattleState = {
      ...afterPlayerAttack,
      player: { ...state.player, hp: newPlayerHp },
      turn: "player",
      isAttacking: false,
    };

    const winnerAfterEnemy = isGameOver(afterEnemyAttack);
    setState({ ...afterEnemyAttack, winner: winnerAfterEnemy });
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
      }}
    >
      {/* Enemy */}
      <PokemonCard pokemon={state.enemy} />

      {/* Battle Log */}
      <View style={{ height: 60, justifyContent: "center" }}>
        {state.log.slice(-2).map((l, i) => (
          <Text key={i} style={{ textAlign: "center", fontWeight: "bold" }}>
            {l}
          </Text>
        ))}
      </View>

      {/* Player */}
      <PokemonCard pokemon={state.player} />

      {/* Moves */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {state.player.moves.map((move, i) => (
          <MoveButton
            key={i}
            move={move}
            onPress={() => attack(i)}
            disabled={state.isAttacking || !!state.winner}
          />
        ))}
      </View>

      {state.winner && (
        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
            color: state.winner === "player" ? "green" : "red",
          }}
        >
          {state.winner === "player" ? "YOU WIN!" : "YOU LOSE!"}
        </Text>
      )}
    </View>
  );
}
