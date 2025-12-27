// app/transaction/components/TransactionForm.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Item } from "../../type/transaction";

interface TransactionFormProps {
  items: Item[];
  selectedItem: string | null;
  setSelectedItem: (value: string | null) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  type: "IN" | "OUT";
  isServiceMode: boolean;
  setIsServiceMode: (value: boolean) => void;
  serviceName: string;
  setServiceName: (value: string) => void;
  servicePrice: string;
  setServicePrice: (value: string) => void;
  onAddToCart: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  items,
  selectedItem,
  setSelectedItem,
  quantity,
  setQuantity,
  type,
  isServiceMode,
  setIsServiceMode,
  serviceName,
  setServiceName,
  servicePrice,
  setServicePrice,
  onAddToCart,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.formHeader}>
        <Text style={styles.cardTitle}>
          <Ionicons name="add-circle" size={18} /> Tambah Item
        </Text>

        {type === "OUT" && (
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isServiceMode ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setIsServiceMode(!isServiceMode)}
          >
            <Ionicons
              name={isServiceMode ? "cube-outline" : "construct-outline"}
              size={16}
              color={isServiceMode ? "#fff" : "#7c3aed"}
            />
            <Text
              style={[
                styles.toggleText,
                isServiceMode
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              {isServiceMode ? "Sparepart" : "Jasa"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isServiceMode ? (
        <>
          <Text style={styles.label}>Nama Jasa Service:</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Service rutin, ganti oli, tune up..."
            value={serviceName}
            onChangeText={setServiceName}
          />

          <Text style={styles.label}>Harga Jasa:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan harga jasa..."
            value={servicePrice}
            onChangeText={setServicePrice}
          />

          <TouchableOpacity
            style={[styles.addButton, styles.serviceButton]}
            onPress={onAddToCart}
          >
            <Ionicons name="construct" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Tambah Jasa Service</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Pilih Barang Sparepart:</Text>
          <View style={{ marginTop: 6 }}>
            <RNPickerSelect
              onValueChange={setSelectedItem}
              value={selectedItem}
              items={items.map((item) => ({
                label: `${item.item_name} (Stok: ${item.stock})`,
                value: item.item_id,
              }))}
              placeholder={{ label: "Pilih sparepart...", value: null }}
              style={{
                inputIOS: styles.dropdown,
                inputAndroid: styles.dropdown,
                placeholder: { color: "#94a3b8" },
              }}
            />
          </View>

          <Text style={styles.label}>Jumlah:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan jumlah..."
            value={quantity}
            onChangeText={setQuantity}
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              type === "IN" ? styles.inButton : styles.outButton,
            ]}
            onPress={onAddToCart}
          >
            <Ionicons
              name={type === "IN" ? "download" : "cart"}
              size={20}
              color="#fff"
            />
            <Text style={styles.addButtonText}>
              {type === "IN" ? "Tambah Stok" : "Tambah ke Keranjang"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Copy relevant styles from original file
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
  formHeader: {
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
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleActive: {
    backgroundColor: "#7c3aed",
  },
  toggleInactive: {
    backgroundColor: "#f3e8ff",
    borderWidth: 1,
    borderColor: "#7c3aed",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "white",
  },
  toggleTextInactive: {
    color: "#7c3aed",
  },
  label: {
    fontWeight: "600",
    color: "#334155",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontSize: 14,
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  inButton: {
    backgroundColor: "#16a34a",
  },
  outButton: {
    backgroundColor: "#dc2626",
  },
  serviceButton: {
    backgroundColor: "#7c3aed",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
