// app/items/components/AccessWarning.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AccessWarningProps {
  isAdmin: boolean;
}

export const AccessWarning: React.FC<AccessWarningProps> = ({ isAdmin }) => {
  if (isAdmin) return null;

  return (
    <View style={styles.warning}>
      <MaterialCommunityIcons name="shield-alert" size={24} color="#F59E0B" />
      <Text style={styles.warningText}>
        Hanya admin yang bisa menambah, mengedit, atau menghapus item
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  warning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  warningText: {
    marginLeft: 8,
    color: "#92400E",
    fontSize: 13,
    flex: 1,
  },
});
