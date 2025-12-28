// app/transaction/components/TransactionForm.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const searchInputRef = useRef<TextInput>(null);

  // Filter items berdasarkan search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // Get selected item details
  const getSelectedItem = () => {
    if (!selectedItem) return null;
    return items.find((i) => i.item_id === selectedItem);
  };

  const getSelectedItemLabel = () => {
    const item = getSelectedItem();
    if (!item) return "Pilih sparepart...";
    return `${item.item_name} (Stok: ${item.stock})`;
  };

  // Handle item selection
  const handleSelectItem = (itemId: string) => {
    setSelectedItem(itemId);
    setModalVisible(false);
    setSearchQuery("");
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedItem(null);
    setQuantity("");
  };

  // Focus search input when modal opens
  const handleOpenModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // Render item in list
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedItem === item.item_id && styles.selectedItemContainer,
      ]}
      onPress={() => handleSelectItem(item.item_id)}
    >
      <View style={styles.itemInfo}>
        <Text
          style={[
            styles.itemName,
            selectedItem === item.item_id && styles.selectedItemName,
          ]}
        >
          {item.item_name}
        </Text>
        {item.category && (
          <Text style={styles.itemCategory}>{item.category}</Text>
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>Stok: {item.stock}</Text>
          {item.price && (
            <Text style={styles.itemPrice}>
              Rp {parseInt(item.price).toLocaleString()}
            </Text>
          )}
        </View>
      </View>
      {selectedItem === item.item_id && (
        <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
      )}
    </TouchableOpacity>
  );

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

          {/* Selected Item Display */}
          {selectedItem && (
            <View style={styles.selectedItemDisplay}>
              <View style={styles.selectedItemContent}>
                <Ionicons name="cube-outline" size={20} color="#7c3aed" />
                <View style={styles.selectedItemTextContainer}>
                  <Text style={styles.selectedItemDisplayName}>
                    {getSelectedItem()?.item_name}
                  </Text>
                  <Text style={styles.selectedItemDisplayStock}>
                    Stok: {getSelectedItem()?.stock}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleClearSelection}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}

          {/* Item Selection Button */}
          <TouchableOpacity
            onPress={handleOpenModal}
            style={styles.pickerButton}
            activeOpacity={0.7}
          >
            <View style={styles.pickerButtonContent}>
              <Ionicons
                name={selectedItem ? "cube" : "search"}
                size={20}
                color={selectedItem ? "#7c3aed" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.pickerButtonText,
                  !selectedItem && styles.placeholderText,
                ]}
              >
                {selectedItem
                  ? "Ganti Sparepart"
                  : "Cari atau pilih sparepart..."}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>

          {/* Search Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setSearchQuery("");
            }}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Pilih Sparepart</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        setSearchQuery("");
                      }}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#64748b" />
                    </TouchableOpacity>
                  </View>

                  {/* Search Input */}
                  <View style={styles.searchContainer}>
                    <Ionicons
                      name="search"
                      size={20}
                      color="#94a3b8"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      ref={searchInputRef}
                      style={styles.searchInput}
                      placeholder="Cari sparepart..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {searchQuery !== "" && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery("")}
                        style={styles.clearSearchButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#94a3b8"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Results Info */}
                  <View style={styles.resultsInfo}>
                    <Text style={styles.resultsText}>
                      {filteredItems.length} item ditemukan
                    </Text>
                    {searchQuery !== "" && (
                      <Text style={styles.searchQueryText}>
                        untuk "{searchQuery}"
                      </Text>
                    )}
                  </View>

                  {/* Items List */}
                  <FlatList
                    data={filteredItems}
                    renderItem={renderItem}
                    extraData={items}
                    keyExtractor={(item) => item.item_id}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Ionicons
                          name="search-outline"
                          size={48}
                          color="#cbd5e1"
                        />
                        <Text style={styles.emptyText}>
                          Tidak ditemukan sparepart "{searchQuery}"
                        </Text>
                      </View>
                    }
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Text style={styles.label}>Jumlah:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan jumlah..."
            value={quantity}
            onChangeText={setQuantity}
            editable={!!selectedItem}
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              type === "IN" ? styles.inButton : styles.outButton,
              !selectedItem && styles.disabledButton,
            ]}
            onPress={onAddToCart}
            disabled={!selectedItem}
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
  disabledButton: {
    backgroundColor: "#cbd5e1",
    opacity: 0.7,
  },

  // Selected Item Display
  selectedItemDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3e8ff",
    borderWidth: 1,
    borderColor: "#ddd6fe",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  selectedItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  selectedItemTextContainer: {
    flex: 1,
  },
  selectedItemDisplayName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 2,
  },
  selectedItemDisplayStock: {
    fontSize: 12,
    color: "#64748b",
  },
  clearButton: {
    padding: 4,
  },

  // Picker Button
  pickerButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    height: 48,
  },
  pickerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  pickerButtonText: {
    fontSize: 14,
    color: "#0f172a",
  },
  placeholderText: {
    color: "#94a3b8",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  closeButton: {
    padding: 4,
  },

  // Search Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
  },
  searchIcon: {
    padding: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  clearSearchButton: {
    padding: 12,
  },

  // Results Info
  resultsInfo: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: "#64748b",
  },
  searchQueryText: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
  },

  // List Container
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Item Styles
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
  },
  selectedItemContainer: {
    backgroundColor: "#f3e8ff",
    borderColor: "#ddd6fe",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  selectedItemName: {
    color: "#7c3aed",
  },
  itemCategory: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontStyle: "italic",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetail: {
    fontSize: 12,
    color: "#64748b",
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16a34a",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});
