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
import StatusModal from "../components/statusModal";
import { supabase } from "../lib/supabase";

export default function SignupScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">(
    "info",
  );

  const handleSignup = async () => {
    if (!username || !name || !password) {
      setModalMessage("Please fill all fields");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      // check if username already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("username")
        .eq("username", username.toLowerCase())
        .single();

      if (existingUser) {
        setModalMessage("Username already taken");
        setModalType("error");
        setModalVisible(true);
        return;
      }

      // insert directly to public.users
      const { error } = await supabase.from("users").insert([
        {
          username: username.toLowerCase(),
          name,
          password,
        },
      ]);

      if (error) throw error;

      setModalMessage("Signup successful! Please log in.");
      setModalType("success");
      setModalVisible(true);
    } catch (error: any) {
      setModalMessage(error.message);
      setModalType("error");
      setModalVisible(true);
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

      <StatusModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => {
          setModalVisible(false);

          if (modalType === "success") {
            navigation.navigate("Login");
          }
        }}
      />
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
