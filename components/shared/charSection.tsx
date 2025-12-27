// app/home/components/ChartSection.tsx
import React from "react";
import { StyleSheet, Text } from "react-native";
import { ChartReport } from "../../components/Homepage/cardReport";

interface ChartSectionProps {
  labels: string[];
  barangMasuk: number[];
  barangKeluar: number[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  labels,
  barangMasuk,
  barangKeluar,
}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>📈 Laporan Mingguan</Text>
      <ChartReport
        labels={labels}
        barangMasuk={barangMasuk}
        barangKeluar={barangKeluar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
});
