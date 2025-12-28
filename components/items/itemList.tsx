// components/items/itemList.tsx
import React, { ReactElement } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
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
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  isAdmin,
  refreshing,
  onRefresh,
  onEditItem,
  onDeleteItem,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const { width } = useWindowDimensions();

  // Optimasi jumlah kolom - lebih responsif
  const numColumns =
    width >= 1400
      ? 5
      : width >= 1100
      ? 4
      : width >= 768
      ? 3
      : width >= 480
      ? 2
      : 1;

  const renderItem = ({ item }: { item: Item }) => (
    <View
      style={[styles.cardWrapper, numColumns > 1 && styles.cardWrapperMulti]}
    >
      <ItemCard
        item={item}
        onEdit={() => onEditItem(item)}
        onDelete={() => onDeleteItem(item)}
        isAdmin={isAdmin}
        compactMode={numColumns > 1}
      />
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={items}
        key={`${numColumns}-${width}`}
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
        renderItem={renderItem}
        ItemSeparatorComponent={() =>
          numColumns === 1 ? <View style={styles.separator} /> : null
        }
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        // Pengaturan keyboard CRITICAL untuk pencarian
        keyboardShouldPersistTaps="always" // Ubah dari "handled" ke "always"
        keyboardDismissMode="on-drag" // Keyboard hilang saat scroll
        showsVerticalScrollIndicator={true}
        // Optimasi performance
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={false} // Ubah ke false untuk masalah keyboard
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 100,
    paddingTop: 8,
  },
  separator: {
    height: 6,
  },
  row: {
    justifyContent: "space-between",
    gap: 8,
  },
  cardWrapper: {
    flex: 1,
  },
  cardWrapperMulti: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
});
