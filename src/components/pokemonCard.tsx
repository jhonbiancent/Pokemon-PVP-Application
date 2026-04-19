import { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";
import { Pokemon } from "../types/pokemon";
import HpBar from "./hpBar";

type Props = {
  pokemon: Pokemon;
  isBack?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
};

export default function PokemonCard({
  pokemon,
  isBack,
  isAttacking,
  isHit,
}: Props) {
  const imageSource = isBack ? pokemon.backImage : pokemon.frontImage;

  // Animation values
  const moveAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAttacking) {
      // Move toward opponent (up for back/player, down for front/enemy)
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: isBack ? -50 : 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isAttacking]);

  useEffect(() => {
    if (isHit) {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 30,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -30,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isHit]);

  return (
    <View
      style={{
        alignItems: isBack ? "flex-start" : "flex-end", // Player on left, Enemy on right
        width: "100%",
        height: 180, // Fixed height to prevent shifting
        justifyContent: "center",
      }}
    >
      {/* Static Info Box */}
      <View
        style={{
          padding: 8,
          width: isBack ? "45%" : "55%",
          zIndex: 10,
          position: "absolute",
          top: isBack ? -20 : 0, // Moved higher for player (was 20)
          [isBack ? "right" : "left"]: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>
          {pokemon.name.toUpperCase()}
        </Text>
        <HpBar hp={pokemon.hp} maxHp={pokemon.maxHp} />
      </View>

      {/* Independent Animated Sprite */}
      <Animated.View
        style={{
          transform: [{ translateY: moveAnim }, { translateX: shakeAnim }],
          position: "absolute",
          bottom: 0,
          [isBack ? "left" : "right"]: isBack ? 0 : 20, // Moved player more to the left (was 20)
        }}
      >
        <Image
          source={{ uri: imageSource }}
          style={{
            width: isBack ? 220 : 180,
            height: isBack ? 220 : 180,
            resizeMode: "contain",
          }}
        />
      </Animated.View>
    </View>
  );
}
