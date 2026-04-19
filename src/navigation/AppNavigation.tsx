import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BattleScreen from "../screens/BattleScreen";
import SelectPokemonScreen from "../screens/SelectPokemonScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Select" component={SelectPokemonScreen} />
        <Stack.Screen name="Battle" component={BattleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
