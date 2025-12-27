// app/items/components/ItemList.tsx
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Item } from "../../type/item";
import { ItemCard } from "./itemCard";

interface ItemListProps {
  items: Item[];
  isAdmin: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  isAdmin,
  refreshing,
  onRefresh,
  onEditItem,
  onDeleteItem,
}) => {
  const { width } = useWindowDimensions();

  const numColumns =
    width >= 1200 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1;

  return (
    <View style={styles.listContainer}>
      <Text style={styles.listHeader}>{items.length} item ditemukan</Text>

      <FlatList
        data={items}
        key={numColumns} // penting agar re-render saat kolom berubah
        numColumns={numColumns}
        keyExtractor={(item) => String(item.item_id)}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ItemCard
              item={item}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item)}
              isAdmin={isAdmin}
            />
          </View>
        )}
        ItemSeparatorComponent={() =>
          numColumns === 1 ? <View style={styles.separator} /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  listHeader: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 16,
  },
  separator: {
    height: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 6,
  },
});
