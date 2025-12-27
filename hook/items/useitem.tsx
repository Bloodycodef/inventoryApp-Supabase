// app/items/hooks/useItems.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { itemService } from "../../services/items/itemService";
import { CreateItemData, Item, UpdateItemData } from "../../type/item";

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user: sessionUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!sessionUser) {
        setItems([]);
        return;
      }

      // Get user data with branch
      const { data: userData, error: userError } = await supabase
        .from("app_users")
        .select("*, branches(branch_id, branch_name)")
        .eq("user_id", sessionUser.id)
        .single();

      if (userError) throw userError;
      setUser(userData);

      // Fetch items for the branch
      if (userData?.branch_id) {
        const itemsData = await itemService.fetchItems(userData.branch_id);
        setItems(itemsData);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateItem = async (item: CreateItemData) => {
    if (!user?.branch_id) {
      throw new Error("Branch ID not found");
    }
    await itemService.createItem(item, user.branch_id);
    await fetchItems();
  };

  const handleUpdateItem = async (itemId: string, updates: UpdateItemData) => {
    await itemService.updateItem(itemId, updates);
    await fetchItems();
  };

  const handleDeleteItem = async (itemId: string) => {
    await itemService.deleteItem(itemId);
    await fetchItems();
  };

  // Realtime listener
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
    user,
    fetchItems,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
  };
};
