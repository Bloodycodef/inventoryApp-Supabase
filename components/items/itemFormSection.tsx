// components/items/AddItemModal.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { ItemFormData } from "../../type/item";
import { Input } from "../shared/input";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ItemFormData>({
    item_name: "",
    description: "",
    stock: "",
    purchase_price: "",
    selling_price: "",
  });

  const [loading, setLoading] = useState(false);
  const { height: screenHeight } = useWindowDimensions();

  const handleFormChange = (key: keyof ItemFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.item_name.trim()) {
      Alert.alert("Error", "Nama item harus diisi");
      return false;
    }

    if (!formData.selling_price || Number(formData.selling_price) <= 0) {
      Alert.alert("Error", "Harga jual harus diisi dan lebih dari 0");
      return false;
    }

    if (
      formData.purchase_price &&
      (isNaN(Number(formData.purchase_price)) ||
        Number(formData.purchase_price) < 0)
    ) {
      Alert.alert("Error", "Harga beli harus angka positif");
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit({
        item_name: formData.item_name.trim(),
        description: formData.description.trim(),
        stock: formData.stock || "0",
        purchase_price: formData.purchase_price || "0",
        selling_price: formData.selling_price,
      });

      // Reset form setelah sukses
      setFormData({
        item_name: "",
        description: "",
        stock: "",
        purchase_price: "",
        selling_price: "",
      });

      onClose();
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View
            style={[styles.modalContainer, { maxHeight: screenHeight * 0.8 }]}
          >
            {/* ===== HEADER ===== */}
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={24}
                  color="#3B82F6"
                />
                <Text style={styles.modalTitle}>Tambah Item Baru</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            {/* ===== BODY (SCROLLABLE) ===== */}
            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nama Item *</Text>
                <Input
                  placeholder="Masukkan nama item"
                  value={formData.item_name}
                  onChangeText={(text) => handleFormChange("item_name", text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Deskripsi (opsional)</Text>
                <Input
                  placeholder="Masukkan deskripsi"
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                  value={formData.description}
                  onChangeText={(text) => handleFormChange("description", text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Stok (opsional)</Text>
                <Input
                  placeholder="Masukkan stok"
                  keyboardType="numeric"
                  value={formData.stock}
                  onChangeText={(text) => handleFormChange("stock", text)}
                />
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceGroup}>
                  <Text style={styles.label}>Harga Beli (opsional)</Text>
                  <Input
                    placeholder="Masukkan harga beli"
                    keyboardType="numeric"
                    value={formData.purchase_price}
                    onChangeText={(text) =>
                      handleFormChange("purchase_price", text)
                    }
                  />
                </View>

                <View style={styles.priceGroup}>
                  <Text style={styles.label}>Harga Jual *</Text>
                  <Input
                    placeholder="Masukkan harga jual"
                    keyboardType="numeric"
                    value={formData.selling_price}
                    onChangeText={(text) =>
                      handleFormChange("selling_price", text)
                    }
                  />
                </View>
              </View>

              {/* ===== BUTTON ===== */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Menyimpan..." : "Tambah Item"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  keyboardAvoidingView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    minHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: "100%",
  },
  modalBody: {
    padding: 20,
    paddingBottom: 30,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
    color: "#374151",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  priceGroup: {
    flex: 1,
  },
  submitButton: {
    height: 48,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
