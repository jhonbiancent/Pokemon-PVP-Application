import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function SignupScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !name || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Map username to a placeholder email for Supabase Auth
      const email = `${username.toLowerCase()}@pokemon.app`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            username: username.toLowerCase(),
          },
        },
      });

      if (error) throw error;

      // Also insert into public.users table as per user schema
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: data.user?.id,
          username: username.toLowerCase(),
          name,
          password, // Storing plaintext as per schema (NOT RECOMMENDED, but following provided schema)
        },
      ]);

      if (dbError) throw dbError;

      alert("Signup successful! Please log in.");
      navigation.navigate("Login");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "blue", textAlign: "center" }}>
          Already have an account? Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});
