// app/items/index.tsx
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { EditItemModal } from "../../components/items/editItemModel";
import { ItemFormSection } from "../../components/items/itemFormSection";
import { ItemList } from "../../components/items/itemList";
import { AccessWarning } from "../../components/shared/accessWarning";
import { EmptyState } from "../../components/shared/empetyState";
import { FloatingButton } from "../../components/shared/floatingButton";
import { Loading } from "../../components/shared/loading";
import { useItems } from "../../hook/items/useitem";
import { Item, ItemFormData } from "../../type/item";

export default function ItemPage() {
  const {
    items,
    loading,
    user,
    fetchItems,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
  } = useItems();

  const isAdmin = user?.role === "admin";
  const [refreshing, setRefreshing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    item_name: "",
    description: "",
    stock: "",
    purchase_price: "",
    selling_price: "",
  });

  // Debug: Cek apakah user admin
  console.log("User Role:", user?.role);
  console.log("Is Admin:", isAdmin);
  console.log("User Data:", user);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [fetchItems]);

  const handleFormChange = (key: keyof ItemFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await handleCreateItem({
        item_name: formData.item_name,
        description: formData.description,
        stock: Number(formData.stock || 0),
        purchase_price: Number(formData.purchase_price),
        selling_price: Number(formData.selling_price),
      });

      setFormData({
        item_name: "",
        description: "",
        stock: "",
        purchase_price: "",
        selling_price: "",
      });

      setIsFormVisible(false);
      Alert.alert("Berhasil", "Item berhasil ditambahkan!");
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (item: Item) => {
    if (!isAdmin) {
      Alert.alert("Akses Ditolak", "Hanya admin yang bisa menghapus item");
      return;
    }

    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus item "${item.item_name}"?\n\nTindakan ini tidak dapat dibatalkan dan akan mempengaruhi data transaksi terkait.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await handleDeleteItem(item.item_id);
              Alert.alert("Berhasil", "Item berhasil dihapus.");
            } catch (error: any) {
              Alert.alert("Gagal", error.message || "Gagal menghapus item");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (item: Item) => {
    if (!isAdmin) {
      Alert.alert("Akses Ditolak", "Hanya admin yang bisa mengedit item");
      return;
    }
    setEditItem(item);
  };

  const handleSaveEdit = async (updates: any) => {
    try {
      if (!editItem) return;
      await handleUpdateItem(editItem.item_id, updates);
      Alert.alert("Berhasil", "Item berhasil diperbarui");
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Gagal mengupdate item");
      throw error;
    }
  };

  if (loading) {
    return <Loading message="Memuat data..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.content}>
        <AccessWarning isAdmin={isAdmin} />

        <ItemFormSection
          isVisible={isFormVisible}
          formData={formData}
          onClose={() => setIsFormVisible(false)}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />

        {items.length === 0 ? (
          <EmptyState isAdmin={isAdmin} />
        ) : (
          <ItemList
            items={items}
            isAdmin={isAdmin}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEditItem={handleEdit}
            onDeleteItem={handleDelete}
          />
        )}

        <EditItemModal
          visible={!!editItem}
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSaveEdit}
        />
      </View>

      {/* Floating Button - harus di luar View utama agar position: absolute berfungsi */}
      {isAdmin && (
        <FloatingButton
          isVisible={isFormVisible}
          onPress={() => setIsFormVisible(!isFormVisible)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
});
