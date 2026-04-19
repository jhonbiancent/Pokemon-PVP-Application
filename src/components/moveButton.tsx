import { Text, TouchableOpacity } from "react-native";

export default function MoveButton({ move, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        padding: 12,
        margin: 4,
        backgroundColor: "#eee",
        borderRadius: 8,
      }}
    >
      <Text>{move.name}</Text>
    </TouchableOpacity>
  );
}
