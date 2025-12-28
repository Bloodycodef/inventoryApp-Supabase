// components/items/itemCard.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Item } from "../../type/item";

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
  compactMode?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  isAdmin,
  compactMode = false,
}) => {
  // Format angka dengan titik sebagai pemisah ribuan
  const formatPrice = (price: number) => {
    return price?.toLocaleString("id-ID") || "0";
  };

  return (
    <View
      style={[
        styles.card,
        compactMode && styles.cardCompact,
        item.stock <= 3 && styles.lowStockCard,
      ]}
    >
      {/* HEADER: Nama Item dan Stok */}
      <View style={styles.headerRow}>
        <Text
          style={[styles.itemName, compactMode && styles.itemNameCompact]}
          numberOfLines={compactMode ? 1 : 2}
        >
          {item.item_name}
        </Text>

        <View
          style={[
            styles.stockContainer,
            item.stock <= 3 && styles.lowStockBadge,
            item.stock <= 0 && styles.outOfStockBadge,
          ]}
        >
          <MaterialCommunityIcons
            name={item.stock <= 3 ? "alert-circle" : "cube-outline"}
            size={compactMode ? 12 : 14}
            color={
              item.stock <= 0
                ? "#FFFFFF"
                : item.stock <= 3
                ? "#FFFFFF"
                : "#3B82F6"
            }
          />
          <Text
            style={[
              styles.stockText,
              item.stock <= 3 && styles.lowStockText,
              item.stock <= 0 && styles.outOfStockText,
              compactMode && styles.stockTextCompact,
            ]}
          >
            {item.stock}
          </Text>
        </View>
      </View>
      {/* HARGA: Beli dan Jual dalam satu baris */}
      <View style={[styles.pricesRow, compactMode && styles.pricesRowCompact]}>
        {/* Harga Beli */}
        <View style={styles.priceColumn}>
          <View style={styles.priceLabel}>
            <MaterialCommunityIcons
              name="arrow-down"
              size={compactMode ? 10 : 12}
              color="#DC2626"
            />
            <Text
              style={[
                styles.priceLabelText,
                compactMode && styles.priceLabelTextCompact,
              ]}
            >
              Beli
            </Text>
          </View>
          <Text
            style={[
              styles.purchasePrice,
              compactMode && styles.purchasePriceCompact,
            ]}
          >
            {formatPrice(item.purchase_price)}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Harga Jual */}
        <View style={styles.priceColumn}>
          <View style={styles.priceLabel}>
            <MaterialCommunityIcons
              name="arrow-up"
              size={compactMode ? 10 : 12}
              color="#16A34A"
            />
            <Text
              style={[
                styles.priceLabelText,
                compactMode && styles.priceLabelTextCompact,
              ]}
            >
              Jual
            </Text>
          </View>
          <Text
            style={[
              styles.sellingPrice,
              compactMode && styles.sellingPriceCompact,
            ]}
          >
            {formatPrice(item.selling_price)}
          </Text>
        </View>
      </View>

      {/* AKSI / STATUS */}
      {isAdmin ? (
        <View
          style={[
            styles.actionsContainer,
            compactMode && styles.actionsContainerCompact,
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={compactMode ? 14 : 16}
              color="#3B82F6"
            />
            {!compactMode && <Text style={styles.editButtonText}>Edit</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="trash-can"
              size={compactMode ? 14 : 16}
              color="#DC2626"
            />
            {!compactMode && <Text style={styles.deleteButtonText}>Hapus</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.readOnlyBadge}>
          <MaterialCommunityIcons
            name="eye"
            size={compactMode ? 10 : 12}
            color="#64748B"
          />
          {!compactMode && <Text style={styles.readOnlyText}>Hanya Lihat</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 12,
  },
  cardCompact: {
    padding: 8,
    minHeight: 90,
  },
  lowStockCard: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 6,
  },
  itemNameCompact: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Stok
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    minWidth: 40,
    justifyContent: "center",
  },
  lowStockBadge: {
    backgroundColor: "#FECACA",
  },
  outOfStockBadge: {
    backgroundColor: "#DC2626",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  stockTextCompact: {
    fontSize: 11,
  },
  lowStockText: {
    color: "#991B1B",
  },
  outOfStockText: {
    color: "#FFFFFF",
  },

  // Deskripsi
  description: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8,
    lineHeight: 16,
  },

  // Harga
  pricesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginBottom: 8,
  },
  pricesRowCompact: {
    paddingVertical: 6,
    marginBottom: 6,
  },
  priceColumn: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 2,
  },
  priceLabelText: {
    fontSize: 10,
    color: "#6B7280",
  },
  priceLabelTextCompact: {
    fontSize: 9,
  },
  purchasePrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
  },
  purchasePriceCompact: {
    fontSize: 12,
  },
  sellingPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
  },
  sellingPriceCompact: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },

  // Aksi
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  actionsContainerCompact: {
    gap: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
    gap: 4,
  },
  editButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  editButtonText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 12,
  },
  deleteButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 12,
  },

  // Read Only
  readOnlyBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  readOnlyText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "500",
  },
});
