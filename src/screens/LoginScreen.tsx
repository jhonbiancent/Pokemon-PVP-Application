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
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">(
    "info",
  );

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setModalMessage("Please enter username and password");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      const normalizedUsername = username.trim().toLowerCase();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", normalizedUsername)
        .eq("password", password)
        .maybeSingle();

      if (error || !data) {
        setModalMessage("Invalid username or password");
        setModalType("error");
        setModalVisible(true);
        return;
      }

      login({
        id: data.id,
        username: data.username,
        name: data.name,
      });

      setModalMessage("Login successful!");
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
      <Text style={styles.title}>Login to Pokemon PVP</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
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
        <Button title="Log In" onPress={handleLogin} />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "blue", textAlign: "center" }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>

      <StatusModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => {
          setModalVisible(false);

          if (modalType === "success") {
            navigation.replace("Dashboard");
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
    backgroundColor: "#030712",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: "white",
  },
});
