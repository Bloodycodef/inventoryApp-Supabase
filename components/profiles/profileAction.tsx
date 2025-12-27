import { Text } from "@/components/shared/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ProfileActionsProps {
  isAdmin: boolean;
  onAddStaff: () => void;
  onLogout: () => void;
}

export function ProfileActions({
  isAdmin,
  onAddStaff,
  onLogout,
}: ProfileActionsProps) {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" style={styles.sectionTitle}>
        Aksi Profil
      </Text>

      <View style={styles.actionsContainer}>
        {isAdmin && (
          <TouchableOpacity style={styles.actionButton} onPress={onAddStaff}>
            <View style={[styles.actionIcon, { backgroundColor: "#dbeafe" }]}>
              <MaterialCommunityIcons
                name="account-plus"
                size={24}
                color="#3b82f6"
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Tambah Staff Baru</Text>
              <Text style={styles.actionDescription}>
                Tambah staff gudang atau kasir baru
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#cbd5e1"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
          <View style={[styles.actionIcon, { backgroundColor: "#fee2e2" }]}>
            <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Keluar Akun</Text>
            <Text style={styles.actionDescription}>Keluar dari aplikasi</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#cbd5e1"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 16,
  },
  actionsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "#64748b",
  },
});
