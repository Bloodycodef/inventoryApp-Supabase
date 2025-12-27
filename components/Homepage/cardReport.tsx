// app/components/dashboard/ChartReport.tsx
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartReportProps } from "../../type/home";
const COLORS = {
  text: "#1F2937",
  success: "#22C55E",
  danger: "#EF4444",
  card: "#FFFFFF",
  graphLabel: "#6B7280",
};

export const ChartReport: React.FC<ChartReportProps> = ({
  labels,
  barangMasuk,
  barangKeluar,
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 40 - 32;

  const data = {
    labels,
    datasets: [
      {
        data: barangMasuk,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: barangKeluar,
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={styles.card}>
      <LineChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={{
          backgroundColor: COLORS.card,
          backgroundGradientFrom: COLORS.card,
          backgroundGradientTo: COLORS.card,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => COLORS.graphLabel,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#EEE",
          },
        }}
        bezier
        style={{ borderRadius: 8 }}
      />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.success }]}
          />
          <Text style={styles.legendText}>Barang Masuk</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.danger }]}
          />
          <Text style={styles.legendText}>Barang Keluar</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: COLORS.text,
  },
});
