import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { formatRupiah } from "../../helper/formatRupiah";
import { useItems } from "../../hook/useItem";

const COLORS = {
  background: "#F4F7F9",
  text: "#1F2937",
  textSecondary: "#6B7280",
  primary: "#007AFF",
  success: "#22C55E",
  danger: "#EF4444",
  card: "#FFFFFF",
  separator: "#E5E7EB",
};

export default function ItemPage() {
  const { items, loading, handleCreateItem, user } = useItems();
  const isAdmin = user?.role === "admin";

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async () => {
    if (!isAdmin) {
      Alert.alert("Akses Ditolak", "Hanya admin yang bisa menambah item.");
      return;
    }
    if (!itemName || !purchasePrice || !sellingPrice) {
      Alert.alert("Gagal", "Nama, Harga Beli, dan Harga Jual wajib diisi.");
      return;
    }

    try {
      await handleCreateItem({
        item_name: itemName,
        description,
        stock: Number(stock || 0),
        purchase_price: Number(purchasePrice),
        selling_price: Number(sellingPrice),
      });

      // Reset form
      setItemName("");
      setDescription("");
      setStock("");
      setPurchasePrice("");
      setSellingPrice("");
      setIsFormVisible(false);
    } catch (err: any) {
      Alert.alert("Gagal Menambah Item", err.message);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={[styles.stockText, item.stock < 10 && styles.lowStock]}>
          Stok: {item.stock}
        </Text>
      </View>
      <View style={styles.divider} />

      {item.description ? (
        <Text style={styles.itemDescription}>Desc: {item.description}</Text>
      ) : null}

      <View style={styles.itemDetailRow}>
        <MaterialCommunityIcons
          name="currency-usd"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text style={styles.priceLabel}>Beli:</Text>
        <Text style={styles.priceValue}>
          {formatRupiah(Number(item.purchase_price))}
        </Text>
      </View>

      <View style={styles.itemDetailRow}>
        <MaterialCommunityIcons
          name="trending-up"
          size={16}
          color={COLORS.success}
        />
        <Text style={styles.priceLabel}>Jual:</Text>
        <Text style={styles.sellingPriceValue}>
          {formatRupiah(Number(item.selling_price))}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.listHeaderContainer}>
        <Text style={styles.mainHeader}>📄 Daftar Item ({items.length})</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsFormVisible(!isFormVisible)}
          >
            <MaterialCommunityIcons
              name={
                isFormVisible ? "close-circle-outline" : "plus-circle-outline"
              }
              size={26}
              color={isFormVisible ? COLORS.danger : COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Form */}
      {isAdmin && isFormVisible && (
        <View style={styles.formCard}>
          <Text style={styles.formHeader}>📦 Tambah Item Baru</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Item *"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Deskripsi (opsional)"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Harga Beli *"
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Harga Jual *"
            value={sellingPrice}
            onChangeText={setSellingPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Tambah Item</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Daftar Item */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.item_id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={{ color: COLORS.textSecondary }}>
              Tidak ada item yang terdaftar.
            </Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  mainHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  toggleButton: {
    padding: 5,
  },
  formCard: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  formHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.text,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
    fontSize: 16,
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.card,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.text,
    flex: 1,
  },
  stockText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  lowStock: {
    color: COLORS.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
  },
  itemDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    marginRight: 4,
    width: 35,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  sellingPriceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.success,
  },
  emptyList: {
    alignItems: "center",
    padding: 30,
  },
});
