import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../hook/useUser";
import { supabase } from "../../lib/supabase";

interface Profile {
  username: string;
  role: "admin" | "staf-gudang" | "staf-kasir";
  branch_name: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: "",
    password: "",
    email: "",
    role: "staf-gudang" as "staf-gudang" | "staf-kasir",
  });

  // ✅ Tambahkan fungsi logout di sini
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  // === FETCH PROFILE ===
  const fetchProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("app_users")
        .select(
          `
          username,
          role,
          branch_id,
          branches!inner(branch_name)
        `
        )
        .eq("user_id", user.user_id)
        .single();

      if (error) throw error;

      // ✅ Perbaikan akses branch_name
      setProfile({
        username: data.username,
        role: data.role,
        branch_name: (data.branches as { branch_name: string }).branch_name,
      });

      fetchUserLocation();
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      Alert.alert("Error", err.message || "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  // === GET USER LOCATION ===
  const fetchUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Tidak dapat mengakses lokasi");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    } catch (err) {
      console.error("Error fetching location:", err);
      setUserLocation("N/A");
    }
  };

  // === ADD STAFF HANDLER ===
  const handleAddStaff = async () => {
    if (!newStaff.username || !newStaff.password || !newStaff.email) {
      Alert.alert("Error", "Isi semua kolom terlebih dahulu");
      return;
    }

    try {
      if (!user) return;
      setAdding(true);

      const { data, error } = await supabase.auth.signUp({
        email: newStaff.email,
        password: newStaff.password,
        options: {
          data: {
            display_name: newStaff.username,
            role: newStaff.role,
            branch_id: user.branch_id,
            created_by: user.user_id,
          },
        },
      });

      if (error) throw error;

      Alert.alert(
        "Sukses",
        "Akun staf berhasil dibuat! Silakan verifikasi email."
      );
      setModalVisible(false);
      setNewStaff({
        username: "",
        password: "",
        email: "",
        role: "staf-gudang",
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal menambah staf");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3c72" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Profil tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👤 Profil Pengguna</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{profile.username}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{profile.role}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Cabang:</Text>
        <Text style={styles.value}>{profile.branch_name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Lokasi:</Text>
        <Text style={styles.value}>{userLocation ?? "Loading..."}</Text>
      </View>

      {/* Tombol logout */}
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Tambah staf hanya untuk admin */}
      {profile.role === "admin" && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Tambah Staf</Text>
        </TouchableOpacity>
      )}

      {/* Modal Tambah Staf */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tambah Staf Baru</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newStaff.username}
              onChangeText={(text) =>
                setNewStaff((prev) => ({ ...prev, username: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={newStaff.email}
              onChangeText={(text) =>
                setNewStaff((prev) => ({ ...prev, email: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={newStaff.password}
              onChangeText={(text) =>
                setNewStaff((prev) => ({ ...prev, password: text }))
              }
            />

            <View style={styles.roleSelect}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  newStaff.role === "staf-gudang" && styles.roleButtonActive,
                ]}
                onPress={() =>
                  setNewStaff((prev) => ({ ...prev, role: "staf-gudang" }))
                }
              >
                <Text>Staf Gudang</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  newStaff.role === "staf-kasir" && styles.roleButtonActive,
                ]}
                onPress={() =>
                  setNewStaff((prev) => ({ ...prev, role: "staf-kasir" }))
                }
              >
                <Text>Staf Kasir</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#4CAF50" }]}
                onPress={handleAddStaff}
                disabled={adding}
              >
                <Text style={styles.buttonText}>
                  {adding ? "Menambah..." : "Tambah"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#aaa" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontWeight: "bold", fontSize: 16 },
  value: { fontSize: 16 },
  button: {
    marginTop: 20,
    backgroundColor: "#1e3c72",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  roleSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: "#d1e7dd",
    borderColor: "#4CAF50",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
