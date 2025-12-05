import React, { useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import RNHTMLtoPDF from "react-native-html-to-pdf";

import { generateAnalytics } from "analyticsBuilder";
import { chartWidth, chartHeight } from "chartBuilder";
import { Ionicons } from "@expo/vector-icons";

export default function AnalyticsScreen({ route }) {
  const screenshotRef = useRef();

  const { sensorData, soilParams } = route.params;

  const analytics = generateAnalytics(sensorData, soilParams);

  async function exportImage() {
    const uri = await screenshotRef.current.capture();
    await Sharing.shareAsync(uri);
  }

  async function exportPDF() {
    const htmlContent = `
      <h1>Relatório de Análise</h1>
      <p>Gerado automaticamente pelo sistema.</p>
      <img src="${await screenshotRef.current.capture()}" />
    `;

    const file = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: "AnalyticsReport",
      base64: true
    });

    await Sharing.shareAsync(file.filePath);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Análises e Gráficos</Text>

      <ViewShot ref={screenshotRef} options={{ format: "jpg", quality: 0.9 }}>
        {/* ■■■ Soil Moisture Chart ■■■ */}
        <Text style={styles.chartTitle}>Umidade do Solo</Text>
        <LineChart
          data={analytics.soilChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={analytics.soilChart.config}
          bezier
          style={styles.chart}
        />

        {/* ■■■ Temperature ■■■ */}
        <Text style={styles.chartTitle}>Temperatura</Text>
        <LineChart
          data={analytics.tempChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={analytics.tempChart.config}
          bezier
          style={styles.chart}
        />

        {/* ■■■ Sap Flow ■■■ */}
        <Text style={styles.chartTitle}>Fluxo de Seiva</Text>
        <LineChart
          data={analytics.sapChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={analytics.sapChart.config}
          bezier
          style={styles.chart}
        />

        {/* ■■■ Ks Stress Coefficient ■■■ */}
        <Text style={styles.chartTitle}>Coeficiente de Estresse (Ks)</Text>
        <LineChart
          data={analytics.KsChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={analytics.KsChart.config}
          bezier
          style={styles.chart}
        />

        {/* ■■■ Combined chart ■■■ */}
        <Text style={styles.chartTitle}>Visão Geral</Text>
        <LineChart
          data={analytics.combinedChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={analytics.combinedChart.config}
          bezier
          style={styles.chart}
        />
      </ViewShot>

      {/* Export Buttons */}
      <View style={{ marginBottom: 50 }}>
        <TouchableOpacity style={styles.btn} onPress={exportImage}>
          <Ionicons name="image" size={22} color="#fff" />
          <Text style={styles.btnText}>Exportar como Imagem</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={exportPDF}>
          <Ionicons name="document" size={22} color="#fff" />
          <Text style={styles.btnText}>Exportar como PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#eef7ee" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#2b6e35" },
  chartTitle: { fontSize: 16, fontWeight: "700", marginTop: 20, color: "#213522" },
  chart: { borderRadius: 12, marginTop: 6 },
  btn: {
    marginTop: 14,
    backgroundColor: "#2b6e35",
    padding: 14,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" }
});
