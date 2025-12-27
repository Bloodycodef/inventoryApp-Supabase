// app/transaction/components/TransactionHistory.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TransactionGroup } from "../../type/transaction";

interface TransactionHistoryProps {
  transactionGroups: TransactionGroup[];
  onRefresh: () => void;
  onGenerateInvoice: (group: TransactionGroup) => void;
  isGeneratingPDF: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactionGroups,
  onRefresh,
  onGenerateInvoice,
  isGeneratingPDF,
}) => {
  if (transactionGroups.length === 0) {
    return (
      <View style={styles.emptyHistory}>
        <Ionicons name="receipt-outline" size={48} color="#94a3b8" />
        <Text style={styles.emptyHistoryText}>Belum ada transaksi</Text>
      </View>
    );
  }

  return (
    <>
      {transactionGroups.map((group) => (
        <View
          key={group.group_id}
          style={[
            styles.transactionCard,
            group.transaction_type === "IN" ? styles.cardIn : styles.cardOut,
          ]}
        >
          <View style={styles.transactionHeader}>
            <View style={styles.transactionInfo}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {group.transaction_type === "IN" ? "STOK MASUK" : "PENJUALAN"}
                </Text>
              </View>
              <Text style={styles.transactionDate}>
                {new Date(group.transaction_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.transactionUser}>
                Kasir: {group.username}
              </Text>
            </View>
            <View style={styles.transactionActions}>
              <Text style={styles.transactionTotal}>
                Rp {group.total_amount.toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.invoiceButton}
                onPress={() => onGenerateInvoice(group)}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <ActivityIndicator size="small" color="#1e3a8a" />
                ) : (
                  <Ionicons name="download" size={22} color="#1e3a8a" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {group.notes && (
            <View style={styles.transactionNotes}>
              <Ionicons name="information-circle" size={14} color="#f59e0b" />
              <Text style={styles.notesText} numberOfLines={2}>
                {group.notes}
              </Text>
            </View>
          )}

          <View style={styles.itemsList}>
            {group.items.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.item_name}
                  </Text>
                  {item.is_service && (
                    <View style={styles.serviceTag}>
                      <Text style={styles.serviceTagText}>SERVICE</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemSubtotal}>
                    Rp {item.subtotal.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
            {group.items.length > 3 && (
              <Text style={styles.moreItems}>
                +{group.items.length - 3} item lainnya...
              </Text>
            )}
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  // Copy relevant styles from original file
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 16,
  },
  emptyHistoryText: {
    color: "#64748b",
    marginTop: 12,
    fontSize: 14,
  },
  transactionCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    borderLeftWidth: 4,
  },
  cardIn: {
    borderLeftColor: "#16a34a",
  },
  cardOut: {
    borderLeftColor: "#dc2626",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  typeBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
  transactionDate: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 4,
  },
  transactionUser: {
    color: "#94a3b8",
    fontSize: 11,
  },
  transactionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionTotal: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1e293b",
  },
  invoiceButton: {
    padding: 6,
  },
  transactionNotes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    color: "#78350f",
    fontSize: 12,
    flex: 1,
  },
  itemsList: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  itemName: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
  },
  serviceTag: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serviceTagText: {
    fontSize: 10,
    color: "#7c3aed",
    fontWeight: "600",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemQuantity: {
    fontSize: 12,
    color: "#64748b",
    minWidth: 30,
    textAlign: "right",
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16a34a",
    minWidth: 80,
    textAlign: "right",
  },
  moreItems: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
});
