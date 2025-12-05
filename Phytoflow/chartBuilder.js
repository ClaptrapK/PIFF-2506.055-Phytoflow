import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export function buildLineChartConfig() {
  return {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#f4fff4",
    backgroundGradientTo: "#e3f6e3",
    decimalPlaces: 2,
    color: () => `#2b6e35`,
    labelColor: () => "#213522",
    strokeWidth: 2,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#2b6e35"
    }
  };
}

// LINE GRAPH (soil moisture, temperature, sap flow)
export function buildLineChartData(labels, datasetLabel, values) {
  return {
    labels,
    datasets: [
      {
        data: values,
        color: () => "#2b6e35",
        strokeWidth: 2
      }
    ],
    legend: [datasetLabel]
  };
}

// MULTI-DATASET GRAPH (example: sap flow + ET + humidity)
export function buildMultiLineChartData(labels, datasetsObj) {
  const datasets = Object.keys(datasetsObj).map((key) => ({
    data: datasetsObj[key],
    strokeWidth: 2
  }));

  return {
    labels,
    datasets,
    legend: Object.keys(datasetsObj)
  };
}

// BAR GRAPH (daily irrigation, rainfall)
export function buildBarChartData(labels, values, legend = ["Bar Data"]) {
  return {
    labels,
    datasets: [{ data: values }],
    legend
  };
}

export const chartWidth = screenWidth - 20;
export const chartHeight = 220;
