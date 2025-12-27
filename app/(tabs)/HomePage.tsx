// app/home/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { LowStockList } from "../../components/Homepage/lowStockList";
import { TransactionList } from "../../components/Homepage/transactionList";
import { Button } from "../../components/shared/button";
import { ChartSection } from "../../components/shared/charSection";
import { Container } from "../../components/shared/container";
import { Loading } from "../../components/shared/loading";
import { StatsSection } from "../../components/shared/statSection";
import { Text } from "../../components/shared/text";
import { useDashboardData } from "../../hook/dashboardh/useDashboardData";

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
    return <Loading message="Memuat dashboard..." />;
  }

  if (!user) {
    return (
      <Container>
        <Text variant="error" style={styles.errorText}>
          Pengguna tidak ditemukan.
        </Text>
        <Button
          title="Kembali ke Login"
          onPress={() => router.replace("/auth/login")}
          variant="primary"
          style={styles.loginButton}
        />
      </Container>
    );
  }

  const sections = [
    {
      key: "summary",
      component: <StatsSection stats={stats} />,
    },
    {
      key: "chart",
      component: (
        <ChartSection
          labels={["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]}
          barangMasuk={weeklyMasuk}
          barangKeluar={weeklyKeluar}
        />
      ),
    },
    {
      key: "lowstock",
      component: <LowStockList items={lowStock} />,
    },
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
          colors={["#007AFF"]}
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
    backgroundColor: "#F4F7F9",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 10,
  },
});
