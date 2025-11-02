// hook/useItem.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Item {
  item_id: string;
  item_name: string;
  description?: string;
  stock: number;
  purchase_price: number;
  selling_price: number;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();
      if (!sessionUser) return;

      const { data: userData } = await supabase
        .from("app_users")
        .select("*, branches(branch_id)")
        .eq("user_id", sessionUser.id)
        .single();

      setUser(userData);

      const { data: itemData, error } = await supabase
        .from("items")
        .select("*")
        .eq("branch_id", userData.branch_id)
        .order("item_name", { ascending: true });

      if (error) throw error;
      setItems(itemData ?? []);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateItem = async (item: Omit<Item, "item_id">) => {
    try {
      const { error } = await supabase.from("items").insert({
        ...item,
        branch_id: user?.branch_id ?? null,
      });
      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error("Error creating item:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, handleCreateItem, user };
}
