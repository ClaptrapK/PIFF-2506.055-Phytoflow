/*Soil Moisture*/
<View style={{ marginTop: 20 }}>
  <Text style={styles.sectionTitle}>Umidade do Solo (%)</Text>

  <LineChart
    data={buildLineChartData(
      ["14h", "15h", "16h", "17h"],
      "Soil Moisture",
      [32, 40, 45, 40]
    )}
    width={chartWidth}
    height={chartHeight}
    chartConfig={buildLineChartConfig()}
    bezier
    style={{ borderRadius: 12 }}
  />
</View>

/*Temperature Graph*/
<View style={{ marginTop: 20 }}>
  <Text style={styles.sectionTitle}>Temperatura (°C)</Text>

  <LineChart
    data={buildLineChartData(
      ["14h", "15h", "16h", "17h"],
      "Air Temp",
      [28, 26, 22, 27]
    )}
    width={chartWidth}
    height={chartHeight}
    chartConfig={buildLineChartConfig()}
    bezier
  />
</View>

/*Sap Flow Graph*/
<View style={{ marginTop: 20 }}>
  <Text style={styles.sectionTitle}>Fluxo de Seiva (L/h)</Text>

  <LineChart
    data={buildLineChartData(
      ["14h", "15h", "16h", "17h"],
      "Sap Flow",
      [2.4, 1.9, 2.0, 2.2]
    )}
    width={chartWidth}
    height={chartHeight}
    chartConfig={buildLineChartConfig()}
  />
</View>

/*Bar Chart for Daily Irrigation*/
<BarChart
  data={buildBarChartData(
    ["Seg", "Ter", "Qua", "Qui"],
    [10, 5, 12, 8],
    ["Irrigação (mm)"]
  )}
  width={chartWidth}
  height={chartHeight}
  chartConfig={buildLineChartConfig()}
  style={{ marginTop: 20, borderRadius: 12 }}
/>

/*single function */
export function generateIrrigationGraphs(sensorData)
