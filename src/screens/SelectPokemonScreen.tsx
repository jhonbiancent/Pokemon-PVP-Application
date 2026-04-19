import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { savePokemon } from "../hooks/savePokemon";
import { getPokemon } from "../hooks/usePokemon";

export default function SelectPokemonScreen({ navigation, route }: any) {
  const { team } = route.params; // current team passed from Dashboard
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pokemon, setPokemon] = useState<any>(null);

  const { user } = useAuth();
  const handleSearch = async () => {
    try {
      setLoading(true);
      const result = await getPokemon(search.toLowerCase().trim(), 12);
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
      await savePokemon(pokemon, user.id); // 👈 user from useAuth(), not supabase
      Alert.alert("Added!", `${pokemon.name} was added to your team.`, [
        { text: "OK", onPress: () => navigation.navigate("Dashboard") },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save Pokémon. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Add Pokémon to Team ({team.length}/6)
      </Text>

      <TextInput
        placeholder="Enter pokemon name"
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Search" onPress={handleSearch} />
      {loading && <ActivityIndicator />}

      {pokemon && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 18, textTransform: "capitalize" }}>
            {pokemon.name}
          </Text>
          <Text style={{ color: "gray" }}>Type: {pokemon.type.join(", ")}</Text>
          <Image
            source={{ uri: pokemon.frontImage }}
            style={{ width: 100, height: 100 }}
          />

          {team.length < 6 ? (
            <Button
              title={saving ? "Adding..." : "Add to Team"}
              onPress={handleAddToTeam}
              disabled={saving}
            />
          ) : (
            <Text style={{ color: "red", marginTop: 10 }}>Team is full!</Text>
          )}
        </View>
      )}
    </View>
  );
}
