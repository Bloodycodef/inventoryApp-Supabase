// app/items/components/ItemFormSection.tsx - Perbaikan styling
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../../components/shared/button";
import { Input } from "../../components/shared/input";
import { ItemFormData } from "../../type/item";

interface ItemFormSectionProps {
  isVisible: boolean;
  formData: ItemFormData;
  onClose: () => void;
  onFormChange: (key: keyof ItemFormData, value: string) => void;
  onSubmit: () => void;
}

export const ItemFormSection: React.FC<ItemFormSectionProps> = ({
  isVisible,
  formData,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  if (!isVisible) return null;

  const validateForm = (): boolean => {
    if (
      !formData.item_name ||
      !formData.purchase_price ||
      !formData.selling_price
    ) {
      Alert.alert("Error", "Nama, Harga Beli, dan Harga Jual wajib diisi.");
      return false;
    }

    if (
      isNaN(Number(formData.purchase_price)) ||
      Number(formData.purchase_price) <= 0
    ) {
      Alert.alert("Error", "Harga beli harus angka positif");
      return false;
    }

    if (
      isNaN(Number(formData.selling_price)) ||
      Number(formData.selling_price) <= 0
    ) {
      Alert.alert("Error", "Harga jual harus angka positif");
      return false;
    }

    if (
      formData.stock &&
      (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)
    ) {
      Alert.alert("Error", "Stok harus angka non-negatif");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <View style={styles.formTitleContainer}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={24}
            color="#3B82F6"
          />
          <Text style={styles.formTitle}>Tambah Item Baru</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContent}>
        <Input
          placeholder="Nama Item *"
          value={formData.item_name}
          onChangeText={(text) => onFormChange("item_name", text)}
          variant="filled"
          style={styles.input}
        />

        <Input
          placeholder="Deskripsi (opsional)"
          value={formData.description}
          onChangeText={(text) => onFormChange("description", text)}
          multiline
          numberOfLines={3}
          variant="filled"
          style={styles.input}
        />

        <Input
          placeholder="Stok (opsional)"
          value={formData.stock}
          onChangeText={(text) => onFormChange("stock", text)}
          keyboardType="numeric"
          variant="filled"
          style={styles.input}
        />

        <View style={styles.priceRow}>
          <View style={styles.priceInput}>
            <Input
              placeholder="Harga Beli *"
              value={formData.purchase_price}
              onChangeText={(text) => onFormChange("purchase_price", text)}
              keyboardType="numeric"
              variant="filled"
            />
          </View>
          <View style={styles.priceInput}>
            <Input
              placeholder="Harga Jual *"
              value={formData.selling_price}
              onChangeText={(text) => onFormChange("selling_price", text)}
              keyboardType="numeric"
              variant="filled"
            />
          </View>
        </View>

        <Button
          title="Tambah Item"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          style={styles.submitButton}
          icon="plus-circle"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  formTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  formContent: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  priceInput: {
    flex: 1,
  },
  submitButton: {
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});
