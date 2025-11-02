// hooks/useDashboardData.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { LowStockItem, Stats, Transaction } from "../type/database";

export function useDashboardData() {
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    totalBarangMasuk: 0,
    totalBarangKeluar: 0,
    totalKeuntungan: 0,
  });
  const [weeklyMasuk, setWeeklyMasuk] = useState<number[]>([]);
  const [weeklyKeluar, setWeeklyKeluar] = useState<number[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // ambil user dari supabase auth
      const {
        data: { user: sessionUser },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!sessionUser) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      // ambil data user + cabang
      const { data: userData, error: userDataErr } = await supabase
        .from("app_users")
        .select("*, branches(branch_name)")
        .eq("user_id", sessionUser.id)
        .single();

      if (userDataErr) throw userDataErr;

      setUser({
        ...userData,
        branch_name: userData?.branches?.branch_name ?? "-",
      });

      const branchId = userData?.branch_id ?? null;

      // total items
      const itemsCountRes = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("branch_id", branchId);
      const totalItems = itemsCountRes.count ?? 0;

      // total barang masuk
      const { data: masukRows } = await supabase
        .from("transactions")
        .select("quantity")
        .eq("branch_id", branchId)
        .eq("transaction_type", "IN");

      const totalBarangMasuk = (masukRows ?? []).reduce(
        (s, r) => s + Number((r as any).quantity ?? 0),
        0
      );

      // total barang keluar
      const { data: keluarRows } = await supabase
        .from("transactions")
        .select("quantity")
        .eq("branch_id", branchId)
        .eq("transaction_type", "OUT");

      const totalBarangKeluar = (keluarRows ?? []).reduce(
        (s, r) => s + Number((r as any).quantity ?? 0),
        0
      );

      // total keuntungan
      const { data: profitData } = await supabase
        .from("transactions")
        .select("transaction_type, total")
        .eq("branch_id", branchId);

      const totalKeuntungan = (profitData ?? []).reduce((sum, t: any) => {
        const val = Number(t.total ?? 0);
        if (t.transaction_type === "OUT") return sum + val;
        return sum - val;
      }, 0);

      // stok rendah
      const { data: lowStockData } = await supabase
        .from("items")
        .select("item_id, item_name, stock")
        .lt("stock", 5)
        .eq("branch_id", branchId)
        .order("stock", { ascending: true });

      // transaksi terbaru
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("transaction_id, transaction_type, quantity, transaction_date")
        .eq("branch_id", branchId)
        .order("transaction_date", { ascending: false })
        .limit(10);

      // Siapkan array untuk grafik mingguan
      const weekIn = Array(7).fill(0);
      const weekOut = Array(7).fill(0);

      // ✅ Sesuai interface Transaction
      const mappedTx: Transaction[] = (transactionsData ?? []).map((t: any) => {
        const day = new Date(t.transaction_date).getDay(); // 0..6
        if (t.transaction_type === "IN") {
          weekIn[day] += Number(t.quantity ?? 0);
        } else {
          weekOut[day] += Number(t.quantity ?? 0);
        }

        return {
          id: String(t.transaction_id),
          type: t.transaction_type === "IN" ? "masuk" : "keluar",
          date: t.transaction_date,
          total_items: Number(t.quantity ?? 0),
        };
      });

      // set semua state
      setStats({
        totalItems,
        totalBarangMasuk,
        totalBarangKeluar,
        totalKeuntungan,
      });
      setWeeklyMasuk(weekIn);
      setWeeklyKeluar(weekOut);
      setLowStock(
        (lowStockData ?? []).map((item: any) => ({
          item_id: String(item.item_id),
          item_name: item.item_name,
          stock: Number(item.stock ?? 0),
        }))
      );
      setTransactions(mappedTx);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    weeklyMasuk,
    weeklyKeluar,
    lowStock,
    transactions,
    loading,
    refreshing,
    setRefreshing,
    fetchData,
    user,
    authLoading,
  };
}
