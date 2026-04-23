import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../theme/color";

const clickSound = require("../../assets/sounds/buttonClick.mp3");

type BagCategory = "pokeballs" | "items" | "battle" | "key";

type BagItem = {
  id: string;
  name: string;
  description: string;
  catchRate: number;
  color: string;
};

const POKEBALL_ITEMS: BagItem[] = [
  {
    id: "poke-ball",
    name: "Poké Ball",
    description: "A standard Poké Ball",
    catchRate: 1,
    color: "#EF5350",
  },
  {
    id: "great-ball",
    name: "Great Ball",
    description: "Better catch rate than Poké Ball",
    catchRate: 1.5,
    color: "#42A5F5",
  },
  {
    id: "ultra-ball",
    name: "Ultra Ball",
    description: "High performance ball",
    catchRate: 2,
    color: "#212121",
  },
  {
    id: "master-ball",
    name: "Master Ball",
    description: "Catches without fail",
    catchRate: 255,
    color: "#AB47BC",
  },
];

const TABS: { key: BagCategory; label: string }[] = [
  { key: "pokeballs", label: "Poké Balls" },
  { key: "items", label: "Items" },
  { key: "battle", label: "Battle" },
  { key: "key", label: "Key" },
];

export default function InventoryBagScreen({ navigation }: any) {
  const [category, setCategory] = useState<BagCategory>("pokeballs");

  const player = useAudioPlayer(clickSound);
  player.volume = 1.0;

  const playClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    player.play();
  };

  const data = useMemo(() => {
    if (category === "pokeballs") return POKEBALL_ITEMS;
    return [];
  }, [category]);

  const handleUseItem = (item: BagItem) => {
    playClick();

    // return to battle screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              category === tab.key && styles.tabButtonActive,
            ]}
            onPress={() => {
              playClick();
              setCategory(tab.key);
            }}
          >
            <Text
              style={[
                styles.tabText,
                category === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleUseItem(item)}
          >
            <View
              style={[styles.ballIndicator, { backgroundColor: item.color }]}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>

              <Text style={styles.catchPreview}>
                Catch Chance: {formatCatchRate(item.catchRate)}
              </Text>
            </View>

            <Text style={styles.useText}>USE</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function formatCatchRate(rate: number) {
  if (rate === 255) return "Guaranteed";
  if (rate >= 2) return "Very High";
  if (rate >= 1.5) return "High";
  return "Normal";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  tabRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },

  tabButton: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  tabButtonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + "22",
  },

  tabText: {
    color: colors.textMuted,
    fontWeight: "bold",
    fontSize: 12,
  },

  tabTextActive: {
    color: colors.accent,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },

  ballIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  itemName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },

  itemDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  catchPreview: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "bold",
  },

  useText: {
    color: colors.accent,
    fontWeight: "bold",
    fontSize: 12,
  },
});
