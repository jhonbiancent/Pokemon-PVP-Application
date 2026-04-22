import type { Area, Region } from "@/src/encounter/batchGenerator";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";

// ─── Types ────────────────────────────────────────────────────────────────────

type AreaConfig = {
  id: Area;
  label: string;
  description: string;
  encounterHint: string;
  bgTop: string;
  bgBottom: string;
  accent: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  encounterRate: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const AREAS: AreaConfig[] = [
  {
    id: "grass",
    label: "Grasslands",
    description: "Tall grass sways in the warm breeze.",
    encounterHint: "Pidgey, Rattata, Caterpie...",
    bgTop: "#1a3a10",
    bgBottom: "#0e2208",
    accent: "#5dc840",
    icon: "🌿",
    difficulty: "easy",
    encounterRate: "Common",
  },
  {
    id: "forest",
    label: "Deep Forest",
    description: "Dense canopy blocks out the sunlight.",
    encounterHint: "Caterpie, Paras, Exeggcute...",
    bgTop: "#0e2a14",
    bgBottom: "#081408",
    accent: "#40a840",
    icon: "🌲",
    difficulty: "medium",
    encounterRate: "Frequent",
  },
  {
    id: "cave",
    label: "Dark Cave",
    description: "Echoes bounce off damp stone walls.",
    encounterHint: "Zubat, Geodude, Onix...",
    bgTop: "#1a1428",
    bgBottom: "#0c0a18",
    accent: "#8060d0",
    icon: "🪨",
    difficulty: "medium",
    encounterRate: "Moderate",
  },
  {
    id: "water",
    label: "Open Water",
    description: "The deep blue stretches endlessly.",
    encounterHint: "Poliwag, Slowpoke, Lapras...",
    bgTop: "#0a1e38",
    bgBottom: "#060e20",
    accent: "#2090e0",
    icon: "🌊",
    difficulty: "hard",
    encounterRate: "Rare finds",
  },
];

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#5dc840",
  medium: "#e0a020",
  hard: "#e04040",
};

const REGION_FLAVOR: Record<string, Partial<Record<Area, string>>> = {
  gen1: {
    grass: "Route 1 · Pallet Town vicinity",
    forest: "Viridian Forest · Bug Catcher territory",
    cave: "Mt. Moon · Rock Tunnel",
    water: "Cerulean Cape · Seafoam Islands",
  },
  gen2: {
    grass: "Route 29 · New Bark vicinity",
    forest: "Ilex Forest · Headbutt trees",
    cave: "Dark Cave · Mt. Mortar",
    water: "Olivine Coast · Whirl Islands",
  },
};

// ─── Environment illustrations (react-native-svg) ─────────────────────────────

function GrassIllustration() {
  const bladeXs = [
    10, 25, 38, 52, 65, 78, 92, 108, 120, 135, 148, 162, 175, 188,
  ];
  return (
    <Svg width="100%" height={72} viewBox="0 0 200 72">
      <Rect x={0} y={50} width={200} height={22} fill="#1a4010" opacity={0.6} />
      {bladeXs.map((x, i) => (
        <React.Fragment key={i}>
          <Line
            x1={x}
            y1={50}
            x2={x - 5}
            y2={50 - 12 - (i % 3) * 4}
            stroke="#4caf30"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.9}
          />
          <Line
            x1={x + 5}
            y1={50}
            x2={x + 9}
            y2={50 - 16 - (i % 2) * 5}
            stroke="#3d9020"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.8}
          />
          <Line
            x1={x + 2}
            y1={50}
            x2={x + 1}
            y2={50 - 19 - (i % 4) * 3}
            stroke="#5ac835"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.7}
          />
        </React.Fragment>
      ))}
      <Circle cx={170} cy={15} r={11} fill="#ffe060" opacity={0.16} />
      <Circle cx={170} cy={15} r={6} fill="#ffe060" opacity={0.26} />
      {[30, 75, 125, 165].map((x, i) => (
        <Circle
          key={i}
          cx={x}
          cy={8 + i * 4}
          r={1.4}
          fill="#ffffff"
          opacity={0.28}
        />
      ))}
    </Svg>
  );
}

