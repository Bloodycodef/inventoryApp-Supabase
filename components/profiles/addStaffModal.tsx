import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Text } from "@/components/shared/text";
import { supabase } from "@/lib/supabase";

interface AddStaffModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminBranchId: number;
  adminUserId: string;
}

type StaffRole = "staf-gudang" | "staf-kasir";

export function AddStaffModal({
  visible,
  onClose,
  onSuccess,
  adminBranchId,
  adminUserId,
}: AddStaffModalProps) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "staf-gudang" as StaffRole,
  });

  const [loading, setLoading] = useState(false);

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Validasi
    if (!form.username.trim()) {
      Alert.alert("Validasi", "Username wajib diisi");
      return;
    }

    if (!form.email.trim()) {
      Alert.alert("Validasi", "Email wajib diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Validasi", "Format email tidak valid");
      return;
    }

    if (!form.password) {
      Alert.alert("Validasi", "Password wajib diisi");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Validasi", "Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      // Register staff
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            display_name: form.username,
            role: form.role,
            branch_id: adminBranchId,
            created_by: adminUserId,
          },
        },
      });

      if (error) throw error;

      Alert.alert(
        "Berhasil",
        `Staff ${
          form.role === "staf-gudang" ? "Gudang" : "Kasir"
        } berhasil didaftarkan!`,
        [
          {
            text: "OK",
            onPress: () => {
              setForm({
                username: "",
                email: "",
                password: "",
                role: "staf-gudang",
              });
              onSuccess();
              onClose();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error register staff:", error);

      // Handle error spesifik
      if (error.message?.includes("already registered")) {
        Alert.alert("Gagal", "Email sudah terdaftar");
      } else if (error.message?.includes("weak_password")) {
        Alert.alert("Gagal", "Password terlalu lemah");
      } else {
        Alert.alert(
          "Gagal",
          error.message || "Terjadi kesalahan saat mendaftarkan staff"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setForm({
        username: "",
        email: "",
        password: "",
        role: "staf-gudang",
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={handleClose}
            activeOpacity={1}
          />

          <View style={styles.sheet}>
            <View style={styles.dragIndicator} />

            <View style={styles.header}>
              <View style={styles.headerTitle}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={24}
                  color="#4f46e5"
                />
                <Text variant="title" style={styles.title}>
                  Tambah Staff Baru
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                disabled={loading}
                style={styles.closeBtn}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={loading ? "#9CA3AF" : "#6B7280"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Username</Text>
                <Input
                  placeholder="Contoh: budi_gudang"
                  value={form.username}
                  onChangeText={(text) => onChange("username", text)}
                  variant="filled"
                  editable={!loading}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <Input
                  placeholder="staff@contoh.com"
                  value={form.email}
                  onChangeText={(text) => onChange("email", text)}
                  variant="filled"
                  editable={!loading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <Input
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChangeText={(text) => onChange("password", text)}
                  variant="filled"
                  editable={!loading}
                  secureTextEntry
                />
                <Text style={styles.hint}>Minimal 6 karakter</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Role Staff</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      form.role === "staf-gudang" && styles.roleActive,
                      loading && styles.disabled,
                    ]}
                    onPress={() => !loading && onChange("role", "staf-gudang")}
                    disabled={loading}
                  >
                    <MaterialCommunityIcons
                      name="warehouse"
                      size={20}
                      color={
                        form.role === "staf-gudang" ? "#FFFFFF" : "#6B7280"
                      }
                    />
                    <Text
                      style={[
                        styles.roleText,
                        form.role === "staf-gudang" && styles.roleTextActive,
                      ]}
                    >
                      Staff Gudang
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      form.role === "staf-kasir" && styles.roleActive,
                      loading && styles.disabled,
                    ]}
                    onPress={() => !loading && onChange("role", "staf-kasir")}
                    disabled={loading}
                  >
                    <MaterialCommunityIcons
                      name="cash-register"
                      size={20}
                      color={form.role === "staf-kasir" ? "#FFFFFF" : "#6B7280"}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        form.role === "staf-kasir" && styles.roleTextActive,
                      ]}
                    >
                      Staff Kasir
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.hint}>
                  Staff akan ditambahkan ke cabang Anda
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Batal"
                  onPress={handleClose}
                  size="large"
                  variant="outline"
                  disabled={loading}
                  style={styles.cancelButton}
                />
                <Button
                  title={loading ? "Mendaftarkan..." : "Daftarkan Staff"}
                  onPress={handleSubmit}
                  loading={loading}
                  size="large"
                  disabled={loading}
                  style={styles.submitButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginLeft: 4,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  roleActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  disabled: {
    opacity: 0.5,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  roleTextActive: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderColor: "#D1D5DB",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#4F46E5",
  },
});
