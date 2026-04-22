import type { Area, Region } from "@/src/encounter/batchGenerator";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { EncounterPokemon } from "../encounter/types";
import { useEncounterQueue } from "../hooks/useEncounterQueue";
import { Pokemon } from "../types/pokemon";
import { calculateHp, calculateStat } from "../utils/statCalculator";
import { Battle } from "./BattleScreen";
import { EncounterTransitionScreen } from "./EncounterTransitionScreen";
import { EncounterFlowProps } from "../types/navigation";

type Screen = "transition" | "battle";

/**
 * Maps EncounterPokemon (from the queue) to the full Pokemon type expected by the Battle component.
 */
function mapEncounterToPokemon(encounter: EncounterPokemon): Pokemon {
  const hp = calculateHp(encounter.baseStats.hp, encounter.level);
  return {
    id: encounter.id,
    name: encounter.name,
    level: encounter.level,
    type: encounter.types,
    hp: hp,
    maxHp: hp,
    attack: calculateStat(encounter.baseStats.attack, encounter.level),
    defense: calculateStat(encounter.baseStats.defense, encounter.level),
    specialAttack: calculateStat(encounter.baseStats.spAttack, encounter.level),
    specialDefense: calculateStat(
      encounter.baseStats.spDefense,
      encounter.level,
    ),
    speed: calculateStat(encounter.baseStats.speed, encounter.level),
    frontImage: encounter.image,
    backImage: encounter.image,
    isShiny: encounter.isShiny,
    moves: encounter.moves.map((m) => ({
      name: m.name,
      power: 40, // Default power for wild encounters since we don't fetch move details here
    })),
    cry: `https://play.pokemonshowdown.com/audio/cries/${encounter.name.toLowerCase().replace(/[^a-z]/g, "")}.mp3`,
  };
}

/**
 * EncounterFlow orchestrates the full region → area → battle loop.
 */
export function EncounterFlow({ route, navigation }: EncounterFlowProps) {
  const { region, area, player, onExit } = route.params;
  const [screen, setScreen] = useState<Screen>("transition");

  const { currentEncounter, isReady, isInitialLoading, advance, reset } =
    useEncounterQueue(region, area);

  const handleTransitionReady = useCallback(() => {
    setScreen("battle");
  }, []);

  const handleBattleEnd = useCallback(
    (winner: "player" | "enemy") => {
      console.log(`Battle ended. Winner: ${winner}`);
      // Wait a bit then go back to transition for the next encounter
      setTimeout(() => {
        advance();
        setScreen("transition");
      }, 2000);
    },
    [advance],
  );

  const handleExit = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  if (screen === "transition") {
    return (
      <EncounterTransitionScreen
        region={region}
        area={area}
        isDataReady={!isInitialLoading && isReady}
        onReady={handleTransitionReady}
      />
    );
  }

  if (!currentEncounter) return null;

  const enemy = mapEncounterToPokemon(currentEncounter);

  return (
    <View style={styles.container}>
      <Battle player={player} enemy={enemy} onBattleEnd={handleBattleEnd} onRun={handleExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
