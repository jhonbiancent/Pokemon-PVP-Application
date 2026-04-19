import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

import BattleScreen from "@/src/screens/BattleScreen";
import SelectPokemonScreen from "@/src/screens/SelectPokemonScreen";
import LoginScreen from "@/src/screens/LoginScreen";
import SignupScreen from "@/src/screens/SignupScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!user ? (
        // Auth Flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        // App Flow
        <>
          <Stack.Screen name="Select" component={SelectPokemonScreen} />
          <Stack.Screen name="Battle" component={BattleScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
