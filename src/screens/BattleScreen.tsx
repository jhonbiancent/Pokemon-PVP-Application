import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import BattleActions from "../components/battleActions";
import PokemonCard from "../components/pokemonCard";

import { getRandomMove } from "../battle/ai";
import { dealDamage, isGameOver } from "../battle/battleEngine";
import { BattleState } from "../battle/battleTypes";

import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const playCry = async (url: string) => {
  try {
    const player = createAudioPlayer({ uri: url });
    await player.play();
  } catch (e) {
    console.log("Cry error:", e);
  }
};
export default function BattleScreen({ route }: any) {
  const { player, enemy } = route.params;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
    playCry(enemy.cry);
  }, []);

  const [state, setState] = useState<BattleState>({
    player,
    enemy,
    turn: "player",
    log: [],
    winner: null,
    attackingSide: null,
    hitSide: null,
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const attack = async (index: number) => {
    if (state.attackingSide || state.winner) return;

    // 1. Player Turn
    const move = state.player.moves[index];

    // Show "Player used..."
    await delay(500);
    setState((s) => ({
      ...s,
      log: [...s.log, `Player used ${move.name}!`],
    }));
    playCry(state.player.cry);

    // Trigger Attack Animation (Move toward opponent)
    await delay(500);
    setState((s) => ({ ...s, attackingSide: "player" }));

    // Wait for movement to "hit", then trigger Hit Animation (Shake) + Damage
    await delay(400); // Wait for move animation to reach opponent
    setState((s) => ({ ...s, hitSide: "enemy", attackingSide: null }));

    const newEnemyHp = dealDamage(state.enemy.hp, move);
    const afterPlayerAttack: BattleState = {
      ...state,
      enemy: { ...state.enemy, hp: newEnemyHp },
      hitSide: null,
      attackingSide: null,
    };

    const winnerAfterPlayer = isGameOver(afterPlayerAttack);
    if (winnerAfterPlayer) {
      setState({
        ...afterPlayerAttack,
        winner: winnerAfterPlayer,
      });
      return;
    }

    setState(afterPlayerAttack);

    // 2. Enemy Turn
    await delay(1000); // Pause between turns
    const enemyMove = getRandomMove(state.enemy);

    // Show "Enemy used..."
    setState((s) => ({ ...s, turn: "enemy" }));
    await delay(500);
    setState((s) => ({
      ...s,
      log: [...s.log, `Enemy used ${enemyMove.name}!`],
    }));
    playCry(state.enemy.cry);

    // Trigger Attack Animation
    await delay(500);
    setState((s) => ({ ...s, attackingSide: "enemy" }));

    // Trigger Hit + Damage
    await delay(400);
    setState((s) => ({ ...s, hitSide: "player", attackingSide: null }));

    const newPlayerHp = dealDamage(state.player.hp, enemyMove);
    const afterEnemyAttack: BattleState = {
      ...afterPlayerAttack,
      player: { ...state.player, hp: newPlayerHp },
      turn: "player",
      hitSide: null,
      attackingSide: null,
    };

    const winnerAfterEnemy = isGameOver(afterEnemyAttack);
    setState({ ...afterEnemyAttack, winner: winnerAfterEnemy });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
      }}
    >
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 10 }}
      >
        {/* Enemy */}
        <PokemonCard
          pokemon={state.enemy}
          isAttacking={state.attackingSide === "enemy"}
          isHit={state.hitSide === "enemy"}
        />

        {/* Battle Log */}
        <View
          style={{ height: 50, justifyContent: "center", marginVertical: 40 }}
        >
          {state.log.slice(-2).map((l, i) => (
            <Text
              key={i}
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {l}
            </Text>
          ))}

          {state.winner && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: state.winner === "player" ? "#4CAF50" : "#F44336",
              }}
            >
              {state.winner === "player" ? "YOU WIN!" : "YOU LOSE!"}
            </Text>
          )}
        </View>

        {/* Player */}
        <PokemonCard
          pokemon={state.player}
          isBack={true}
          isAttacking={state.attackingSide === "player"}
          isHit={state.hitSide === "player"}
        />
      </View>

      {/* Battle Actions Menu */}
      <BattleActions
        moves={state.player.moves}
        onMovePress={attack}
        disabled={!!state.attackingSide || !!state.winner}
      />
    </View>
  );
}
