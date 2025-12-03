import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { InlineItemEditForm } from "../../components/items/InlineItemEditForm";
import { ItemCard } from "../../components/items/itemCard";
import { ItemForm } from "../../components/items/itemForm";
import { ItemHeader } from "../../components/items/itemHeader";
import { COLORS } from "../../constans/Color";
import { useItems } from "../../hook/useItem";

export default function ItemPage() {
  const navigation: any = useNavigation();

  const {
    items,
    loading,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    fetchItems,
    user,
  } = useItems();

  const isAdmin = user?.role === "admin";

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [inputs, setInputs] = useState({
    itemName: "",
    description: "",
    stock: "",
    purchasePrice: "",
    sellingPrice: "",
  });

  const handleRefresh = useCallback(async () => {
    await fetchItems();
  }, []);

  // CREATE ITEM
  const handleSubmit = async () => {
    const { itemName, purchasePrice, sellingPrice, description, stock } =
      inputs;

    if (!itemName || !purchasePrice || !sellingPrice)
      return Alert.alert(
        "Gagal",
        "Nama, Harga Beli, dan Harga Jual wajib diisi."
      );

    await handleCreateItem({
      item_name: itemName,
      description,
      stock: Number(stock || 0),
      purchase_price: Number(purchasePrice),
      selling_price: Number(sellingPrice),
    });

    setInputs({
      itemName: "",
      description: "",
      stock: "",
      purchasePrice: "",
      sellingPrice: "",
    });

    setIsFormVisible(false);
    Alert.alert("Berhasil", "Item berhasil ditambahkan!");
  };

  // DELETE ITEM
  const handleDelete = async (item: any) => {
    Alert.alert("Konfirmasi", `Hapus item "${item.item_name}"?`, [
      { text: "Batal" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await handleDeleteItem(item.item_id);
          Alert.alert("Berhasil", "Item berhasil dihapus.");
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ItemHeader
        itemsLength={items.length}
        isAdmin={isAdmin}
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
      />

      {isAdmin && isFormVisible && (
        <ItemForm
          {...inputs}
          {...Object.fromEntries(
            Object.keys(inputs).map((k) => [
              `set${k[0].toUpperCase() + k.slice(1)}`,
              (v: any) => setInputs((s) => ({ ...s, [k]: v })),
            ])
          )}
          handleSubmit={handleSubmit}
        />
      )}

      {/* LIST ITEM */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.item_id)}
        contentContainerStyle={{ padding: 20 }}
        onRefresh={handleRefresh}
        refreshing={false}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onEdit={() => setEditItem(item)} // buka modal edit
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      {/* EDIT MODAL */}
      <Modal visible={!!editItem} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              padding: 20,
              borderRadius: 14,
            }}
          >
            <InlineItemEditForm
              item={editItem}
              onCancel={() => setEditItem(null)}
              onSave={async (updated: any) => {
                await handleUpdateItem(editItem.item_id, updated);
                setEditItem(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
