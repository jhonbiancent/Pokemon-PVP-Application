import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BattleScreen from "@/src/screens/BattleScreen";
import SelectPokemonScreen from "@/src/screens/SelectPokemonScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Select" component={SelectPokemonScreen} />
      <Stack.Screen name="Battle" component={BattleScreen} />
    </Stack.Navigator>
  );
}