function ForestIllustration() {
  const treeXs = [20, 60, 100, 140, 180];
  return (
    <Svg width="100%" height={72} viewBox="0 0 200 72">
      <Rect x={0} y={54} width={200} height={18} fill="#0e2208" opacity={0.8} />
      {treeXs.map((x, i) => (
        <React.Fragment key={i}>
          <Rect
            x={x - 5}
            y={40}
            width={10}
            height={16}
            fill="#4a2a10"
            opacity={0.7}
          />
          <Polygon
            points={`${x},6 ${x - 20 + i * 2},48 ${x + 20 - i * 2},48`}
            fill="#1a5018"
            opacity={0.85}
          />
          <Polygon
            points={`${x},2 ${x - 14},34 ${x + 14},34`}
            fill="#246020"
            opacity={0.9}
          />
        </React.Fragment>
      ))}
      <Line
        x1={100}
        y1={0}
        x2={95}
        y2={60}
        stroke="#ffe080"
        strokeWidth={8}
        opacity={0.04}
      />
    </Svg>
  );
}

function CaveIllustration() {
  const stalactiteXs = [15, 42, 68, 94, 120, 146, 172, 195];
  const stalagmiteXs = [25, 58, 90, 122, 155, 182];
  return (
    <Svg width="100%" height={72} viewBox="0 0 200 72">
      <Rect x={0} y={0} width={200} height={72} fill="#0a0818" opacity={0.9} />
      {stalactiteXs.map((x, i) => (
        <Polygon
          key={i}
          points={`${x - 6},0 ${x + 6},0 ${x},${15 + (i % 3) * 7}`}
          fill="#2a2040"
          opacity={0.9}
        />
      ))}
      {stalagmiteXs.map((x, i) => (
        <Polygon
          key={i}
          points={`${x - 5},72 ${x + 5},72 ${x},${72 - 10 - (i % 4) * 5}`}
          fill="#1e1830"
          opacity={0.8}
        />
      ))}
      <Rect x={0} y={56} width={200} height={16} fill="#160e28" opacity={0.9} />
      <Circle cx={60} cy={34} r={3} fill="#6040b0" opacity={0.4} />
      <Circle cx={140} cy={38} r={3} fill="#6040b0" opacity={0.35} />
    </Svg>
  );
}

function WaterIllustration() {
  const starXs = [20, 55, 88, 115, 152, 182];
  return (
    <Svg width="100%" height={72} viewBox="0 0 200 72">
      <Rect x={0} y={0} width={200} height={30} fill="#0a1828" opacity={0.8} />
      {starXs.map((x, i) => (
        <Circle
          key={i}
          cx={x}
          cy={7 + (i % 3) * 7}
          r={1.2}
          fill="#ffffff"
          opacity={0.5}
        />
      ))}
      <Circle cx={30} cy={16} r={9} fill="#d0d8f0" opacity={0.2} />
      <Circle cx={34} cy={13} r={7} fill="#0a1828" opacity={0.75} />
      <Path
        d="M0 30 Q25 25 50 30 Q75 35 100 30 Q125 25 150 30 Q175 35 200 30 L200 72 L0 72Z"
        fill="#0a2848"
        opacity={0.9}
      />
      <Path
        d="M0 40 Q25 35 50 40 Q75 45 100 40 Q125 35 150 40 Q175 45 200 40"
        fill="none"
        stroke="#1860a0"
        strokeWidth={1.5}
        opacity={0.5}
      />
      <Circle cx={55} cy={33} r={1.5} fill="#60c0ff" opacity={0.5} />
      <Circle cx={130} cy={35} r={1.5} fill="#60c0ff" opacity={0.4} />
      <Circle cx={175} cy={32} r={1.2} fill="#60c0ff" opacity={0.35} />
    </Svg>
  );
}

const ILLUSTRATIONS: Record<Area, () => JSX.Element> = {
  grass: () => <GrassIllustration />,
  forest: () => <ForestIllustration />,
  cave: () => <CaveIllustration />,
  water: () => <WaterIllustration />,
};

// ─── Area card ────────────────────────────────────────────────────────────────

