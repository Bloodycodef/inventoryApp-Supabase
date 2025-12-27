// app/items/components/EmptyState.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  isAdmin: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isAdmin }) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="package-variant"
        size={64}
        color="#CBD5E1"
      />
      <Text style={styles.emptyText}>Belum ada item</Text>
      {isAdmin && (
        <Text style={styles.emptySubtext}>
          Tambah item baru dengan menekan tombol + di bawah
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: "#64748B",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
