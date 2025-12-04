import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LowStockItem } from "../type/database";

interface LowStockListProps {
  items: LowStockItem[];
}

export default function LowStockList({ items }: LowStockListProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚠️ Stok Rendah</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={22}
              color="#F59E0B"
            />
            <Text style={styles.itemName}>{item.item_name}</Text>
            <Text style={styles.stock}>Sisa {item.stock}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    marginLeft: 8,
  },
  stock: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});
