import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import BattleScreen from "@/src/screens/BattleScreen";
import DashboardScreen from "@/src/screens/DashboardScreen";
import LoginScreen from "@/src/screens/LoginScreen";
import PokemonListScreen from "@/src/screens/PokemonListScreen";
import PokemonStatsScreen from "@/src/screens/PokemonStatsScreen";
import PokemonTeamScreen from "@/src/screens/PokemonTeamScreen";
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
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: "",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="Signup"
            options={{
              title: "",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
            component={SignupScreen}
          />
        </>
      ) : (
        // App Flow
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: "",
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
              title: "BATTLE",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          />
          <Stack.Screen
            name="PokemonList"
            options={{
              title: "My Pokemon",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
            component={PokemonListScreen}
          />
          <Stack.Screen
            name="PokemonStats"
            options={{
              title: "Pokemon Stats",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
            component={PokemonStatsScreen}
          />
          <Stack.Screen
            name="PokemonTeam"
            options={{
              title: "Manage Team",
              headerStyle: { backgroundColor: "#111827" },
              headerTintColor: "#F9FAFB",
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
            component={PokemonTeamScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
