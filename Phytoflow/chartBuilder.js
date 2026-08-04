// chartBuilder.js

import { Dimensions } from "react-native";

const screenWidth =
  Dimensions.get("window").width;

export const chartWidth =
  screenWidth - 40;

export const chartHeight = 240;

// =====================================
// CORES DOS GRÁFICOS
// =====================================

export const chartColors = {

  airTemp: "#e67e22",      // laranja

  leafTemp: "#2ecc71",     // verde

  humidity: "#3498db",     // azul

  soil: "#8e5b3a",         // marrom

  dpv: "#e74c3c",          // vermelho

  ctd: "#9b59b6",          // roxo

  sapFlow: "#16a085",      // verde água

  ks: "#f1c40f"            // amarelo
};

// =====================================
// CONFIG PADRÃO
// =====================================

export function buildLineChartConfig(
  color = "#2b6e35"
) {

  return {

    backgroundGradientFrom:
      "#ffffff",

    backgroundGradientTo:
      "#ffffff",

    decimalPlaces: 2,

    color: () => color,

    labelColor: () => "#213522",

    fillShadowGradient: color,

    fillShadowGradientOpacity: 0.15,

    propsForDots: {
      r: "4",
      strokeWidth: "1",
      stroke: color
    },

    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#dfe8df"
    }
  };
}

// =====================================
// GRÁFICO SIMPLES
// =====================================

export function buildLineChartData(
  labels,
  label,
  data,
  color = "#3498db"
) {

  return {

    labels,

    datasets: [
      {
        data,

        color: () => color,

        strokeWidth: 2
      }
    ],

    legend: [label]
  };
}

// =====================================
// MULTILINHA
// =====================================

export function buildMultiLineChartData(
  labels,
  datasetsObj
) {

  const colors = [
    chartColors.ks,
    chartColors.dpv,
    chartColors.ctd,
    chartColors.airTemp,
    chartColors.humidity,
    chartColors.soil,
    chartColors.sapFlow,
    chartColors.leafTemp
  ];

  const datasets =
    Object.keys(datasetsObj).map(
      (key, index) => ({

        data:
          datasetsObj[key],

        color: () =>
          colors[
            index %
            colors.length
          ],

        strokeWidth:
          key === "Limite"
            ? 1
            : 2
      })
    );

  return {

    labels,

    datasets,

    legend:
      Object.keys(
        datasetsObj
      )
  };
}

// =====================================
// HELPERS ESPECÍFICOS
// =====================================

export function createAirTempChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "Temperatura do Ar",
        values,
        chartColors.airTemp
      ),

    config:
      buildLineChartConfig(
        chartColors.airTemp
      )
  };
}

export function createLeafTempChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "Temperatura Foliar",
        values,
        chartColors.leafTemp
      ),

    config:
      buildLineChartConfig(
        chartColors.leafTemp
      )
  };
}

export function createHumidityChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "Umidade Relativa",
        values,
        chartColors.humidity
      ),

    config:
      buildLineChartConfig(
        chartColors.humidity
      )
  };
}

export function createSoilChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "Umidade do Solo",
        values,
        chartColors.soil
      ),

    config:
      buildLineChartConfig(
        chartColors.soil
      )
  };
}

export function createDPVChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "DPV",
        values,
        chartColors.dpv
      ),

    config:
      buildLineChartConfig(
        chartColors.dpv
      )
  };
}

export function createCTDChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "CTD",
        values,
        chartColors.ctd
      ),

    config:
      buildLineChartConfig(
        chartColors.ctd
      )
  };
}

export function createSapFlowChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "Fluxo de Seiva",
        values,
        chartColors.sapFlow
      ),

    config:
      buildLineChartConfig(
        chartColors.sapFlow
      )
  };
}

export function createKsChart(
  labels,
  values
) {

  return {
    data:
      buildLineChartData(
        labels,
        "Ks",
        values,
        chartColors.ks
      ),

    config:
      buildLineChartConfig(
        chartColors.ks
      )
  };
}
