import { Text } from "@/components/shared/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface ProfileHeaderProps {
  profile: {
    username: string;
    role: "admin" | "staf-gudang" | "staf-kasir";
    email?: string;
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getRoleIcon = () => {
    switch (profile.role) {
      case "admin":
        return "shield-account";
      case "staf-gudang":
        return "warehouse";
      case "staf-kasir":
        return "cash-register";
      default:
        return "account";
    }
  };

  const getRoleColor = () => {
    switch (profile.role) {
      case "admin":
        return "#8b5cf6"; // purple
      case "staf-gudang":
        return "#10b981"; // emerald
      case "staf-kasir":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View
          style={[styles.avatar, { backgroundColor: getRoleColor() + "20" }]}
        >
          <MaterialCommunityIcons
            name={getRoleIcon()}
            size={40}
            color={getRoleColor()}
          />
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text variant="title" style={styles.username}>
          {profile.username}
        </Text>

        <View style={styles.roleBadge}>
          <MaterialCommunityIcons
            name={getRoleIcon()}
            size={16}
            color={getRoleColor()}
          />
          <Text style={[styles.roleText, { color: getRoleColor() }]}>
            {profile.role.replace("staf-", "Staff ").toUpperCase()}
          </Text>
        </View>

        {profile.email && (
          <View style={styles.emailContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={16}
              color="#6b7280"
            />
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#f1f5f9",
  },
  userInfo: {
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  email: {
    fontSize: 14,
    color: "#64748b",
  },
});
