import { Text, View } from "react-native";

type Props = {
  hp: number;
  maxHp: number;
};

export default function HpBar({ hp, maxHp }: Props) {
  const percent = (hp / maxHp) * 100;

  return (
    <View style={{ marginVertical: 5 }}>
      <View
        style={{
          height: 10,
          backgroundColor: "#ccc",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor:
              percent > 50 ? "green" : percent > 20 ? "orange" : "red",
          }}
        />
      </View>

      <Text>
        {hp} / {maxHp}
      </Text>
    </View>
  );
}
