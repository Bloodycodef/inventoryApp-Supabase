// app/transaction/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Cart } from "../../components/transaction/chart";
import { NotesModal } from "../../components/transaction/notesModal";
import { TransactionForm } from "../../components/transaction/transactionForm";
import { TransactionHistory } from "../../components/transaction/transactionHistory";
import { useUser } from "../../hook/transaction/useUser";
import { CartItem, Item, TransactionGroup } from "../../type/transaction";
import { generateInvoice } from "../../utils/transaction/pdfGenerator";
import {
  fetchItems,
  fetchTransactionGroups,
  submitTransaction,
} from "../../utils/transaction/transactionService";

export default function TransactionPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  // State Management
  const [items, setItems] = useState<Item[]>([]);
  const [transactionGroups, setTransactionGroups] = useState<
    TransactionGroup[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Form State
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [isServiceMode, setIsServiceMode] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [notes, setNotes] = useState("");

  // Modal State
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // EFFECTS & INITIALIZATION
  // ============================================

  useEffect(() => {
    if (user?.role === "staf-kasir") setType("OUT");
    else if (user?.role === "staf-gudang" || user?.role === "admin")
      setType("IN");
  }, [user]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalAmount(total);
  }, [cart]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchData();
      }
    }, [user])
  );
  // ============================================
  // DATA FETCHING FUNCTIONS
  // ============================================

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const [itemData, groupData] = await Promise.all([
        fetchItems(user.branch_id),
        fetchTransactionGroups(user.branch_id),
      ]);

      setItems(itemData);
      setTransactionGroups(groupData);
    } catch (err) {
      console.error("Error in fetchData:", err);
      Alert.alert("Error", "Gagal memuat data. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // ============================================
  // CART MANAGEMENT FUNCTIONS
  // ============================================

  const addServiceToCart = () => {
    if (!serviceName.trim() || !servicePrice) {
      Alert.alert("Error", "Masukkan nama jasa dan harga");
      return;
    }

    const priceNumber = Number(servicePrice);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Error", "Harga harus angka dan lebih dari 0");
      return;
    }

    const quantity = 1;
    const subtotal = priceNumber * quantity;

    const newServiceItem: CartItem = {
      name: serviceName,
      quantity: quantity,
      price: priceNumber,
      subtotal: subtotal,
      is_service: true,
      description: serviceName,
    };

    setCart([...cart, newServiceItem]);
    setServiceName("");
    setServicePrice("");
    setIsServiceMode(false);
    Alert.alert("Sukses", "Jasa ditambahkan ke keranjang");
  };

  const addItemToCart = () => {
    if (!selectedItem || !quantity) {
      Alert.alert("Error", "Pilih item dan masukkan jumlah");
      return;
    }

    const qtyNumber = Number(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      Alert.alert("Error", "Jumlah harus angka dan lebih dari 0");
      return;
    }

    const item = items.find((i) => i.item_id === selectedItem);
    if (!item) {
      Alert.alert("Error", "Item tidak ditemukan");
      return;
    }

    // Check stock for OUT transactions
    if (type === "OUT") {
      const cartQuantity = cart.reduce(
        (sum, cartItem) =>
          cartItem.item_id === selectedItem ? sum + cartItem.quantity : sum,
        0
      );

      if (qtyNumber + cartQuantity > item.stock) {
        Alert.alert("Error", `Stok tidak cukup. Stok tersedia: ${item.stock}`);
        return;
      }
    }

    const price = type === "IN" ? item.purchase_price : item.selling_price;
    const subtotal = qtyNumber * price;

    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.item_id === selectedItem && !cartItem.is_service
    );

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += qtyNumber;
      updatedCart[existingIndex].subtotal += subtotal;
      setCart(updatedCart);
    } else {
      const newCartItem: CartItem = {
        item_id: selectedItem,
        name: item.item_name,
        quantity: qtyNumber,
        price: price,
        subtotal: subtotal,
        is_service: false,
      };
      setCart([...cart, newCartItem]);
    }

    setSelectedItem(null);
    setQuantity("");
    Alert.alert("Sukses", "Item ditambahkan ke keranjang");
  };

  const addToCart = () => {
    if (isServiceMode) {
      addServiceToCart();
    } else {
      addItemToCart();
    }
  };

  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    const updatedCart = [...cart];
    const item = updatedCart[index];

    // Check stock if it's an item (not service)
    if (!item.is_service && item.item_id) {
      const originalItem = items.find((i) => i.item_id === item.item_id);
      if (originalItem && type === "OUT" && newQuantity > originalItem.stock) {
        Alert.alert(
          "Error",
          `Stok tidak cukup. Maksimal: ${originalItem.stock}`
        );
        return;
      }
    }

    updatedCart[index].quantity = newQuantity;
    updatedCart[index].subtotal = newQuantity * item.price;
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    setTotalAmount(0);
    setNotes("");
    setIsServiceMode(false);
  };

  // ============================================
  // TRANSACTION PROCESSING
  // ============================================

  const handleSubmitTransaction = async () => {
    if (!user) return;

    if (cart.length === 0) {
      Alert.alert("Error", "Keranjang kosong. Tambahkan item terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newGroup = await submitTransaction(
        user,
        type,
        cart,
        totalAmount,
        notes,
        items
      );

      // Show success message with option to download invoice
      Alert.alert(
        "Sukses",
        `Transaksi ${type === "IN" ? "masuk" : "keluar"} berhasil disimpan`,
        [
          {
            text: "Download Nota",
            onPress: async () => {
              setIsGeneratingPDF(true);
              const result = await generateInvoice(newGroup);
              setIsGeneratingPDF(false);
              if (result.success) {
                Alert.alert("Sukses", result.message);
              } else {
                Alert.alert("Error", result.message);
              }
              clearCart();
              fetchData();
            },
          },
          {
            text: "OK",
            onPress: () => {
              clearCart();
              fetchData();
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Transaction error details:", err);
      Alert.alert(
        "Error",
        err.message ||
          "Gagal menyimpan transaksi. Pastikan koneksi internet stabil."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateInvoice = async (group: TransactionGroup) => {
    setIsGeneratingPDF(true);
    const result = await generateInvoice(group);
    setIsGeneratingPDF(false);

    if (result.success) {
      Alert.alert("Sukses", result.message);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  // ============================================
  // RENDER LOADING
  // ============================================

  if (loading || authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  // ============================================
  // RENDER MAIN UI
  // ============================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Transaction Type Tabs */}
      <View style={styles.tabContainer}>
        {(user?.role === "staf-gudang" || user?.role === "admin") && (
          <TouchableOpacity
            style={[styles.tabButton, type === "IN" && styles.tabActiveGreen]}
            onPress={() => {
              setType("IN");
              clearCart();
              setIsServiceMode(false);
            }}
          >
            <Text
              style={[styles.tabText, type === "IN" && styles.tabTextActive]}
            >
              <Ionicons name="arrow-down" size={16} /> Stok Masuk
            </Text>
          </TouchableOpacity>
        )}

        {(user?.role === "staf-kasir" || user?.role === "admin") && (
          <TouchableOpacity
            style={[styles.tabButton, type === "OUT" && styles.tabActiveRed]}
            onPress={() => {
              setType("OUT");
              clearCart();
            }}
          >
            <Text
              style={[styles.tabText, type === "OUT" && styles.tabTextActive]}
            >
              <Ionicons name="arrow-up" size={16} /> Penjualan
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            <Ionicons name="cart" size={20} /> Keranjang Transaksi
          </Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.length} item</Text>
          </View>
        </View>

        <Cart
          cart={cart}
          totalAmount={totalAmount}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onSubmitTransaction={handleSubmitTransaction}
          isSubmitting={isSubmitting}
          type={type}
        />
      </View>

      {/* Notes Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="document-text" size={18} /> Catatan Transaksi
        </Text>

        <TouchableOpacity
          style={styles.notesInput}
          onPress={() => setShowNotesModal(true)}
        >
          <Text style={notes ? styles.notesText : styles.notesPlaceholder}>
            {notes || "Tambahkan catatan transaksi (opsional)..."}
          </Text>
          <Ionicons name="create-outline" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Add Item/Service Form */}
      <TransactionForm
        items={items}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        quantity={quantity}
        setQuantity={setQuantity}
        type={type}
        isServiceMode={isServiceMode}
        setIsServiceMode={setIsServiceMode}
        serviceName={serviceName}
        setServiceName={setServiceName}
        servicePrice={servicePrice}
        setServicePrice={setServicePrice}
        onAddToCart={addToCart}
      />

      {/* Transaction History */}
      <TransactionHistory
        transactionGroups={transactionGroups}
        onRefresh={onRefresh}
        onGenerateInvoice={handleGenerateInvoice}
        isGeneratingPDF={isGeneratingPDF}
      />

      {/* Notes Modal */}
      <NotesModal
        visible={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        notes={notes}
        setNotes={setNotes}
      />
    </ScrollView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 16,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  roleText: {
    fontSize: 13,
    color: "#475569",
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  tabActiveGreen: {
    backgroundColor: "#16a34a",
  },
  tabActiveRed: {
    backgroundColor: "#dc2626",
  },
  tabText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
  tabTextActive: {
    color: "white",
  },

  // Cards
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  // Notes
  notesInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
  },
  notesText: {
    flex: 1,
    color: "#0f172a",
    fontSize: 14,
  },
  notesPlaceholder: {
    flex: 1,
    color: "#94a3b8",
    fontSize: 14,
  },

  // Transaction History
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
