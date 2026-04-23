import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../theme/color";

const clickSound = require("../../assets/sounds/buttonClick.mp3");

export default function InventoryBagScreen({ navigation }: any) {
  const player = useAudioPlayer(clickSound);
  player.volume = 1.0;

  const playClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    player.play();
  };

  // placeholder empty list for now
  const items: any[] = [];

  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bag</Text>
        <Text style={styles.subtitle}>Choose an item</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={items}
        keyExtractor={(_, i) => i.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedItem === item && styles.cardSelected]}
            onPress={() => {
              playClick();
              setSelectedItem(item);
            }}
          >
            {/* icon placeholder */}
            <View style={styles.iconPlaceholder} />

            <Text style={styles.itemName}>Poké Ball</Text>

            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x0</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎒</Text>
            <Text style={styles.emptyTitle}>No Items</Text>
            <Text style={styles.emptySubtitle}>
              Your bag is currently empty
            </Text>
          </View>
        }
      />

      {/* Bottom Info Panel */}
      <View style={styles.bottomPanel}>
        {selectedItem ? (
          <>
            <Text style={styles.itemTitle}>Poké Ball</Text>
            <Text style={styles.itemDesc}>
              A device for catching wild Pokémon.
            </Text>

            <TouchableOpacity
              style={styles.useButton}
              onPress={() => {
                playClick();
              }}
            >
              <Text style={styles.useButtonText}>Use Item</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.selectHint}>Select an item to view details</Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            playClick();
            navigation.goBack();
          }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },

  card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },

  cardSelected: {
    borderColor: colors.accent,
  },

  iconPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.border,
    marginBottom: 8,
  },

  itemName: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },

  qtyBadge: {
    marginTop: 6,
    backgroundColor: colors.accent + "33",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  qtyText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "bold",
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },

  emptySubtitle: {
    color: colors.textMuted,
    marginTop: 4,
  },

  bottomPanel: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    paddingBottom: 30,
    backgroundColor: colors.bg,
  },

  itemTitle: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },

  itemDesc: {
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },

  useButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  useButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  selectHint: {
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 10,
  },

  backButton: {
    paddingVertical: 10,
    alignItems: "center",
  },

  backText: {
    color: colors.textMuted,
    fontWeight: "bold",
  },
});
