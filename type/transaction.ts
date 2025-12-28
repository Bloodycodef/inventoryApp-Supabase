// app/transaction/types.ts
export interface Item {
  item_id: string;
  item_name: string;
  stock: number;
  category?: string;
  purchase_price: number;
  price: string;
  selling_price: number;
}

export interface CartItem {
  item_id?: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  is_service?: boolean;
  description?: string;
}

export interface TransactionGroup {
  group_id: string;
  transaction_type: "IN" | "OUT";
  total_amount: number;
  transaction_date: string;
  username: string;
  notes?: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  transaction_id: string;
  item_id?: string;
  item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  is_service?: boolean;
  description?: string;
}
