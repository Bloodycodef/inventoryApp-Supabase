import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "../../components/shared/input";
import { Item } from "../../type/item";

interface EditItemModalProps {
  visible: boolean;
  item: Item | null;
  onClose: () => void;
  onSave: (updates: any) => Promise<void>;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    stock: "0",
    purchase_price: "0",
    selling_price: "0",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || "",
        description: item.description || "",
        stock: item.stock?.toString() || "0",
        purchase_price: item.purchase_price?.toString() || "0",
        selling_price: item.selling_price?.toString() || "0",
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    try {
      setLoading(true);

      await onSave({
        item_name: formData.item_name.trim(),
        description: formData.description.trim(),
        stock: Number(formData.stock),
        purchase_price: Number(formData.purchase_price),
        selling_price: Number(formData.selling_price),
      });

      onClose();
    } catch (e) {
      alert("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* ===== HEADER ===== */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* ===== BODY (SCROLLABLE) ===== */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nama Item *</Text>
                <Input
                  value={formData.item_name}
                  onChangeText={(v) =>
                    setFormData((p) => ({ ...p, item_name: v }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Deskripsi</Text>
                <Input
                  multiline
                  value={formData.description}
                  onChangeText={(v) =>
                    setFormData((p) => ({ ...p, description: v }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Stok</Text>
                <Input
                  keyboardType="numeric"
                  value={formData.stock}
                  onChangeText={(v) => setFormData((p) => ({ ...p, stock: v }))}
                />
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceGroup}>
                  <Text style={styles.label}>Harga Beli</Text>
                  <Input
                    keyboardType="numeric"
                    value={formData.purchase_price}
                    onChangeText={(v) =>
                      setFormData((p) => ({ ...p, purchase_price: v }))
                    }
                  />
                </View>

                <View style={styles.priceGroup}>
                  <Text style={styles.label}>Harga Jual</Text>
                  <Input
                    keyboardType="numeric"
                    value={formData.selling_price}
                    onChangeText={(v) =>
                      setFormData((p) => ({ ...p, selling_price: v }))
                    }
                  />
                </View>
              </View>

              {/* ===== BUTTON ===== */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  loading && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "90%",
    overflow: "hidden",
    alignSelf: "stretch",
  },
  modalHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalBody: {
    padding: 20,
    paddingBottom: 40, // ⬅️ penting biar tombol tidak ketutup
  },
  formGroup: {
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },
  priceGroup: {
    flex: 1,
  },
  saveButton: {
    height: 52,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
