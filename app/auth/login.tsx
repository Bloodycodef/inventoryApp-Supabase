// app/auth/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { AuthHeader } from "../../components/Auth/authHeader";
import { Button } from "../../components/shared/button";
import { Container } from "../../components/shared/container";
import { Input } from "../../components/shared/input";
import { Link } from "../../components/shared/link";
import { useAuth } from "../../hook/auth/useAuth";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter your email/username and password");
      return;
    }

    const { user, error } = await login({ identifier, password });

    if (error) {
      Alert.alert("Error", error);
      return;
    }

    Alert.alert("Success", "Login successful!");
    router.replace("/(tabs)/HomePage");
  };

  return (
    <Container>
      <AuthHeader title="Welcome Back" subtitle="Login to continue" />

      <Input
        placeholder="Email or Username"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        disabled={!identifier || !password}
      />

      <Link
        text="Don't have an account? Register"
        highlightText="Register"
        onPress={() => router.replace("/auth/register")}
      />

      <Link
        text="Forgot password?"
        align="center"
        onPress={() => router.push("/auth/forgotPassword")}
      />
    </Container>
  );
}
