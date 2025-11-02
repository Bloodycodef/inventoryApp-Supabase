import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // bisa email atau username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter your email/username and password");
      return;
    }

    try {
      setLoading(true);

      let emailToUse = identifier.trim().toLowerCase();

      // 🔍 Jika input bukan email, cari email berdasarkan username dari tabel app_users
      if (!identifier.includes("@")) {
        const { data: userData, error: userError } = await supabase
          .from("app_users")
          .select("email")
          .eq("username", identifier.trim())
          .maybeSingle();

        if (userError) throw userError;
        if (!userData?.email) {
          throw new Error("Username not found. Please check your username.");
        }

        emailToUse = userData.email.toLowerCase();
      }

      // 🔐 Login langsung ke Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Incorrect email/username or password.");
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error("Login failed, please try again.");
      }

      Alert.alert("Success", "Login successful!");
      router.replace("/(tabs)/HomePage");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Email or Username"
        value={identifier}
        onChangeText={setIdentifier}
        style={styles.input}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#999"
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => router.replace("/auth/register")}
      >
        <Text style={styles.linkText}>
          Don’t have an account?{" "}
          <Text style={styles.linkHighlight}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
