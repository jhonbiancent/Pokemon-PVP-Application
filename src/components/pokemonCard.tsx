import { Image, Text, View } from "react-native";
import HpBar from "./hpBar";

export default function PokemonCard({ pokemon }: any) {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <Text>
        {pokemon.name} Lv{pokemon.level}
      </Text>

      <Image
        source={{ uri: pokemon.image }}
        style={{
          width: 80,
          height: 80,
        }}
      />

      <HpBar hp={pokemon.hp} maxHp={pokemon.maxHp} />
    </View>
  );
}
