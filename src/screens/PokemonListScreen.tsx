import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { usePokemonList } from "../hooks/usePokemonList";
import { colors } from "../theme/color";

const ALL_TYPES = [
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
];

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

export default function PokemonListScreen({ navigation }: any) {
  const { user } = useAuth();
  const { pokemon, loading } = usePokemonList(user?.id ?? "");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = useMemo(() => {
    return pokemon.filter((p) => {
      const matchesSearch = p.pk_name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = selectedType
        ? p.pk_types?.includes(selectedType)
        : true;
      return matchesSearch && matchesType;
    });
  }, [pokemon, search, selectedType]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Search Bar + Filter Dropdown */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokémon..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType && { borderColor: TYPE_COLORS[selectedType] },
          ]}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType && { color: TYPE_COLORS[selectedType] },
            ]}
          >
            {selectedType ?? "Type"} ▾
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      {dropdownOpen && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedType(null);
                setDropdownOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  !selectedType && { color: colors.accent, fontWeight: "bold" },
                ]}
              >
                All Types
              </Text>
            </TouchableOpacity>
            {ALL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedType(type);
                  setDropdownOpen(false);
                }}
              >
                <View
                  style={[
                    styles.typeColorDot,
                    { backgroundColor: TYPE_COLORS[type] },
                  ]}
                />
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedType === type && {
                      color: TYPE_COLORS[type],
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Count */}
      <Text style={styles.countText}>{filtered.length} Pokémon</Text>

      {/* List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No Pokémon found</Text>
          <Text style={styles.emptySubtitle}>
            Try a different search or filter
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.typeBadges}>
                {item.pk_types?.map((t: string) => (
                  <View
                    key={t}
                    style={[
                      styles.badge,
                      { backgroundColor: (TYPE_COLORS[t] ?? "#888") + "33" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: TYPE_COLORS[t] ?? "#888" },
                      ]}
                    >
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
              <Image
                source={{ uri: item.pk_front_image }}
                style={styles.sprite}
                resizeMode="contain"
              />
              <Text style={styles.pokeName}>{item.pk_name}</Text>
              <Text style={styles.pokeLevel}>Lv. {item.pk_level}</Text>
            </View>
          )}
        />
      )}

      {/* Add Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("SelectPokemon", { team: pokemon })
          }
        >
          <Text style={styles.addButtonText}>+ Add Pokémon</Text>
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
    backgroundColor: colors.bg,
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 15,
  },
  filterButton: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  filterButtonText: {
    color: colors.textMuted,
    fontSize: 13,
    textTransform: "capitalize",
  },

  dropdown: {
    marginHorizontal: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 8,
    zIndex: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    color: colors.textPrimary,
    fontSize: 14,
    textTransform: "capitalize",
  },
  typeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  countText: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    color: colors.textMuted,
    fontSize: 12,
  },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: colors.textPrimary },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },

  card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: "center",
  },
  typeBadges: {
    flexDirection: "row",
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: "bold", textTransform: "uppercase" },
  sprite: { width: 90, height: 90 },
  pokeName: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
    marginTop: 4,
  },
  pokeLevel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },

  bottomContainer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
