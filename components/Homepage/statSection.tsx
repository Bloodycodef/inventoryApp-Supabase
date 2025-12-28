// app/home/components/StatsSection.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatRupiah } from "../../helper/formatRupiah";
import { Stats } from "../../type/database";
import { StatCard } from "./statcard";

interface StatsSectionProps {
  stats: Stats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  headerSeparator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: -20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginHorizontal: -6,
    marginBottom: 12,
  },
});
