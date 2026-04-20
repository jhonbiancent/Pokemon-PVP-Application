import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import BattleButton from "./battleButton";

type Props = {
  moves: any[];
  onMovePress: (index: number) => void;
  disabled: boolean;
};

export default function BattleActions({ moves, onMovePress, disabled }: Props) {
  const [menu, setMenu] = useState<"main" | "fight">("main");

  if (menu === "main") {
    return (
      <View style={styles.container}>
        <BattleButton
          label="Fight"
          onPress={() => setMenu("fight")}
          disabled={disabled}
          color="#0A0D2E"
        />
        <BattleButton
          label="Pokemon"
          onPress={() => {}}
          disabled={disabled}
          color="#0A0D2E"
        />
        <BattleButton
          label="Bag"
          onPress={() => {}}
          disabled={disabled}
          color="#0A0D2E"
        />
        <BattleButton
          label="Run"
          onPress={() => {}}
          disabled={disabled}
          color="#0A0D2E"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {moves.map((move, i) => (
        <BattleButton
          key={i}
          label={move.name}
          subLabel={`Pwr: ${move.power}`}
          onPress={() => onMovePress(i)}
          disabled={disabled}
          height="31%" // 3 rows
        />
      ))}
      <BattleButton
        label="Back"
        onPress={() => setMenu("main")}
        disabled={disabled}
        width="98%"
        height="31%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: 250,
    backgroundColor: "#030712",
    padding: 12,
    color: "white",
    paddingBottom: 20,
    justifyContent: "space-between",
    alignContent: "space-between",
  },
});
