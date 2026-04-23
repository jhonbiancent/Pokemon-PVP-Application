import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { savePokemon } from "../hooks/savePokemon";
import { getPokemon } from "../hooks/usePokemon";
import { SelectPokemonScreenProps } from "../types/navigation";

export default function SelectPokemonScreen({
  navigation,
  route,
}: SelectPokemonScreenProps) {
  const { team } = route.params;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pokemon, setPokemon] = useState<any>(null);

  const { user } = useAuth();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const result = await getPokemon(search.toLowerCase().trim(), 100);
      setPokemon(result);
    } catch (e) {
      Alert.alert(
        "Not found",
        "Pokémon not found. Check the name and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTeam = async () => {
    if (team.length >= 6) {
      Alert.alert("Team Full", "You can only have 6 Pokémon in your team.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    try {
      setSaving(true);
      await savePokemon(pokemon, user.id);

      Alert.alert("Added!", `${pokemon.name} was added to your team.`, [
        { text: "OK", onPress: () => navigation.navigate("Dashboard") },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not save Pokémon. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const teamFull = team.length >= 6;

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#0f172a",
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "white",
          marginBottom: 4,
        }}
      >
        Add Pokémon
      </Text>

      <Text
        style={{
          color: "#94a3b8",
          marginBottom: 16,
        }}
      >
        Team: {team.length}/6
      </Text>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <TextInput
          placeholder="Search Pokémon..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            backgroundColor: "#1e293b",
            color: "white",
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#334155",
          }}
        />

        <TouchableOpacity
          onPress={handleSearch}
          style={{
            backgroundColor: "#22c55e",
            paddingHorizontal: 16,
            justifyContent: "center",
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#22c55e"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Pokemon Card */}
      {pokemon && !loading && (
        <View
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 20,
            padding: 20,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Image
            source={{ uri: pokemon.frontImage }}
            style={{
              width: 140,
              height: 140,
              marginBottom: 10,
            }}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              textTransform: "capitalize",
            }}
          >
            {pokemon.name}
          </Text>

          <Text
            style={{
              color: "#94a3b8",
              marginBottom: 16,
              textTransform: "capitalize",
            }}
          >
            {pokemon.type.join(" • ")}
          </Text>

          <TouchableOpacity
            onPress={handleAddToTeam}
            disabled={teamFull || saving}
            style={{
              backgroundColor: teamFull ? "#475569" : "#22c55e",
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 12,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {teamFull ? "Team Full" : saving ? "Adding..." : "Add to Team"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
