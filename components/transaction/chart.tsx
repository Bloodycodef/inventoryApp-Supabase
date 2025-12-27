// app/transaction/components/Cart.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CartItem } from "../../type/transaction";

interface CartProps {
  cart: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onSubmitTransaction: () => void;
  isSubmitting: boolean;
  type: "IN" | "OUT";
}

export const Cart: React.FC<CartProps> = ({
  cart,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitTransaction,
  isSubmitting,
  type,
}) => {
  if (cart.length === 0) {
    return (
      <View style={styles.emptyCart}>
        <Ionicons name="cart-outline" size={48} color="#94a3b8" />
        <Text style={styles.emptyCartText}>Keranjang kosong</Text>
      </View>
    );
  }

  return (
    <View>
      {cart.map((item, index) => (
        <View key={index} style={styles.cartItem}>
          <View style={styles.cartItemLeft}>
            {item.is_service ? (
              <View style={styles.serviceIcon}>
                <Ionicons name="construct" size={16} color="#7c3aed" />
              </View>
            ) : (
              <View style={styles.itemIcon}>
                <Ionicons name="cube" size={16} color="#3b82f6" />
              </View>
            )}
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemType}>
                {item.is_service ? "Jasa Service" : "Sparepart"}
              </Text>
              <Text style={styles.cartItemPrice}>
                Rp {item.price.toLocaleString()} × {item.quantity}
              </Text>
            </View>
          </View>
          <View style={styles.cartItemRight}>
            <Text style={styles.cartItemSubtotal}>
              Rp {item.subtotal.toLocaleString()}
            </Text>
            <View style={styles.cartItemActions}>
              <TouchableOpacity
                onPress={() => onUpdateQuantity(index, item.quantity - 1)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={16} color="#dc2626" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => onUpdateQuantity(index, item.quantity + 1)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={16} color="#16a34a" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onRemoveItem(index)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.cartTotal}>
        <Text style={styles.totalLabel}>Total Transaksi:</Text>
        <Text style={styles.totalAmount}>
          Rp {totalAmount.toLocaleString()}
        </Text>
      </View>

      <View style={styles.cartActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={onClearCart}
        >
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
          <Text style={styles.clearButtonText}>Kosongkan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.submitButton]}
          onPress={onSubmitTransaction}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>
                {type === "IN" ? "Simpan Stok Masuk" : "Simpan Penjualan"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Copy styles from original file for Cart component
  emptyCart: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyCartText: {
    color: "#64748b",
    marginTop: 12,
    fontSize: 14,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cartItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: "600",
    color: "#0f172a",
    fontSize: 14,
    marginBottom: 2,
  },
  cartItemType: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 12,
    color: "#475569",
  },
  cartItemRight: {
    alignItems: "flex-end",
  },
  cartItemSubtotal: {
    fontWeight: "bold",
    color: "#16a34a",
    fontSize: 14,
    marginBottom: 8,
  },
  cartItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  quantityText: {
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
    fontSize: 14,
  },
  deleteButton: {
    padding: 6,
  },
  cartTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: "#f1f5f9",
  },
  totalLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#334155",
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#16a34a",
  },
  cartActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  clearButton: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  submitButton: {
    backgroundColor: "#16a34a",
  },
  clearButtonText: {
    color: "#dc2626",
    fontWeight: "600",
    fontSize: 14,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
