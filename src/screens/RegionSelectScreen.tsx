import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useFonts } from "expo-font";
import Svg, { Circle, Line, Path, Polygon } from "react-native-svg";
import type { Region } from "../encounters/batchGenerator";

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

// ─── SVG Pattern components ───────────────────────────────────────────────────

function PokeballPattern({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={50} fill="none" stroke={color} strokeWidth={3} opacity={0.15} />
      <Circle cx={60} cy={60} r={30} fill="none" stroke={color} strokeWidth={2} opacity={0.1} />
      <Line x1={10} y1={60} x2={110} y2={60} stroke={color} strokeWidth={2} opacity={0.12} />
      <Circle cx={60} cy={60} r={8} fill={color} opacity={0.1} />
    </Svg>
  );
}

function LeafPattern({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 120 120">
      <Path d="M60 10 Q90 40 60 70 Q30 40 60 10Z" fill={color} opacity={0.08} />
      <Path d="M20 50 Q50 30 80 50 Q50 70 20 50Z" fill={color} opacity={0.06} />
      <Line x1={60} y1={10} x2={60} y2={70} stroke={color} strokeWidth={1.5} opacity={0.1} />
    </Svg>
  );
}

function WavePattern({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 120 120">
      <Path d="M0 40 Q20 20 40 40 Q60 60 80 40 Q100 20 120 40" fill="none" stroke={color} strokeWidth={2.5} opacity={0.12} />
      <Path d="M0 60 Q20 40 40 60 Q60 80 80 60 Q100 40 120 60" fill="none" stroke={color} strokeWidth={2} opacity={0.08} />
      <Path d="M0 80 Q20 60 40 80 Q60 100 80 80 Q100 60 120 80" fill="none" stroke={color} strokeWidth={1.5} opacity={0.06} />
    </Svg>
  );
}

function DiamondPattern({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 120 120">
      <Polygon points="60,10 100,50 60,90 20,50" fill="none" stroke={color} strokeWidth={2.5} opacity={0.14} />
      <Polygon points="60,25 85,50 60,75 35,50" fill={color} opacity={0.06} />
      <Line x1={20} y1={50} x2={100} y2={50} stroke={color} strokeWidth={1} opacity={0.1} />
      <Line x1={60} y1={10} x2={60} y2={90} stroke={color} strokeWidth={1} opacity={0.1} />
    </Svg>
  );
}

function GearPattern({ color }: { color: string }) {
  const teeth = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
    const r = (angle * Math.PI) / 180;
    return {
      x1: 60 + 25 * Math.cos(r),
      y1: 60 + 25 * Math.sin(r),
      x2: 60 + 38 * Math.cos(r),
      y2: 60 + 38 * Math.sin(r),
    };
  });
  return (
    <Svg width={100} height={100} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={22} fill="none" stroke={color} strokeWidth={3} opacity={0.12} />
      <Circle cx={60} cy={60} r={10} fill={color} opacity={0.08} />
      {teeth.map((t, i) => (
        <Line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.1} />
      ))}
    </Svg>
  );
}

function FleurPattern({ color }: { color: string }) {
  const petals = [0, 90, 180, 270].map((angle) => {
    const r = (angle * Math.PI) / 180;
    return { cx: 60 + 22 * Math.cos(r), cy: 60 + 22 * Math.sin(r) };
  });
  return (
    <Svg width={100} height={100} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={8} fill={color} opacity={0.12} />
      {petals.map((p, i) => (
        <Circle key={i} cx={p.cx} cy={p.cy} r={14} fill={color} opacity={0.07} />
      ))}
    </Svg>
  );
}

