import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constans/Color";
import { formatRupiah } from "../../helper/formatRupiah";

export function ItemCard({
  item,
  onEdit,
  onDelete,
  onPress,
}: {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
  onPress?: () => void; // dibuat opsional
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {item.item_name}
        </Text>

        {/* ACTION BUTTON */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity onPress={onEdit}>
            <MaterialCommunityIcons
              name="pencil"
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <MaterialCommunityIcons
              name="delete"
              size={22}
              color={COLORS.danger}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stok */}
      <Text
        style={{
          marginTop: 6,
          fontWeight: "600",
          color: item.stock < 10 ? COLORS.danger : COLORS.text,
        }}
      >
        Stok: {item.stock}
      </Text>

      {/* Description */}
      {item.description ? (
        <Text style={{ color: COLORS.textSecondary, marginTop: 6 }}>
          Desc: {item.description}
        </Text>
      ) : null}

      {/* Harga Beli */}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <MaterialCommunityIcons
          name="currency-usd"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text style={{ marginLeft: 8 }}>Beli:</Text>
        <Text style={{ fontWeight: "600" }}>
          {formatRupiah(Number(item.purchase_price))}
        </Text>
      </View>

      {/* Harga Jual */}
      <View style={{ flexDirection: "row", marginTop: 4 }}>
        <MaterialCommunityIcons
          name="trending-up"
          size={16}
          color={COLORS.success}
        />
        <Text style={{ marginLeft: 8 }}>Jual:</Text>
        <Text style={{ fontWeight: "600", color: COLORS.success }}>
          {formatRupiah(Number(item.selling_price))}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
