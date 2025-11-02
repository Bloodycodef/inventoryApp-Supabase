// types/types.ts

// Barang stok rendah
export interface LowStockItem {
  item_id: string; // gunakan string supaya konsisten (UUID dari Supabase)
  item_name: string;
  stock: number;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
}

// Transaksi
export interface Transaction {
  id: string; // selalu string untuk UUID
  type: "masuk" | "keluar";
  date: string;
  total_items: number;
}

// Statistik dashboard
export interface DashboardStats {
  totalItems: number;
  totalBarangMasuk: number;
  totalBarangKeluar: number;
  totalKeuntungan: number;
}

// Data user login
export interface UserProfile {
  id: string;
  username: string;
  branch_name: string | null;
}

// Data lengkap dashboard (hook)
export interface DashboardData {
  stats: DashboardStats;
  weeklyMasuk: number[];
  weeklyKeluar: number[];
  lowStock: LowStockItem[];
  transactions: Transaction[];
  loading: boolean;
  refreshing: boolean;
  fetchData: () => void;
  setRefreshing: (value: boolean) => void;
  authLoading: boolean;
  user: UserProfile | null;
}

export interface ChartReportProps {
  labels: string[];
  barangMasuk: number[];
  barangKeluar: number[];
}

export interface LowStockListProps {
  items: LowStockItem[];
}

export interface TransactionListProps {
  transactions: Transaction[];
}

export type Stats = {
  totalItems: number;
  totalBarangMasuk: number;
  totalBarangKeluar: number;
  totalKeuntungan: number;
};

export type TransactionItem = {
  id: number;
  item_name?: string | null;
  transaction_type: "IN" | "OUT";
  transaction_date: string;
  quantity: number;
};
