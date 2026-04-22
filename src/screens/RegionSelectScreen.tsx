import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Region } from "../encounter/batchGenerator";
import { RegionSelectScreenProps } from "../types/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type RegionConfig = {
  id: string;
  label: string;
  subtitle: string;
  generation: string;
  color: string;
  accent: string;
  textColor: string;
  starters: string;
  available: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const REGIONS: RegionConfig[] = [
  {
    id: "gen1",
    label: "Kanto",
    subtitle: "Pallet Town",
    generation: "Generation I",
    color: "#1a3a5c",
    accent: "#e84040",
    textColor: "#e8f4ff",
    starters: "Bulbasaur · Charmander · Squirtle",
    available: true,
  },
  {
    id: "gen2",
    label: "Johto",
    subtitle: "New Bark Town",
    generation: "Generation II",
    color: "#2a4a2a",
    accent: "#f0c040",
    textColor: "#e8ffe8",
    starters: "Chikorita · Cyndaquil · Totodile",
    available: true,
  },
  {
    id: "gen3",
    label: "Hoenn",
    subtitle: "Littleroot Town",
    generation: "Generation III",
    color: "#1a2a4a",
    accent: "#4090e0",
    textColor: "#e0eeff",
    starters: "Treecko · Torchic · Mudkip",
    available: false,
  },
  {
    id: "gen4",
    label: "Sinnoh",
    subtitle: "Twinleaf Town",
    generation: "Generation IV",
    color: "#2a1a4a",
    accent: "#a060e0",
    textColor: "#ede8ff",
    starters: "Turtwig · Chimchar · Piplup",
    available: false,
  },
  {
    id: "gen5",
    label: "Unova",
    subtitle: "Nuvema Town",
    generation: "Generation V",
    color: "#3a2a1a",
    accent: "#e08020",
    textColor: "#fff0e0",
    starters: "Snivy · Tepig · Oshawott",
    available: false,
  },
  {
    id: "gen6",
    label: "Kalos",
    subtitle: "Vaniville Town",
    generation: "Generation VI",
    color: "#3a1a2a",
    accent: "#e040a0",
    textColor: "#ffe8f4",
    starters: "Chespin · Fennekin · Froakie",
    available: false,
  },
];

// ─── Region card ──────────────────────────────────────────────────────────────

function RegionCard({
  region,
  onPress,
  isSelected,
}: {
  region: RegionConfig;
  onPress: () => void;
  isSelected: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const { width } = Dimensions.get("window");
  const cardWidth = (width - 16 * 2 - 12) / 2;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => region.available && setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={!region.available}
      style={[
        styles.regionCard,
        {
          width: cardWidth,
          backgroundColor: "#111827",
          opacity: region.available ? 1 : 0.35,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          borderColor: isSelected ? "#4a90e2" : "#222",
        },
      ]}
    >
      <Text style={styles.regionName}>{region.label}</Text>
      <Text style={styles.regionSubtitle}>{region.subtitle}</Text>

      <View style={styles.divider} />

      <Text style={styles.startersText}>{region.starters}</Text>

      {!region.available && <Text style={styles.lockedText}>Coming Soon</Text>}
    </Pressable>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function RegionSelectScreen({
  navigation,
  route,
}: RegionSelectScreenProps) {
  const { player } = route.params;
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(region: RegionConfig) {
    if (!region.available) return;

    setSelected(region.id);

    setTimeout(() => {
      navigation.navigate("AreaSelect", {
        region: region.id as Region,
        player,
      });
    }, 200);
  }

  const rows: RegionConfig[][] = [];
  for (let i = 0; i < REGIONS.length; i += 2) {
    rows.push(REGIONS.slice(i, i + 2));
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Select Region</Text>
          <Text style={styles.subtitle}>
            Where will you begin your journey?
          </Text>
        </View>

        <View style={styles.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  onPress={() => handleSelect(region)}
                  isSelected={selected === region.id}
                />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>More regions coming soon...</Text>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0e1a",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#8b98a5",
  },

  grid: {
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  regionCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },

  regionName: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 2,
  },

  regionSubtitle: {
    fontSize: 12,
    color: "#9aa4b2",
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#222",
    marginBottom: 8,
  },

  startersText: {
    fontSize: 11,
    color: "#6b7280",
  },

  lockedText: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
});
