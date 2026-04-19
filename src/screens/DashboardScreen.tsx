import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../hooks/useTeam";

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();

  const { team, loading } = useTeam(user?.id ?? "");

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {/* Trainer Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{user?.name ?? "Trainer"} 👋</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🏅 Trainer</Text>
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{team.length}/6</Text>
          <Text style={styles.statLabel}>Team Size</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {team.length > 0 ? Math.max(...team.map((p) => p.level)) : 0}
          </Text>
          <Text style={styles.statLabel}>Highest Level</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {[...new Set(team.flatMap((p) => p.type))].length}
          </Text>
          <Text style={styles.statLabel}>Types</Text>
        </View>
      </View>

      {/* My Pokémon Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Pokémon</Text>
        {team.length < 6 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("SelectPokemon", { team })}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {team.length === 0 ? (
        // Empty state
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎮</Text>
          <Text style={styles.emptyTitle}>No Pokémon yet!</Text>
          <Text style={styles.emptySubtitle}>
            Start building your team by adding your first Pokémon.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("SelectPokemon", { team })}
          >
            <Text style={styles.emptyButtonText}>Add your first Pokémon</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={team}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 10, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.frontImage }} style={styles.sprite} />
              <Text style={styles.pokeName}>{item.name}</Text>
              <Text style={styles.pokeType}>{item.type.join(" / ")}</Text>
              <Text style={styles.pokeLevel}>Lv. {item.level}</Text>
              <Text style={styles.pokeHp}>
                HP: {item.hp}/{item.maxHp}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: "#aaa" },
  username: { fontSize: 22, fontWeight: "bold", color: "white" },
  badge: {
    backgroundColor: "#2a2a4e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: "#fff", fontSize: 13 },

  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#16213e",
    paddingVertical: 16,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "white" },
  statLabel: { fontSize: 12, color: "#aaa" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1a1a2e" },
  addButton: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: { color: "white", fontWeight: "bold" },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: { color: "white", fontWeight: "bold", fontSize: 15 },

  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
  },
  sprite: { width: 80, height: 80 },
  pokeName: { fontSize: 16, fontWeight: "bold", textTransform: "capitalize" },
  pokeType: { fontSize: 12, color: "gray" },
  pokeLevel: { fontSize: 13, color: "#555" },
  pokeHp: { fontSize: 13, color: "#e53935" },
});
