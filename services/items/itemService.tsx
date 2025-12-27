// app/items/services/itemService.ts
import { supabase } from "../../lib/supabase";
import { CreateItemData, Item, UpdateItemData } from "../../type/item";

export const itemService = {
  async fetchItems(branchId: string): Promise<Item[]> {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("branch_id", branchId)
      .order("item_name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createItem(item: CreateItemData, branchId: string): Promise<void> {
    const { error } = await supabase.from("items").insert({
      ...item,
      branch_id: branchId,
    });

    if (error) throw error;
  },

  async updateItem(itemId: string, updates: UpdateItemData): Promise<void> {
    const { error } = await supabase
      .from("items")
      .update({
        item_name: updates.item_name,
        description: updates.description,
        stock: Number(updates.stock),
        purchase_price: Number(updates.purchase_price),
        selling_price: Number(updates.selling_price),
      })
      .eq("item_id", itemId);

    if (error) throw error;
  },

  async deleteItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("item_id", itemId);

    if (error) throw error;
  },
};
