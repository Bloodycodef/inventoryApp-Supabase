// app/items/index.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { EditItemModal } from "../../components/items/editItemModel";
import { AddItemModal } from "../../components/items/itemFormSection";
import { ItemList } from "../../components/items/itemList";
import { SearchBar } from "../../components/items/searchBar";
import { AccessWarning } from "../../components/shared/accessWarning";
import { EmptyState } from "../../components/shared/empetyState";
import { FloatingButton } from "../../components/shared/floatingButton";
import { Loading } from "../../components/shared/loading";
import { Text } from "../../components/shared/text";
import { useItems } from "../../hook/items/useitem";
import { Item, ItemFormData } from "../../type/item";
import { getSearchPlaceholder } from "../../utils/items/searchUtil";

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
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items berdasarkan pencarian
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.item_name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [fetchItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSubmitNewItem = async (formData: ItemFormData) => {
    try {
      // Validasi form
      if (!formData.item_name.trim()) {
        Alert.alert("Error", "Nama item harus diisi");
        return;
      }
      if (!formData.selling_price || Number(formData.selling_price) <= 0) {
        Alert.alert("Error", "Harga jual harus diisi dan lebih dari 0");
        return;
      }

      await handleCreateItem({
        item_name: formData.item_name,
        description: formData.description,
        stock: Number(formData.stock || 0),
        purchase_price: Number(formData.purchase_price) || 0,
        selling_price: Number(formData.selling_price),
      });

      Alert.alert("Berhasil", "Item berhasil ditambahkan!");
      setIsAddModalVisible(false);
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan");
      throw error;
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

  const HeaderComponent = (
    <View style={styles.headerContainer}>
      <AccessWarning isAdmin={isAdmin} />
      <SearchBar
        onSearch={handleSearch}
        placeholder={getSearchPlaceholder(items)}
        initialValue={searchQuery}
      />
    </View>
  );

  const EmptyStateComponent = () => {
    if (items.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <EmptyState isAdmin={isAdmin} />
        </View>
      );
    }

    if (filteredItems.length === 0 && searchQuery) {
      return (
        <View style={styles.noResultsContainer}>
          <MaterialCommunityIcons
            name="text-search"
            size={64}
            color="#CBD5E1"
          />
          <Text style={styles.noResultsTitle}>Tidak ada item yang cocok</Text>
          <Text style={styles.noResultsText}>
            Tidak ditemukan item dengan kata kunci "{searchQuery}"
          </Text>
        </View>
      );
    }
    return <></>;
  };

  return (
    <View style={styles.container}>
      <ItemList
        items={filteredItems}
        isAdmin={isAdmin}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEditItem={handleEdit}
        onDeleteItem={handleDelete}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={EmptyStateComponent()}
      />

      <EditItemModal
        visible={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleSaveEdit}
      />

      <AddItemModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleSubmitNewItem}
      />

      {isAdmin && (
        <FloatingButton
          isVisible={isAddModalVisible}
          onPress={() => setIsAddModalVisible(!isAddModalVisible)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyStateContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    paddingTop: 80,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
