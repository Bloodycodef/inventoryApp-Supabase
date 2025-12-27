import { Text } from "@/components/shared/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface ProfileInfoCardProps {
  profile: {
    branch_name: string;
    branch_id?: number;
  };
  location: string | null;
}

export function ProfileInfoCard({ profile, location }: ProfileInfoCardProps) {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" style={styles.sectionTitle}>
        Informasi Cabang
      </Text>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="office-building"
              size={20}
              color="#8b5cf6"
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nama Cabang</Text>
            <Text style={styles.infoValue}>{profile.branch_name}</Text>
          </View>
        </View>

        {profile.branch_id && (
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MaterialCommunityIcons
                name="identifier"
                size={20}
                color="#3b82f6"
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID Cabang</Text>
              <Text style={styles.infoValue}>#{profile.branch_id}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#ef4444"
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Lokasi Saat Ini</Text>
            <Text style={styles.infoValue}>
              {location || "Mengambil lokasi..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
});
