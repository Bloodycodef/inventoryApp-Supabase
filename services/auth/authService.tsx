// app/auth/services/authService.ts
import { supabase } from "../../lib/supabase";

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    let emailToUse = credentials.identifier.trim().toLowerCase();

    // If identifier is not an email, find email by username
    if (!credentials.identifier.includes("@")) {
      const { data: userData, error: userError } = await supabase
        .from("app_users")
        .select("email")
        .eq("username", credentials.identifier.trim())
        .maybeSingle();

      if (userError) throw userError;
      if (!userData?.email) {
        throw new Error("Username not found. Please check your username.");
      }

      emailToUse = userData.email.toLowerCase();
    }

    // Login to Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: credentials.password,
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

    return data.user;
  },

  async register(credentials: RegisterCredentials) {
    // Validate input
    if (!credentials.email || !credentials.password || !credentials.username) {
      throw new Error("All fields are required.");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    // Check if username already exists
    const { data: existingUser, error: usernameError } = await supabase
      .from("app_users")
      .select("username")
      .eq("username", credentials.username)
      .maybeSingle();

    if (usernameError) throw usernameError;
    if (existingUser) {
      throw new Error("Username already taken.");
    }

    // Register user
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { display_name: credentials.username },
      },
    });

    if (error) throw error;
    return data.user;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    console.log("User logged out");
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};
