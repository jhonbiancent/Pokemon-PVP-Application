import { useState } from "react";
import { Button, Text, View } from "react-native";
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
    const newState = { ...state };
    playerAttack(newState, index);
    setState({ ...newState });
  };

  return (
    <View style={{ padding: 20, marginTop: 40 }}>
      <Text>Enemy: {state.enemy.name}</Text>
      <Text>HP: {state.enemy.hp}</Text>

      <Text style={{ marginTop: 20 }}>You: {state.player.name}</Text>
      <Text>HP: {state.player.hp}</Text>

      <View style={{ marginTop: 30 }}>
        {state.player.moves.map((m, i) => (
          <Button
            key={i}
            title={m.name}
            onPress={() => attack(i)}
            disabled={!!state.winner}
          />
        ))}
      </View>

      {state.winner && (
        <Text style={{ marginTop: 20 }}>Winner: {state.winner}</Text>
      )}

      <View style={{ marginTop: 20 }}>
        {state.log.slice(-5).map((l, i) => (
          <Text key={i}>{l}</Text>
        ))}
      </View>
    </View>
  );
}
