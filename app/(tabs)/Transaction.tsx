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
import RNPickerSelect from "react-native-picker-select";
import { useUser } from "../../hook/useUser";
import { supabase } from "../../lib/supabase";

// ✅ tambahkan purchase_price & selling_price di interface Item
interface Item {
  item_id: string;
  item_name: string;
  stock: number;
  purchase_price: number;
  selling_price: number;
}

interface Transaction {
  transaction_id: string;
  item_id: string;
  quantity: number;
  transaction_type: "IN" | "OUT";
  transaction_date: string;
  username: string;
  item_name: string;
  price?: number; // ✅ tambahkan agar bisa menampilkan harga bila perlu
}

export default function TransactionPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [type, setType] = useState<"IN" | "OUT">("IN");

  useEffect(() => {
    if (user?.role === "staf-kasir") setType("OUT");
    else if (user?.role === "staf-gudang" || user?.role === "admin")
      setType("IN");
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!user) return;

      // ✅ ambil juga purchase_price dan selling_price
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("item_id, item_name, stock, purchase_price, selling_price")
        .eq("branch_id", user.branch_id)
        .order("item_name", { ascending: true });

      if (itemError) throw itemError;
      setItems(itemData || []);

      // Ambil daftar transaksi (tidak perlu ubah)
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select(
          `
          transaction_id,
          item_id,
          quantity,
          transaction_type,
          transaction_date,
          price,
          app_users(username),
          items(item_name)
        `
        )
        .eq("branch_id", user.branch_id)
        .order("transaction_date", { ascending: false });

      if (txError) throw txError;

      const formattedTx: Transaction[] = (txData || []).map((t: any) => ({
        transaction_id: t.transaction_id,
        item_id: t.item_id,
        quantity: t.quantity,
        transaction_type: t.transaction_type,
        transaction_date: t.transaction_date,
        username: t.app_users?.username || "Unknown",
        item_name: t.items?.item_name || "Unknown",
        price: t.price,
      }));

      setTransactions(formattedTx);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!user) return;
    if (!selectedItem || !quantity)
      return Alert.alert("Error", "Pilih item dan masukkan quantity");

    const qtyNumber = Number(quantity);
    if (qtyNumber <= 0)
      return Alert.alert("Error", "Quantity harus lebih dari 0");

    const item = items.find((i) => i.item_id === selectedItem);
    if (!item) return Alert.alert("Error", "Item tidak ditemukan");

    if (type === "IN" && user.role !== "staf-gudang" && user.role !== "admin")
      return Alert.alert(
        "Error",
        "Hanya staf gudang/admin yang bisa input barang masuk"
      );

    if (type === "OUT" && user.role !== "staf-kasir" && user.role !== "admin")
      return Alert.alert(
        "Error",
        "Hanya staf kasir/admin yang bisa input barang keluar"
      );

    if (type === "OUT" && qtyNumber > item.stock)
      return Alert.alert("Error", `Stok tidak cukup (${item.stock})`);

    // ✅ ambil harga sesuai tipe transaksi
    const price = type === "IN" ? item.purchase_price : item.selling_price;

    try {
      // ✅ sertakan price ke insert Supabase
      const { error } = await supabase.from("transactions").insert({
        item_id: selectedItem,
        quantity: qtyNumber,
        transaction_type: type,
        branch_id: user.branch_id,
        user_id: user.user_id,
        price, // ✅ wajib dikirim agar tidak null
      });

      if (error) throw error;

      // Update stok barang
      const newStock =
        type === "IN" ? item.stock + qtyNumber : item.stock - qtyNumber;

      await supabase
        .from("items")
        .update({ stock: newStock })
        .eq("item_id", selectedItem);

      Alert.alert(
        "Sukses",
        `Transaksi ${type === "IN" ? "masuk" : "keluar"} berhasil`
      );
      setQuantity("");
      setSelectedItem(null);
      fetchData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal menyimpan transaksi");
    }
  };

  if (loading || authLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>📦 Sistem Inventory</Text>
      <Text style={styles.subtitle}>Kelola stok barang masuk & keluar</Text>

      <Text style={styles.roleText}>
        Login sebagai: <Text style={{ fontWeight: "bold" }}>{user.role}</Text>
      </Text>

      {/* Tabs IN/OUT */}
      <View style={styles.tabContainer}>
        {(user.role === "staf-gudang" || user.role === "admin") && (
          <TouchableOpacity
            style={[styles.tabButton, type === "IN" && styles.tabActiveGreen]}
            onPress={() => setType("IN")}
          >
            <Text
              style={[styles.tabText, type === "IN" && styles.tabTextActive]}
            >
              Barang Masuk
            </Text>
          </TouchableOpacity>
        )}

        {(user.role === "staf-kasir" || user.role === "admin") && (
          <TouchableOpacity
            style={[styles.tabButton, type === "OUT" && styles.tabActiveRed]}
            onPress={() => setType("OUT")}
          >
            <Text
              style={[styles.tabText, type === "OUT" && styles.tabTextActive]}
            >
              Barang Keluar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Form Input */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {type === "IN" ? "Input Barang Masuk" : "Input Barang Keluar"}
        </Text>

        <Text style={styles.label}>Pilih Barang:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedItem(value)}
          value={selectedItem}
          items={items.map((item) => ({
            label: `${item.item_name} (stok: ${item.stock})`,
            value: item.item_id,
          }))}
          placeholder={{ label: "Pilih barang...", value: null }}
          style={{
            inputIOS: styles.dropdown,
            inputAndroid: styles.dropdown,
            placeholder: { color: "#94a3b8" },
          }}
        />

        <Text style={styles.label}>Jumlah:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Masukkan jumlah..."
          value={quantity}
          onChangeText={setQuantity}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            type === "IN" ? styles.btnGreen : styles.btnRed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {type === "IN" ? "Simpan Barang Masuk" : "Simpan Barang Keluar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Riwayat Transaksi */}
      <Text style={styles.sectionTitle}>📜 Riwayat Transaksi</Text>
      {transactions.length === 0 ? (
        <Text style={{ color: "#64748b", textAlign: "center" }}>
          Belum ada transaksi.
        </Text>
      ) : (
        transactions.map((tx) => (
          <View
            key={tx.transaction_id}
            style={[
              styles.txCard,
              tx.transaction_type === "IN" ? styles.txGreen : styles.txRed,
            ]}
          >
            <View style={styles.txRow}>
              <Text style={styles.txType}>
                {tx.transaction_type === "IN" ? "⬆️ Masuk" : "⬇️ Keluar"}
              </Text>
              <Text style={styles.txDate}>
                {new Date(tx.transaction_date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.txName}>{tx.item_name}</Text>
            <View style={styles.txRow}>
              <Text style={styles.txQty}>Jumlah: {tx.quantity}</Text>
              {tx.price && (
                <Text style={styles.txQty}>
                  Harga: Rp {tx.price.toLocaleString()}
                </Text>
              )}
            </View>
            <Text style={styles.txUser}>By: {tx.username}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 14, color: "#64748b", marginBottom: 16 },
  roleText: { marginBottom: 8, color: "#64748b" },
  tabContainer: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  tabActiveGreen: { backgroundColor: "#16a34a" },
  tabActiveRed: { backgroundColor: "#dc2626" },
  tabText: { color: "#475569", fontWeight: "600" },
  tabTextActive: { color: "white" },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1e293b",
    marginBottom: 12,
  },
  label: { fontWeight: "600", color: "#334155", marginTop: 8 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f8fafc",
    marginTop: 6,
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#f8fafc",
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnGreen: { backgroundColor: "#16a34a" },
  btnRed: { backgroundColor: "#dc2626" },
  submitText: { color: "white", fontWeight: "bold", fontSize: 16 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1e293b",
    marginBottom: 10,
  },
  txCard: {
    backgroundColor: "white",
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  txGreen: { borderLeftColor: "#16a34a" },
  txRed: { borderLeftColor: "#dc2626" },
  txRow: { flexDirection: "row", justifyContent: "space-between" },
  txType: { fontWeight: "600", color: "#475569" },
  txDate: { color: "#94a3b8" },
  txName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0f172a",
    marginVertical: 4,
  },
  txQty: { color: "#334155" },
  txUser: { color: "#64748b" },
});