function AreaCard({
  area,
  flavorText,
  onPress,
  isSelected,
}: {
  area: AreaConfig;
  flavorText?: string;
  onPress: () => void;
  isSelected: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const diffColor = DIFFICULTY_COLOR[area.difficulty];
  const IllustrationComponent = ILLUSTRATIONS[area.id];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.areaCard,
        {
          transform: [{ scale: pressed || isSelected ? 0.97 : 1 }],
          shadowColor: area.accent,
          shadowOpacity: isSelected ? 0.35 : 0.15,
          shadowRadius: isSelected ? 16 : 6,
          shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
          elevation: isSelected ? 12 : 4,
          borderColor: isSelected
            ? `${area.accent}60`
            : "rgba(255,255,255,0.07)",
        },
      ]}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={[area.bgTop, area.bgBottom]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: area.accent }]} />

      {/* Environment illustration */}
      <View style={styles.illustration}>
        <IllustrationComponent />
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        {/* Left: name + description + flavor */}
        <View style={styles.cardLeft}>
          <Text style={[styles.areaName, { color: area.accent }]}>
            {area.icon} {area.label}
          </Text>
          <Text style={styles.areaDesc}>{area.description}</Text>
          {flavorText ? (
            <Text style={[styles.flavorText, { color: area.accent }]}>
              {flavorText}
            </Text>
          ) : null}
        </View>

        {/* Right: difficulty + rate + hints */}
        <View style={styles.cardRight}>
          <View
            style={[
              styles.diffBadge,
              {
                backgroundColor: `${diffColor}18`,
                borderColor: `${diffColor}30`,
              },
            ]}
          >
            <Text style={[styles.diffBadgeText, { color: diffColor }]}>
              {DIFFICULTY_LABEL[area.difficulty]}
            </Text>
          </View>
          <Text style={[styles.encounterRate, { color: area.accent }]}>
            {area.encounterRate}
          </Text>
          <Text style={styles.encounterHint}>{area.encounterHint}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type Props = {
  region: Region;
  onSelect: (area: Area) => void;
  onBack: () => void;
};

export function AreaSelectScreen({ region, onSelect, onBack }: Props) {
  const [selected, setSelected] = useState<Area | null>(null);

  const [fontsLoaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
  });

  const flavorMap = REGION_FLAVOR[region] ?? {};

  const regionLabel = region === "gen1" ? "Kanto" : "Johto";
  const regionAccent = region === "gen1" ? "#e84040" : "#f0c040";

  function handleSelect(area: AreaConfig) {
    setSelected(area.id);
    setTimeout(() => onSelect(area.id), 300);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#080c18" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text
              style={[
                styles.backBtnText,
                fontsLoaded && { fontFamily: "PressStart2P" },
              ]}
            >
              ← Back
            </Text>
          </Pressable>
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          {/* Region pill */}
          <View
            style={[
              styles.regionPill,
              {
                backgroundColor: `${regionAccent}20`,
                borderColor: `${regionAccent}40`,
              },
            ]}
          >
            <Text
              style={[
                styles.regionPillText,
                { color: regionAccent },
                fontsLoaded && { fontFamily: "PressStart2P" },
              ]}
            >
              {regionLabel}
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              fontsLoaded && { fontFamily: "PressStart2P" },
            ]}
          >
            Choose Area
          </Text>
          <Text
            style={[
              styles.subtitle,
              fontsLoaded && { fontFamily: "Outfit-Light" },
            ]}
          >
            Each area has unique Pokémon encounters
          </Text>
        </View>

        {/* Area cards */}
        <View style={styles.list}>
          {AREAS.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              flavorText={flavorMap[area.id]}
              onPress={() => handleSelect(area)}
              isSelected={selected === area.id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#080c18",
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // Header
  headerRow: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  backBtnText: {
    fontSize: 7,
    color: "#6080a0",
    letterSpacing: 1,
  },

  // Title block
  titleBlock: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 14,
  },
  regionPill: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 11,
  },
  regionPillText: {
    fontSize: 6,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 26,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#5070a0",
  },

  // Area list
  list: {
    paddingHorizontal: 14,
    gap: 10,
  },
  areaCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
    marginBottom: 10,
  },

  // Left accent bar
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    zIndex: 1,
  },

  // Illustration
  illustration: {
    overflow: "hidden",
  },

  // Card body
  cardBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 14,
    gap: 10,
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
  },
  areaName: {
    fontSize: 10,
    lineHeight: 16,
    marginBottom: 4,
    fontFamily: "PressStart2P",
  },
  areaDesc: {
    fontSize: 11,
    color: "#b8cce0",
    opacity: 0.85,
    marginBottom: 5,
    lineHeight: 16,
    fontFamily: "Outfit-Light",
  },
  flavorText: {
    fontSize: 9,
    opacity: 0.55,
    fontStyle: "italic",
    fontFamily: "Outfit-Light",
  },

  // Right side
  cardRight: {
    alignItems: "flex-end",
    gap: 5,
    flexShrink: 0,
  },
  diffBadge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    borderWidth: 1,
  },
  diffBadgeText: {
    fontSize: 6,
    letterSpacing: 0.8,
    fontFamily: "PressStart2P",
  },
  encounterRate: {
    fontSize: 10,
    opacity: 0.6,
    fontFamily: "Outfit-Light",
  },
  encounterHint: {
    fontSize: 9,
    color: "#8090a8",
    textAlign: "right",
    maxWidth: 110,
    lineHeight: 14,
    fontFamily: "Outfit-Light",
  },
});
