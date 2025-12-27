// app/components/dashboard/TransactionList.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../../type/database";

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  emptyMessage?: string;
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  title = "🧾 Transaksi Terbaru",
  emptyMessage = "Belum ada transaksi",
  limit = 10,
}) => {
  const displayTransactions = transactions.slice(0, limit);

  if (displayTransactions.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={displayTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <MaterialCommunityIcons
              name={item.type === "masuk" ? "arrow-down-bold" : "arrow-up-bold"}
              size={22}
              color={item.type === "masuk" ? "#10B981" : "#EF4444"}
            />

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.itemName}>
                {item.type === "masuk" ? "Barang Masuk" : "Barang Keluar"}
              </Text>
              <Text style={styles.dateText}>
                {new Date(item.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            <Text
              style={[
                styles.quantity,
                { color: item.type === "masuk" ? "#10B981" : "#EF4444" },
              ]}
            >
              {item.type === "masuk" ? "+" : "-"}
              {item.total_items}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
};

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
  emptyMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
  },
  quantity: {
    fontSize: 15,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});
