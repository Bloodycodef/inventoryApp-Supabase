// app/home/hooks/useDashboardData.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { LowStockItem, Stats, Transaction } from "../../type/database";

export function useDashboardData() {
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    totalBarangMasuk: 0,
    totalBarangKeluar: 0,
    totalKeuntungan: 0,
  });
  const [weeklyMasuk, setWeeklyMasuk] = useState<number[]>(Array(7).fill(0));
  const [weeklyKeluar, setWeeklyKeluar] = useState<number[]>(Array(7).fill(0));
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Get user from supabase auth
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

      // Get user data + branch
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

      // Fetch all data in parallel for better performance
      const [
        itemsCountRes,
        masukRows,
        keluarRows,
        profitData,
        lowStockData,
        transactionsData,
      ] = await Promise.all([
        supabase
          .from("items")
          .select("*", { count: "exact", head: true })
          .eq("branch_id", branchId),
        supabase
          .from("transactions")
          .select("quantity")
          .eq("branch_id", branchId)
          .eq("transaction_type", "IN"),
        supabase
          .from("transactions")
          .select("quantity")
          .eq("branch_id", branchId)
          .eq("transaction_type", "OUT"),
        supabase
          .from("transactions")
          .select("transaction_type, total")
          .eq("branch_id", branchId),
        supabase
          .from("items")
          .select("item_id, item_name, stock")
          .lt("stock", 5)
          .eq("branch_id", branchId)
          .order("stock", { ascending: true }),
        supabase
          .from("transactions")
          .select(
            "transaction_id, transaction_type, quantity, transaction_date"
          )
          .eq("branch_id", branchId)
          .order("transaction_date", { ascending: false })
          .limit(10),
      ]);

      // Calculate stats
      const totalItems = itemsCountRes.count ?? 0;

      const totalBarangMasuk = (masukRows?.data ?? []).reduce(
        (sum, row) => sum + Number(row.quantity ?? 0),
        0
      );

      const totalBarangKeluar = (keluarRows?.data ?? []).reduce(
        (sum, row) => sum + Number(row.quantity ?? 0),
        0
      );

      const totalKeuntungan = (profitData?.data ?? []).reduce((sum, t: any) => {
        const val = Number(t.total ?? 0);
        return t.transaction_type === "OUT" ? sum + val : sum - val;
      }, 0);

      // Transform low stock data
      const lowStockItems: LowStockItem[] = (lowStockData?.data ?? []).map(
        (item: any) => ({
          item_id: String(item.item_id),
          item_name: item.item_name,
          stock: Number(item.stock ?? 0),
        })
      );

      // Transform transactions and calculate weekly data
      const weekIn = Array(7).fill(0);
      const weekOut = Array(7).fill(0);

      const mappedTransactions: Transaction[] = (
        transactionsData?.data ?? []
      ).map((t: any) => {
        const day = new Date(t.transaction_date).getDay();
        if (t.transaction_type === "IN") {
          weekIn[day] += Number(t.quantity || 0);
        } else {
          weekOut[day] += Number(t.quantity || 0);
        }

        return {
          id: String(t.transaction_id),
          type: t.transaction_type === "IN" ? "masuk" : "keluar",
          date: t.transaction_date,
          total_items: Number(t.quantity ?? 0),
        };
      });

      // Update state
      setStats({
        totalItems,
        totalBarangMasuk,
        totalBarangKeluar,
        totalKeuntungan,
      });
      setWeeklyMasuk(weekIn);
      setWeeklyKeluar(weekOut);
      setLowStock(lowStockItems);
      setTransactions(mappedTransactions);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setAuthLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
