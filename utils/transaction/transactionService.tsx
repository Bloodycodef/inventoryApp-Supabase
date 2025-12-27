// app/transaction/utils/transactionService.ts
import { supabase } from "../../lib/supabase";
import { CartItem, Item, TransactionGroup } from "../../type/transaction";

export const fetchItems = async (branch_id: string): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("item_id, item_name, stock, purchase_price, selling_price")
    .eq("branch_id", branch_id)
    .order("item_name", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    throw error;
  }

  return data || [];
};

export const fetchTransactionGroups = async (
  branch_id: string
): Promise<TransactionGroup[]> => {
  const { data, error } = await supabase
    .from("transaction_groups")
    .select(
      `
      group_id,
      transaction_type,
      total_amount,
      transaction_date,
      notes,
      app_users!inner(username),
      transactions!inner(
        transaction_id,
        item_id,
        quantity,
        price,
        subtotal,
        is_service,
        description,
        items!left(item_name)
      )
    `
    )
    .eq("branch_id", branch_id)
    .order("transaction_date", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }

  const formattedGroups: TransactionGroup[] = (data || []).map(
    (group: any) => ({
      group_id: group.group_id,
      transaction_type: group.transaction_type,
      total_amount: group.total_amount,
      transaction_date: group.transaction_date,
      notes: group.notes,
      username: group.app_users?.username || "Unknown",
      items: group.transactions.map((tx: any) => ({
        transaction_id: tx.transaction_id,
        item_id: tx.item_id,
        item_name: tx.items?.item_name || tx.description || "Jasa Service",
        quantity: tx.quantity,
        price: tx.price,
        subtotal: tx.subtotal,
        is_service: tx.is_service || false,
        description: tx.description,
      })),
    })
  );

  return formattedGroups;
};

export const submitTransaction = async (
  user: any,
  type: "IN" | "OUT",
  cart: CartItem[],
  totalAmount: number,
  notes: string,
  items: Item[]
): Promise<TransactionGroup> => {
  // 1. Create transaction group
  const { data: groupData, error: groupError } = await supabase
    .from("transaction_groups")
    .insert({
      branch_id: user.branch_id,
      user_id: user.user_id,
      transaction_type: type,
      total_amount: totalAmount,
      notes: notes || null,
    })
    .select()
    .single();

  if (groupError) {
    console.error("Group insert error:", groupError);
    throw new Error(`Gagal membuat grup transaksi: ${groupError.message}`);
  }

  // 2. Prepare and insert transaction items
  const transactionItems = [];

  for (const cartItem of cart) {
    const baseData: any = {
      group_id: groupData.group_id,
      quantity: cartItem.quantity,
      price: cartItem.price,
      subtotal: cartItem.subtotal,
      branch_id: user.branch_id,
      transaction_type: type,
      user_id: user.user_id,
      is_service: cartItem.is_service || false,
    };

    if (cartItem.is_service) {
      transactionItems.push({
        ...baseData,
        item_id: null,
        description: cartItem.description || cartItem.name,
      });
    } else {
      transactionItems.push({
        ...baseData,
        item_id: cartItem.item_id,
        description: null,
      });

      // Update item stock
      const item = items.find((i) => i.item_id === cartItem.item_id);
      if (item) {
        const newStock =
          type === "IN"
            ? item.stock + cartItem.quantity
            : item.stock - cartItem.quantity;

        const { error: stockError } = await supabase
          .from("items")
          .update({ stock: newStock })
          .eq("item_id", cartItem.item_id);

        if (stockError) {
          console.error(
            "Stock update error for item",
            cartItem.item_id,
            stockError
          );
        }
      }
    }
  }

  // 3. Insert all transaction items
  const { error: txError } = await supabase
    .from("transactions")
    .insert(transactionItems);

  if (txError) {
    console.error("Transaction insert error:", txError);
    throw new Error(`Gagal menyimpan item transaksi: ${txError.message}`);
  }

  return {
    group_id: groupData.group_id,
    transaction_type: type,
    total_amount: totalAmount,
    transaction_date: new Date().toISOString(),
    username: user.username || "Kasir",
    notes: notes,
    items: cart.map((item, index) => ({
      transaction_id: `temp_${index}`,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
      is_service: item.is_service || false,
      description: item.description,
    })),
  };
};
