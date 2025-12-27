// app/items/components/ItemCard.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Item } from "../../type/item";

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.itemName}>{item.item_name}</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>{item.stock} stok</Text>
            </View>
          </View>
          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : null}
        </View>

        <View style={styles.pricesContainer}>
          <View style={styles.priceColumn}>
            <View style={styles.priceLabelContainer}>
              <MaterialCommunityIcons
                name="cash-minus"
                size={16}
                color="#DC2626"
              />
              <Text style={styles.priceLabel}>Harga Beli</Text>
            </View>
            <Text style={styles.purchasePrice}>
              Rp {item.purchase_price?.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceColumn}>
            <View style={styles.priceLabelContainer}>
              <MaterialCommunityIcons
                name="cash-plus"
                size={16}
                color="#16A34A"
              />
              <Text style={styles.priceLabel}>Harga Jual</Text>
            </View>
            <Text style={styles.sellingPrice}>
              Rp {item.selling_price?.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        {isAdmin ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={onEdit}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#3B82F6" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={18}
                color="#DC2626"
              />
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.readOnlyBadge}>
            <MaterialCommunityIcons name="eye" size={14} color="#64748B" />
            <Text style={styles.readOnlyText}>Hanya Lihat</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
  },
  stockBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  pricesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  priceColumn: {
    flex: 1,
    alignItems: "center",
  },
  priceLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  purchasePrice: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "700",
  },
  sellingPrice: {
    fontSize: 16,
    color: "#16A34A",
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
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
    fontSize: 14,
  },
  deleteButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 14,
  },
  readOnlyBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  readOnlyText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
});
