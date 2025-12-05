import React, { useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Ionicons } from "@expo/vector-icons";

import { generateAnalytics } from "./analyticsBuilder";
import { chartWidth, chartHeight } from "./chartBuilder";

export default function AnalyticsScreen({ route }) {
  const shotRef = useRef();

  // If route.params not provided, use sample data so screen still renders
  const { sensorData = null, soilParams = null } = route?.params || {};

  const sampleData = [
    { timestamp: "2025-11-20 14:00", soilMoisture: "32", airTemp: "28", sapFlow: "2.4" },
    { timestamp: "2025-11-20 15:00", soilMoisture: "40", airTemp: "26", sapFlow: "1.9" },
    { timestamp: "2025-11-20 16:00", soilMoisture: "45", airTemp: "22", sapFlow: "2.0" },
    { timestamp: "2025-11-20 17:00", soilMoisture: "40", airTemp: "27", sapFlow: "2.2" }
  ];

  const sampleSoil = { thetaFC: 0.30, thetaWP: 0.10, rootDepth: 0.4, psto: 0.55 };

  const data = generateAnalytics(sensorData ?? sampleData, soilParams ?? sampleSoil);

  // Capture ViewShot and share as image
  const exportImage = async () => {
    try {
      const uri = await shotRef.current.capture();
      if (!uri) throw new Error("Could not capture image");
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Erro", err.message || "Falha ao exportar imagem");
    }
  };

  // Capture view, convert to HTML embedding the image (base64) and print to PDF via expo-print
  const exportPDF = async () => {
    try {
      const uri = await shotRef.current.capture({ result: "base64", format: "jpg", quality: 0.9 });
      if (!uri) throw new Error("Could not capture image");

      // uri is base64 string; create dataURL
      const dataUrl = `data:image/jpeg;base64,${uri}`;

      const html = `
        <html>
          <body>
            <h1>Relatório de Análise</h1>
            <p>Gerado automaticamente</p>
            <img src="${dataUrl}" style="max-width:100%;height:auto;" />
          </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html });
      if (!pdfUri) throw new Error("Falha ao gerar PDF");

      await Sharing.shareAsync(pdfUri);
    } catch (err) {
      Alert.alert("Erro", err.message || "Falha ao exportar PDF");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Análises e Gráficos</Text>

      <ViewShot ref={shotRef} options={{ format: "jpg", quality: 0.9 }}>
        <Text style={styles.chartTitle}>Umidade do Solo</Text>
        <LineChart
          data={data.soilChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={data.soilChart.config}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Temperatura</Text>
        <LineChart
          data={data.tempChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={data.tempChart.config}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Fluxo de Seiva</Text>
        <LineChart
          data={data.sapChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={data.sapChart.config}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Coeficiente de Estresse (Ks)</Text>
        <LineChart
          data={data.KsChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={data.KsChart.config}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Visão Geral</Text>
        <LineChart
          data={data.combinedChart.data}
          width={chartWidth}
          height={chartHeight}
          chartConfig={data.combinedChart.config}
          bezier
          style={styles.chart}
        />
      </ViewShot>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={exportImage}>
          <Ionicons name="image" size={20} color="#fff" />
          <Text style={styles.btnText}>Exportar Imagem</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={exportPDF}>
          <Ionicons name="document" size={20} color="#fff" />
          <Text style={styles.btnText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, backgroundColor: "#eef7ee" },
  title: { fontSize: 22, fontWeight: "800", color: "#2b6e35", marginBottom: 12 },
  chartTitle: { marginTop: 16, fontSize: 16, fontWeight: "700", color: "#213522" },
  chart: { borderRadius: 12, marginTop: 8 },
  buttons: { marginTop: 18, marginBottom: 60 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#2b6e35",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center"
  },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: 8 }
});
