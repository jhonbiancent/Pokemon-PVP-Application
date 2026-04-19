import { Text, TouchableOpacity } from "react-native";

export default function MoveButton({ move, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: "48%", // Grid of 2
        height: "46%", // Grid of 2 (with small gap)
        margin: "1%",
        backgroundColor: disabled ? "#ccc" : "#eee",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#999",
      }}
    >
      <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 14 }}>
        {move.name.toUpperCase()}
      </Text>
      <Text style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
        Power: {move.power}
      </Text>
    </TouchableOpacity>
  );
}
