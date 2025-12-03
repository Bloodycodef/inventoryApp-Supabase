import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

interface Item {
  item_id: string;
  item_name: string;
  description?: string;
  stock: number;
  purchase_price: number;
  selling_price: number;
  branch_id?: string;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUsers] = useState<any>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();

      if (!sessionUser) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from("app_users")
        .select("*, branches(branch_id)")
        .eq("user_id", sessionUser.id)
        .single();

      setUsers(userData);

      if (!userData.branch_id) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: itemData, error } = await supabase
        .from("items")
        .select("*")
        .eq("branch_id", userData.branch_id)
        .order("item_name", { ascending: true });

      if (error) throw error;

      setItems(itemData ?? []);
    } catch (error) {
      console.log("error fetching items: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  //create item baru
  const handleCreateItem = async (item: Omit<Item, "item_id">) => {
    try {
      const { error } = await supabase.from("items").insert({
        ...item,
        branch_id: user?.branch_id ?? null,
      });

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.error("error creating new items", error);
      throw error;
    }
  };

  // UPDATE ITEM
  const handleUpdateItem = async (itemId: string, updates: Partial<Item>) => {
    try {
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

      await fetchItems();
    } catch (error) {
      console.log("Error updating item:", error);
      throw error;
    }
  };

  // DELETE ITEM
  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("item_id", itemId);

      if (error) throw error;

      await fetchItems();
    } catch (error) {
      console.log("Error deleting item:", error);
      throw error;
    }
  };

  //realtime listener
  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("realtime-items")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  return {
    items,
    loading,
    handleCreateItem,
    fetchItems,
    handleDeleteItem,
    handleUpdateItem,
    user,
  };
}
