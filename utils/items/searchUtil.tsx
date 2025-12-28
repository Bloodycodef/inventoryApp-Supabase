// app/utils/searchUtils.ts
import { Item } from "@/type/item";

export interface SearchFilters {
  query: string;
  category?: string;
  minStock?: number;
  maxStock?: number;
  sortBy?: "name" | "price" | "stock";
  sortOrder?: "asc" | "desc";
}

export const searchItems = (items: Item[], filters: SearchFilters): Item[] => {
  let results = [...items];

  // Filter berdasarkan query teks
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.item_name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
    );
  }

  // Filter berdasarkan kategori
  if (filters.category) {
    results = results.filter((item) => item.category === filters.category);
  }

  // Filter berdasarkan stok
  if (filters.minStock !== undefined) {
    results = results.filter((item) => item.stock >= filters.minStock!);
  }

  if (filters.maxStock !== undefined) {
    results = results.filter((item) => item.stock <= filters.maxStock!);
  }

  // Sorting
  if (filters.sortBy) {
    results.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "name":
          aValue = a.item_name.toLowerCase();
          bValue = b.item_name.toLowerCase();
          break;
        case "price":
          aValue = a.selling_price;
          bValue = b.selling_price;
          break;
        case "stock":
          aValue = a.stock;
          bValue = b.stock;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
  }

  return results;
};

// Fungsi untuk mengekstrak kategori unik dari items
export const extractCategories = (items: Item[]): string[] => {
  const categories = items
    .map((item) => item.category)
    .filter(Boolean) as string[];

  return [...new Set(categories)].sort();
};

// Fungsi untuk membuat placeholder pencarian yang informatif
export const getSearchPlaceholder = (items: Item[]): string => {
  if (items.length === 0) return "Tidak ada item untuk dicari";

  const categories = extractCategories(items);
  if (categories.length > 0) {
    return `Cari item (${categories.length} kategori tersedia)`;
  }

  return `Cari item (${items.length} item tersedia)`;
};
