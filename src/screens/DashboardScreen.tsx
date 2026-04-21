import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PokemonCard from "../components/pokemonRosterCard";
import { useAuth } from "../context/AuthContext";
import { getPokemon } from "../hooks/usePokemon";
import { useTeam } from "../hooks/useTeam";
import { colors } from "../theme/color";
import { DashboardScreenProps } from "../types/navigation";

const clickSound = require("../../assets/sounds/buttonClick.mp3");

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user, signOut } = useAuth();
  const { team, loading, refetch } = useTeam(user?.id ?? "");

  const player = useAudioPlayer(clickSound);
  player.volume = 1.0;

  const playClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    player.play();
  };

  const handleBattle = async () => {
    playClick();
    if (team.length === 0) {
      Alert.alert("No Pokémon", "Add a Pokémon to your team first!");
      return;
    }

    try {
      // The first pokemon in the sorted list is our starter
      const playerPokemon = team[0];
      const enemy = await getPokemon("Blastoise", 40);
      navigation.navigate("Battle", {
        player: playerPokemon,
        enemy,
      });
    } catch (e) {
      Alert.alert("Error", "Could not load battle. Try again.");
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#818CF8" size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{user?.name ?? "Trainer"} 👋</Text>
        </View>

        <View style={styles.trainerBadge}>
          <Text style={styles.trainerBadgeText}>🏅 Trainer</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            playClick();
            signOut();
            navigation.replace("Login");
          }}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{team.length}/6</Text>
          <Text style={styles.statLabel}>Team Size</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {team.length > 0 ? Math.max(...team.map((p) => p.level)) : 0}
          </Text>
          <Text style={styles.statLabel}>Highest Lv.</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {[...new Set(team.flatMap((p) => p.type))].length}
          </Text>
          <Text style={styles.statLabel}>Types</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pokémon Team</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              playClick();
              refetch();
            }}
          >
            <Text style={styles.refreshButtonText}>↻</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.configureButton}
            onPress={() => {
              playClick();
              navigation.navigate("PokemonTeam", {
                initialTeam: team,
                onSave: refetch,
              });
            }}
          >
            <Text style={styles.configureButtonText}>Configure</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              playClick();
              navigation.navigate("PokemonList");
            }}
          >
            <Text style={styles.addButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {team.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>⚡</Text>
          <Text style={styles.emptyTitle}>No Pokémon yet!</Text>
          <Text style={styles.emptySubtitle}>
            Start building your team by adding your first Pokémon.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => {
              playClick();
              navigation.navigate("SelectPokemon", { team });
            }}
          >
            <Text style={styles.emptyButtonText}>Add your first Pokémon</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={team}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 12, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => {
                playClick();
                navigation.navigate("PokemonStats", { pokemon: item });
              }}
            />
          )}
        />
      )}
      <View style={styles.battleContainer}>
        <TouchableOpacity
          style={[
            styles.battleButton,
            team.length === 0 && styles.battleButtonDisabled,
          ]}
          onPress={handleBattle}
          disabled={team.length === 0}
        >
          <Text style={styles.battleButtonText}>Battle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.exploreButton,
            team.length === 0 && styles.battleButtonDisabled,
          ]}
          onPress={() => {
            playClick();
            handleBattle();
          }}
          disabled={team.length === 0}
        >
          <Text style={styles.battleButtonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030712",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    backgroundColor: "#030712",
  },
  greeting: { fontSize: 13, color: "#6B7280", letterSpacing: 0.5 },
  username: { fontSize: 24, fontWeight: "800", color: "#F9FAFB" },
  trainerBadge: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trainerBadgeText: { color: "#D1D5DB", fontSize: 13 },

  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#111827",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#818CF8" },
  statLabel: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "#1F2937" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#F9FAFB" },
  addButton: {
    backgroundColor: colors.bgButton,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
  configureButton: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  configureButtonText: { color: "#818CF8", fontWeight: "bold", fontSize: 13 },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#818CF8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  refreshButton: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshButtonText: { color: "#9CA3AF", fontWeight: "bold", fontSize: 16 },
  battleContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#030712",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    flexDirection: "row",
    gap: 10,
  },
  battleButton: {
    flex: 1,
    backgroundColor: "#0A0D2E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  battleButtonDisabled: {
    backgroundColor: "#374151",
  },
  battleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  exploreButton: {
    flex: 1,
    backgroundColor: "#0A0D2E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutButtonText: { color: "#EF4444", fontWeight: "bold", fontSize: 16 },
});
