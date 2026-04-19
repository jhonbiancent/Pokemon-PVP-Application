import { Text, TouchableOpacity } from "react-native";

export default function BattleButton({
  label,
  subLabel,
  onPress,
  disabled,
  color = "white",
  width = "48%",
  height = "46%",
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: width,
        height: height,
        margin: "1%",
        backgroundColor: disabled ? "#030712" : "#0A0D2E",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 14,
          color: "white",
        }}
      >
        {label.toUpperCase()}
      </Text>
      {subLabel && (
        <Text style={{ fontSize: 10, color: "white", marginTop: 2 }}>
          {subLabel}
        </Text>
      )}
    </TouchableOpacity>
  );
}
