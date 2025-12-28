// app/items/types/index.ts
export interface Item {
  item_id: string;
  item_name: string;
  description?: string;
  stock: number;
  category?: string;
  purchase_price: number;
  selling_price: number;
  branch_id?: string;
}

export interface ItemFormData {
  item_name: string;
  description: string;
  stock: string;
  purchase_price: string;
  selling_price: string;
}

export interface CreateItemData {
  item_name: string;
  description?: string;
  stock: number;
  purchase_price: number;
  selling_price: number;
}

export interface UpdateItemData {
  item_name: string;
  description?: string;
  stock: number;
  purchase_price: number;
  selling_price: number;
}
