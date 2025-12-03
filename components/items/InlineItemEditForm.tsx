import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constans/Color";

export function InlineItemEditForm({ item, onSave, onCancel }: any) {
  const [itemName, setItemName] = useState(item.item_name);
  const [description, setDescription] = useState(item.description || "");
  const [stock, setStock] = useState(String(item.stock || "0"));
  const [purchasePrice, setPurchasePrice] = useState(
    String(item.purchase_price)
  );
  const [sellingPrice, setSellingPrice] = useState(String(item.selling_price));

  return (
    <View>
      <Text style={styles.title}>Edit Item</Text>

      <View style={styles.group}>
        <Text style={styles.label}>Nama Item</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Deskripsi</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          multiline
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Stok</Text>
        <TextInput
          style={styles.input}
          value={stock}
          keyboardType="numeric"
          onChangeText={setStock}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Harga Beli</Text>
        <TextInput
          style={styles.input}
          value={purchasePrice}
          keyboardType="numeric"
          onChangeText={setPurchasePrice}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Harga Jual</Text>
        <TextInput
          style={styles.input}
          value={sellingPrice}
          keyboardType="numeric"
          onChangeText={setSellingPrice}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() =>
          onSave({
            item_name: itemName,
            description,
            stock: Number(stock),
            purchase_price: Number(purchasePrice),
            selling_price: Number(sellingPrice),
          })
        }
      >
        <Text style={styles.saveText}>Simpan Perubahan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Batal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: COLORS.text,
  },
  group: {
    marginBottom: 12,
  },
  label: {
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.separator,
    padding: 12,
    borderRadius: 10,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