const PATTERNS: Record<string, (color: string) => JSX.Element> = {
  gen1: (c) => <PokeballPattern color={c} />,
  gen2: (c) => <LeafPattern color={c} />,
  gen3: (c) => <WavePattern color={c} />,
  gen4: (c) => <DiamondPattern color={c} />,
  gen5: (c) => <GearPattern color={c} />,
  gen6: (c) => <FleurPattern color={c} />,
};

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

  const isActive = pressed || isSelected;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => region.available && setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={!region.available}
      style={[
        styles.regionCard,
        {
          backgroundColor: region.color,
          width: cardWidth,
          opacity: region.available ? 1 : 0.4,
          transform: [{ scale: isActive ? 0.94 : 1 }],
          shadowColor: region.accent,
          shadowOpacity: isActive ? 0.45 : 0.18,
          shadowRadius: isActive ? 18 : 6,
          shadowOffset: { width: 0, height: isActive ? 8 : 2 },
          elevation: isActive ? 14 : 4,
          borderColor: isActive
            ? `${region.accent}80`
            : "rgba(255,255,255,0.08)",
        },
      ]}
    >
      {/* Background pattern — absolutely positioned, no pointer events */}
      <View style={styles.patternContainer} pointerEvents="none">
        {PATTERNS[region.id]?.(region.textColor)}
      </View>

      {/* Lock badge for unavailable regions */}
      {!region.available && (
        <View style={styles.lockBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}

      <Text style={[styles.generationLabel, { color: region.accent }]}>
        {region.generation}
      </Text>

      <Text style={[styles.regionName, { color: region.textColor }]}>
        {region.label}
      </Text>

      <Text style={[styles.regionSubtitle, { color: region.textColor }]}>
        {region.subtitle}
      </Text>

      <View style={[styles.divider, { backgroundColor: region.textColor }]} />

      <Text style={[styles.startersText, { color: region.textColor }]}>
        {region.starters}
      </Text>

      {/* Bottom accent bar */}
      <View style={[styles.accentBar, { backgroundColor: region.accent }]} />
    </Pressable>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type Props = {
  onSelect: (region: Region) => void;
};

export function RegionSelectScreen({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
  });

  function handleSelect(region: RegionConfig) {
    if (!region.available) return;
    setSelected(region.id);
    setTimeout(() => onSelect(region.id as Region), 300);
  }

  // Chunk into rows of 2 for the grid
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
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.eyebrow,
              fontsLoaded && { fontFamily: "PressStart2P" },
            ]}
          >
            — Choose your world —
          </Text>
          <Text
            style={[
              styles.title,
              fontsLoaded && { fontFamily: "PressStart2P" },
            ]}
          >
            Select Region
          </Text>
          <Text
            style={[
              styles.subtitle,
              fontsLoaded && { fontFamily: "Outfit-Light" },
            ]}
          >
            Where will you begin your journey?
          </Text>
        </View>

        {/* 2-column grid */}
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

        <Text
          style={[
            styles.footer,
            fontsLoaded && { fontFamily: "PressStart2P" },
          ]}
        >
          More regions coming soon...
        </Text>
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
    paddingBottom: 48,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 64 : 44,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 8,
    color: "#6080c0",
    letterSpacing: 3,
    marginBottom: 14,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
    lineHeight: 30,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#6080a0",
    letterSpacing: 0.5,
    textAlign: "center",
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
    borderRadius: 16,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  patternContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 100,
    height: 100,
  },
  lockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: {
    fontSize: 10,
  },
  generationLabel: {
    fontSize: 6,
    letterSpacing: 2,
    marginBottom: 9,
    fontFamily: "PressStart2P",
  },
  regionName: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
    fontFamily: "PressStart2P",
  },
  regionSubtitle: {
    fontSize: 10,
    opacity: 0.65,
    marginBottom: 12,
    letterSpacing: 0.3,
    fontFamily: "Outfit-Light",
  },
  divider: {
    height: 1,
    opacity: 0.15,
    marginBottom: 9,
  },
  startersText: {
    fontSize: 8,
    opacity: 0.55,
    letterSpacing: 0.2,
    lineHeight: 13,
    fontFamily: "Outfit-Light",
  },
  accentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  footer: {
    textAlign: "center",
    fontSize: 7,
    color: "#3a4a6a",
    letterSpacing: 1.5,
    marginTop: 4,
  },
});
