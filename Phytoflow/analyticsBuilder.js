import {
  buildLineChartData,
  buildMultiLineChartData,
  buildLineChartConfig
} from "./chartBuilder";

import {
  calcTAW,
  calcRootZoneDepletion,
  calcTopSoilDepletion
} from "./irrigationCalc";

import { checkHydricStress } from "./stressMonitor";

// ======================================================================
//  Single function that generates ALL irrigation charts + Ks curve
// ======================================================================
export function generateAnalytics(sensorData, soilParams) {
  // sensorData = array of objects like:
  // { timestamp, soilMoisture, airTemp, sapFlow }

  // soilParams = { thetaFC, thetaWP, rootDepth, porosity, psto }

  // extract time labels
  const labels = sensorData.map(i => i.timestamp.slice(11, 16)); // HH:mm

  // Soil moisture dataset
  const soilValues = sensorData.map(i => parseFloat(i.soilMoisture));

  // Temperature dataset
  const tempValues = sensorData.map(i => parseFloat(i.airTemp));

  // Sap flow dataset
  const sapValues = sensorData.map(i => parseFloat(i.sapFlow));

  // =====================================================
  // Calculate Ks (stress coefficient) for each timestamp
  // =====================================================
  const KsValues = sensorData.map(item => {
    const thetaCurrent = parseFloat(item.soilMoisture) / 100;

    const TAW = calcTAW(
      soilParams.thetaFC,
      soilParams.thetaWP,
      soilParams.rootDepth
    );

    const Dr = calcRootZoneDepletion(
      thetaCurrent,
      soilParams.thetaFC,
      soilParams.rootDepth
    );

    const DZtop = Dr; // assume top soil = same reading (if you want more accuracy I adjust)

    const result = checkHydricStress(Dr, DZtop, TAW, soilParams.psto);

    return result.Ks;
  });

  return {
    soilChart: {
      label: "Umidade",
      data: buildLineChartData(labels, "Umidade (%)", soilValues),
      config: buildLineChartConfig()
    },

    tempChart: {
      label: "Temperatura",
      data: buildLineChartData(labels, "Temperatura (°C)", tempValues),
      config: buildLineChartConfig()
    },

    sapChart: {
      label: "Fluxo de Seiva",
      data: buildLineChartData(labels, "Seiva (L/h)", sapValues),
      config: buildLineChartConfig()
    },

    KsChart: {
      label: "Ks (Coef. de Estresse)",
      data: buildLineChartData(labels, "Ks", KsValues),
      config: buildLineChartConfig()
    },

    // Multi-line combined chart example
    combinedChart: {
      label: "Visão Geral",
      data: buildMultiLineChartData(labels, {
        Umidade: soilValues,
        Temperatura: tempValues,
        Seiva: sapValues
      }),
      config: buildLineChartConfig()
    }
  };
}
