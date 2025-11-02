import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

const COLORS = {
  background: "#F4F7F9",
  text: "#1F2937",
  textSecondary: "#6B7280",
  primary: "#007AFF",
  danger: "#EF4444",
  card: "#FFFFFF",
};

interface ProfileData {
  username: string;
  email: string;
  branch_name: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw userError || new Error("User not found");

      // Ambil data user dari tabel app_users
      const { data: userData, error: userDataError } = await supabase
        .from("app_users")
        .select("username, email, branch_id")
        .eq("user_id", user.id)
        .single();

      if (userDataError || !userData)
        throw userDataError || new Error("User data not found");

      // Ambil nama cabang dari tabel branches
      const { data: branch, error: branchError } = await supabase
        .from("branches")
        .select("branch_name")
        .eq("branch_id", userData.branch_id)
        .single(); // ⬅️ hanya ambil satu data, bukan array

      if (branchError) throw branchError;

      setProfile({
        username: userData.username,
        email: userData.email,
        branch_name: branch?.branch_name ?? "Tidak diketahui",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Data profil tidak ditemukan.</Text>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.buttonText}>Kembali ke Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nama Pengguna:</Text>
        <Text style={styles.value}>{profile.username}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Cabang:</Text>
        <Text style={styles.value}>{profile.branch_name}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/auth/login");
        }}
      >
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  logoutButton: {
    marginTop: 30,
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
