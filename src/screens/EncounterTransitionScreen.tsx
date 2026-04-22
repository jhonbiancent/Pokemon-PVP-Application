import type { Area, Region } from "@/src/encounter/batchGenerator";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  region: Region;
  area: Area;
  /** Called once animation completes AND data is ready */
  onReady: () => void;
  /** True when useEncounterQueue has finished its initial load */
  isDataReady: boolean;
};

const AREA_MESSAGES: Record<Area, string> = {
  cave: "A Pokémon lurks in the dark...",
  grass: "A wild Pokémon appeared!",
  water: "A Pokémon surfaced from below!",
  forest: "A Pokémon jumped from the trees!",
};

const MIN_ANIMATION_MS = 1500;

/**
 * Transition screen that plays a minimum animation and only
 * calls onReady when BOTH the animation has finished AND data is loaded.
 * This prevents flashing to battle with an empty queue.
 */
export function EncounterTransitionScreen({
  area,
  onReady,
  isDataReady,
}: Props) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationDone(true), MIN_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationDone && isDataReady) {
      onReady();
    }
  }, [animationDone, isDataReady, onReady]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{AREA_MESSAGES[area]}</Text>
      {!isDataReady && <Text style={styles.loading}>Loading encounter...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loading: {
    color: "#666",
    marginTop: 20,
    fontSize: 14,
  },
});
