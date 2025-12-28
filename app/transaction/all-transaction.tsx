// app/transaction/all-transactions.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../hook/transaction/useUser";
import { TransactionGroup } from "../../type/transaction";
import { generateInvoice } from "../../utils/transaction/pdfGenerator";
import { fetchTransactionGroups } from "../../utils/transaction/transactionService";

export default function AllTransactionsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [transactionGroups, setTransactionGroups] = useState<
    TransactionGroup[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionGroup[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "IN" | "OUT">("ALL");

  // Load transactions
  const loadTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const groups = await fetchTransactionGroups(user.branch_id);
      setTransactionGroups(groups);
      setFilteredTransactions(groups);
    } catch (error) {
      console.error("Error loading transactions:", error);
      Alert.alert("Error", "Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Filter transactions based on search and type
  useEffect(() => {
    let filtered = [...transactionGroups];

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter((t) => t.transaction_type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.group_id.toLowerCase().includes(query) ||
          t.username.toLowerCase().includes(query) ||
          t.notes?.toLowerCase().includes(query) ||
          t.items.some((item) => item.item_name.toLowerCase().includes(query))
      );
    }

    setFilteredTransactions(filtered);
  }, [transactionGroups, selectedType, searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  const handleGenerateInvoice = async (group: TransactionGroup) => {
    setIsGeneratingPDF(true);
    const result = await generateInvoice(group);
    setIsGeneratingPDF(false);

    if (result.success) {
      Alert.alert("Berhasil", "Nota berhasil diunduh");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Memuat transaksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Semua Transaksi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        {/* Type Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilter}
        >
          {["ALL", "IN", "OUT"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(type as any)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === type && styles.typeButtonTextActive,
                ]}
              >
                {type === "ALL"
                  ? "Semua"
                  : type === "IN"
                  ? "Stok Masuk"
                  : "Penjualan"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#64748B"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari transaksi, item, atau kasir..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{filteredTransactions.length}</Text>
          <Text style={styles.statLabel}>Total Transaksi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.statIn]}>
            {
              filteredTransactions.filter((t) => t.transaction_type === "IN")
                .length
            }
          </Text>
          <Text style={styles.statLabel}>Stok Masuk</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.statOut]}>
            {
              filteredTransactions.filter((t) => t.transaction_type === "OUT")
                .length
            }
          </Text>
          <Text style={styles.statLabel}>Penjualan</Text>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.transactionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Tidak ada transaksi</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `Tidak ditemukan transaksi dengan kata kunci "${searchQuery}"`
                : "Belum ada transaksi yang tercatat"}
            </Text>
          </View>
        ) : (
          filteredTransactions.map((group) => (
            <View
              key={group.group_id}
              style={[
                styles.transactionCard,
                group.transaction_type === "IN"
                  ? styles.cardIn
                  : styles.cardOut,
              ]}
            >
              <View style={styles.transactionHeader}>
                <View style={styles.transactionInfo}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>
                      {group.transaction_type === "IN"
                        ? "STOK MASUK"
                        : "PENJUALAN"}
                    </Text>
                  </View>
                  <Text style={styles.transactionId}>
                    ID: {group.group_id.substring(0, 8)}
                  </Text>
                </View>
                <Text style={styles.transactionDate}>
                  {formatDate(group.transaction_date)}
                </Text>
              </View>

              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kasir:</Text>
                  <Text style={styles.detailValue}>{group.username}</Text>
                </View>
                {group.notes && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Catatan:</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                      {group.notes}
                    </Text>
                  </View>
                )}
              </View>

              {/* Items List */}
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>
                  Item ({group.items.length}):
                </Text>
                {group.items.map((item, index) => (
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
                      <Text style={styles.itemPrice}>
                        {formatCurrency(item.price)}
                      </Text>
                      <Text style={styles.itemSubtotal}>
                        {formatCurrency(item.subtotal)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.transactionFooter}>
                <Text style={styles.transactionTotal}>
                  Total: {formatCurrency(group.total_amount)}
                </Text>
                <TouchableOpacity
                  style={styles.invoiceButton}
                  onPress={() => handleGenerateInvoice(group)}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="download" size={16} color="#FFFFFF" />
                      <Text style={styles.invoiceButtonText}>Unduh Nota</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  typeFilter: {
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: "#3B82F6",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    padding: 0,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
  },
  statIn: {
    color: "#16A34A",
  },
  statOut: {
    color: "#DC2626",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  transactionsList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  transactionCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  cardIn: {
    borderLeftColor: "#16A34A",
  },
  cardOut: {
    borderLeftColor: "#DC2626",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
  transactionId: {
    fontSize: 12,
    color: "#64748B",
  },
  transactionDate: {
    fontSize: 12,
    color: "#64748B",
  },
  transactionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748B",
    width: 60,
  },
  detailValue: {
    fontSize: 12,
    color: "#1E293B",
    flex: 1,
  },
  itemsContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  serviceTagText: {
    fontSize: 10,
    color: "#7C3AED",
    fontWeight: "600",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemQuantity: {
    fontSize: 12,
    color: "#64748B",
    minWidth: 30,
    textAlign: "right",
  },
  itemPrice: {
    fontSize: 12,
    color: "#64748B",
    minWidth: 80,
    textAlign: "right",
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16A34A",
    minWidth: 100,
    textAlign: "right",
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  transactionTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  invoiceButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
