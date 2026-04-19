import { useState } from "react";
import {
    ActivityIndicator,
    Button,
    Image,
    Text,
    TextInput,
    View,
} from "react-native";

import { getPokemon } from "../hooks/usePokemon";

export default function SelectPokemonScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState<any>(null);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const result = await getPokemon(search, 12);
      setPokemon(result);
    } catch (e) {
      alert("Pokemon not found");
    } finally {
      setLoading(false);
    }
  };

  const startBattle = async () => {
    const enemy = await getPokemon("charmander", 12);

    navigation.navigate("Battle", {
      player: pokemon,
      enemy,
    });
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text>Choose your Pokemon</Text>

      <TextInput
        placeholder="Enter pokemon name"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator />}

      {pokemon && (
        <View style={{ marginTop: 20 }}>
          <Text>{pokemon.name}</Text>

          <Image
            source={{ uri: pokemon.frontImage }}
            style={{ width: 100, height: 100 }}
          />

          <Button title="Start Battle" onPress={startBattle} />
        </View>
      )}
    </View>
  );
}
