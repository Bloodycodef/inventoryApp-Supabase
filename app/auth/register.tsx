// app/auth/register.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { AuthHeader } from "../../components/Auth/authHeader";
import { Button } from "../../components/shared/button";
import { Container } from "../../components/shared/container";
import { Input } from "../../components/shared/input";
import { Link } from "../../components/shared/link";
import { useAuth } from "../../hook/auth/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading } = useAuth();

  const validateForm = () => {
    if (!email || !password || !username || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const { user, error } = await register({ email, password, username });

    if (error) {
      Alert.alert("Error", error);
      return;
    }

    Alert.alert(
      "Success",
      "Account created successfully! Please verify your email."
    );
    router.replace("/auth/login");
  };

  return (
    <Container>
      <AuthHeader
        title="Create Account"
        subtitle="Join us and start your journey!"
      />

      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        title="Register"
        onPress={handleRegister}
        loading={loading}
        disabled={!email || !password || !username || !confirmPassword}
      />

      <Link
        text="Already have an account? Login"
        highlightText="Login"
        onPress={() => router.replace("/auth/login")}
      />
    </Container>
  );
}
