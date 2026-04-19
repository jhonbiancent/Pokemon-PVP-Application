import { useState } from "react";
import { Text, View } from "react-native";

import MoveButton from "../components/moveButton";
import PokemonCard from "../components/pokemonCard";

import { BattleState } from "../battle/battleTypes";
import { playerAttack } from "../battle/turnManager";

export default function BattleScreen({ route }: any) {
  const { player, enemy } = route.params;

  const [state, setState] = useState<BattleState>({
    player,
    enemy,
    turn: "player",
    log: [],
    winner: null,
  });

  const attack = (index: number) => {
    const updated = playerAttack(state, index);
    setState(updated);
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

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
      <View>
        {state.log.slice(-2).map((l, i) => (
          <Text key={i}>{l}</Text>
        ))}
      </View>

      {/* Player */}
      <PokemonCard pokemon={state.player} />

      {/* Moves */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {state.player.moves.map((move, i) => (
          <MoveButton key={i} move={move} onPress={() => attack(i)} />
        ))}
      </View>

      {state.winner && (
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Winner: {state.winner}
        </Text>
      )}
    </View>
  );
}
