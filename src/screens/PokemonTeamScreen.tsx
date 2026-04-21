import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { colors } from "../theme/color";
import { supabase } from "../lib/supabase";
import StatusModal from "../components/statusModal";
import { Pokemon } from "../types/pokemon";

const clickSound = require("../../assets/sounds/buttonClick.mp3");

const TYPE_COLORS: Record<string, string> = {
  fire: "#FF6B35",
  water: "#4FC3F7",
  grass: "#66BB6A",
  electric: "#FFD54F",
  psychic: "#F48FB1",
  ice: "#80DEEA",
  dragon: "#7986CB",
  dark: "#616161",
  fairy: "#F06292",
  normal: "#BDBDBD",
  fighting: "#EF5350",
  flying: "#90CAF9",
  poison: "#AB47BC",
  ground: "#D4A574",
  rock: "#8D6E63",
  bug: "#AED581",
  ghost: "#7E57C2",
  steel: "#78909C",
};

export default function PokemonTeamScreen({ route, navigation }: any) {
  const { initialTeam } = route.params;
  const [team, setTeam] = useState<Pokemon[]>(initialTeam);
  const [isSaving, setIsSaving] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  const player = useAudioPlayer(clickSound);
  player.volume = 1.0;

  const playClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    player.play();
  };

  const swap = (index1: number, index2: number) => {
    playClick();
    const newTeam = [...team];
    const temp = newTeam[index1];
    newTeam[index1] = newTeam[index2];
    newTeam[index2] = temp;
    setTeam(newTeam);
  };

  const handleSave = async () => {
    playClick();
    setIsSaving(true);

    try {
      // Execute updates in parallel for each pokemon to update its order
      const updatePromises = team.map((p, index) =>
        supabase
          .from("pokemon")
          .update({ pk_order: index })
          .eq("id", p.id)
      );

      const results = await Promise.all(updatePromises);
      
      // Check if any of the updates failed
      const firstError = results.find((r) => r.error)?.error;
      if (firstError) throw firstError;

      setStatusMessage("Team order saved successfully!");
      setStatusType("success");
      setStatusVisible(true);
    } catch (error: any) {
      setStatusMessage(error.message);
      setStatusType("error");
      setStatusVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = ({ item, index }: { item: Pokemon; index: number }) => {
    const primaryType = item.type[0];
    const accentColor = TYPE_COLORS[primaryType] ?? "#888";

    return (
      <View style={[styles.card, { borderColor: accentColor + "55" }]}>
        <View style={[styles.orderBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.orderBadgeText}>#{index + 1}</Text>
        </View>

        <Image
          source={{ uri: item.frontImage }}
          style={styles.sprite}
          resizeMode="contain"
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.level}>Lv. {item.level}</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            disabled={index === 0}
            onPress={() => swap(index, index - 1)}
            style={[styles.arrowButton, index === 0 && styles.disabledArrow]}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={index === team.length - 1}
            onPress={() => swap(index, index + 1)}
            style={[styles.arrowButton, index === team.length - 1 && styles.disabledArrow]}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>
        
        {index === 0 && (
          <View style={styles.battleTag}>
            <Text style={styles.battleTagText}>STARTER</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.infoText}>
          The #1 Pokémon will be your first in battle. Use the arrows to reorder your team.
        </Text>
      </View>

      <FlatList
        data={team}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Team Order</Text>
          )}
        </TouchableOpacity>
      </View>

      <StatusModal
        visible={statusVisible}
        message={statusMessage}
        type={statusType}
        onClose={() => {
          setStatusVisible(false);
          if (statusType === "success") {
            navigation.goBack();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerInfo: {
    padding: 16,
    backgroundColor: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  infoText: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  orderBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 12,
    zIndex: 10,
  },
  orderBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  sprite: {
    width: 80,
    height: 80,
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
    marginTop: 4,
  },
  level: {
    color: "#6B7280",
    fontSize: 11,
    marginBottom: 10,
  },
  controls: {
    flexDirection: "row",
    gap: 12,
    marginTop: 5,
  },
  arrowButton: {
    backgroundColor: "#1F2937",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  arrowText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  disabledArrow: {
    opacity: 0.2,
  },
  battleTag: {
    marginTop: 10,
    backgroundColor: "#818CF833",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#818CF855",
  },
  battleTagText: {
    color: "#818CF8",
    fontSize: 9,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    backgroundColor: "#030712",
  },
  saveButton: {
    backgroundColor: "#818CF8",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
