import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/color";

const clickSound = require("../../assets/sounds/buttonClick.mp3");

export default function BattleButton({
  label,
  subLabel,
  onPress,
  disabled,
  color = "white",
  width = "48%",
  height = "46%",
}: any) {
  const player = useAudioPlayer(clickSound);
  player.volume = 1.0;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    player.play();
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={{
        width: width,
        height: height,
        margin: "1%",
        backgroundColor: disabled ? "#030712" : colors.bgButtonSecondary,
        borderWidth: 1,
        borderColor: colors.border,
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
