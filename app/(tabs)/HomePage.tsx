import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChartReport from "../../components/cardReport";
import LowStockList from "../../components/lowStockList";
import StatCard from "../../components/statcard";
import TransactionList from "../../components/transactionList";
import { formatRupiah } from "../../helper/formatRupiah";
import { useDashboardData } from "../../hook/useDashboardData";
import { supabase } from "../../lib/supabase";

const COLORS = {
  background: "#F4F7F9",
  text: "#1F2937",
  textSecondary: "#6B7280",
  primary: "#007AFF",
  danger: "#EF4444",
  card: "#FFFFFF",
  separator: "#E5E7EB",
};

const HomePage = () => {
  const router = useRouter();
  const {
    stats,
    weeklyMasuk,
    weeklyKeluar,
    lowStock,
    transactions,
    loading,
    refreshing,
    fetchData,
    setRefreshing,
    authLoading,
    user,
  } = useDashboardData();

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading || authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pengguna tidak ditemukan.</Text>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.buttonText}>Kembali ke Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔹 Semua konten kita jadikan satu list data (setiap section jadi item)
  const sections = [
    {
      key: "header",
      component: (
        <View style={styles.topBar}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>
              Selamat Datang,{" "}
              <Text style={styles.usernameText}>{user.username} 👋</Text>
            </Text>
            <Text style={styles.branchText}>
              Cabang: {user.branch_name ?? "Tidak diketahui"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace("/auth/login");
            }}
          >
            <MaterialCommunityIcons
              name="logout-variant"
              size={24}
              color={COLORS.danger}
            />
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: "summary",
      component: (
        <>
          <View style={styles.headerSeparator} />
          <Text style={styles.sectionTitle}>Ringkasan Inventaris</Text>

          <View style={styles.row}>
            <StatCard
              title="Total Item"
              value={stats.totalItems}
              icon="archive-outline"
            />
            <StatCard
              title="Item Masuk"
              value={stats.totalBarangMasuk}
              icon="arrow-bottom-left-thick"
            />
          </View>
          <View style={styles.row}>
            <StatCard
              title="Item Keluar"
              value={stats.totalBarangKeluar}
              icon="arrow-top-right-thick"
            />
            <StatCard
              title="Keuntungan"
              value={formatRupiah(stats.totalKeuntungan)}
              icon="cash-multiple"
            />
          </View>
        </>
      ),
    },
    {
      key: "chart",
      component: (
        <>
          <Text style={styles.sectionTitle}>📈 Laporan Mingguan</Text>
          <ChartReport
            labels={["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]}
            barangMasuk={weeklyMasuk}
            barangKeluar={weeklyKeluar}
          />
        </>
      ),
    },
    { key: "lowstock", component: <LowStockList items={lowStock} /> },
    {
      key: "transactions",
      component: <TransactionList transactions={transactions} />,
    },
    { key: "spacer", component: <View style={{ height: 40 }} /> },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => <View>{item.component}</View>}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    marginBottom: 20,
    textAlign: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 16,
  },
  userInfo: { flex: 1 },
  welcomeText: {
    fontSize: 20,
    fontWeight: "400",
    color: COLORS.text,
    marginBottom: 4,
  },
  usernameText: { fontWeight: "bold" },
  branchText: { fontSize: 14, color: COLORS.textSecondary },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    marginLeft: 16,
    elevation: 2,
  },
  headerSeparator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginHorizontal: -20,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", marginHorizontal: -6, marginBottom: 12 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
});
