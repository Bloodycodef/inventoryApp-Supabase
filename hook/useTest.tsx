import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Item {
  item_id: string;
  item_name: string;
  description?: string;
  stock: number;
  purchase_price: number;
  selling_price: number;
  branch_id?: string;
}

export function useTestRLSItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        // ❗ Query tanpa filter apapun — untuk menguji RLS
        const { data, error } = await supabase.from("items").select("*");

        if (error) {
          console.error("Error fetching all items:", error);
        }

        setItems(data ?? []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  return { items, loading };
}
