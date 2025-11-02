import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatCardProps } from "../type/database";

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon as any} size={26} color="#007AFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 14, color: "#6B7280" },
  value: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginTop: 4 },
});
