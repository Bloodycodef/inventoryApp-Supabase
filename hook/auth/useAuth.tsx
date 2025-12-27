// app/auth/hooks/useAuth.ts
import { useState } from "react";
import { Alert } from "react-native";
import {
  authService,
  LoginCredentials,
  RegisterCredentials,
} from "../../services/auth/authService";
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const user = await authService.login(credentials);
      return { user, error: null };
    } catch (error: any) {
      console.error("Login error:", error);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const user = await authService.register(credentials);
      return { user, error: null };
    } catch (error: any) {
      console.error("Register error:", error);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      return { error: null };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { error: error.message };
    }
  };

  const handleError = (error: string) => {
    Alert.alert("Error", error || "An unexpected error occurred.");
  };

  const handleSuccess = (message: string) => {
    Alert.alert("Success", message);
  };

  return {
    login,
    register,
    logout,
    loading,
    handleError,
    handleSuccess,
  };
};
