// app/auth/forgot-password.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { AuthHeader } from "../../components/Auth/authHeader";
import { Button } from "../../components/shared/button";
import { Container } from "../../components/shared/container";
import { Input } from "../../components/shared/input";
import { Link } from "../../components/shared/link";
import { authService } from "../../services/auth/authService";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email);
      Alert.alert(
        "Success",
        "Password reset email sent! Please check your inbox."
      );
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AuthHeader
        title="Reset Password"
        subtitle="Enter your email to receive reset instructions"
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        title="Send Reset Email"
        onPress={handleResetPassword}
        loading={loading}
        disabled={!email}
      />

      <Link
        text="Back to Login"
        onPress={() => router.replace("/auth/login")}
      />
    </Container>
  );
}
