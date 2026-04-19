import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import BattleScreen from "@/src/screens/BattleScreen";
import DashboardScreen from "@/src/screens/DashboardScreen";
import LoginScreen from "@/src/screens/LoginScreen";
import SelectPokemonScreen from "@/src/screens/SelectPokemonScreen";
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
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: "DASHBOARD",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen name="SelectPokemon" component={SelectPokemonScreen} />
          <Stack.Screen
            name="Battle"
            component={BattleScreen}
            options={{
              title: "DASHBOARD",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
