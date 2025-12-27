// app/home/types/index.ts
export interface Stats {
  totalItems: number;
  totalBarangMasuk: number;
  totalBarangKeluar: number;
  totalKeuntungan: number;
}

export interface LowStockItem {
  item_id: string;
  item_name: string;
  stock: number;
}

export interface Transaction {
  id: string;
  type: "masuk" | "keluar";
  date: string;
  total_items: number;
}

export interface ChartReportProps {
  labels: string[];
  barangMasuk: number[];
  barangKeluar: number[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export interface UserData {
  username: string;
  branch_name?: string;
}
