import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constans/Color";

export function ItemForm({
  itemName,
  description,
  stock,
  purchasePrice,
  sellingPrice,
  setItemName,
  setDescription,
  setStock,
  setPurchasePrice,
  setSellingPrice,
  handleSubmit,
}: any) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        📦 Tambah Item Baru
      </Text>

      <TextInput
        placeholder="Nama Item *"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        placeholder="Deskripsi"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Harga Beli *"
        value={purchasePrice}
        onChangeText={setPurchasePrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Harga Jual *"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Tambah Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
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
});
