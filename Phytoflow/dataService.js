// dataService.js

import { fetchSheetData } from "./GetSheetData";

// =======================================
// Formata data para DD/MM/YYYY HH:mm
// =======================================

function formatDate(rawDate) {

  if (!rawDate) return "";

  if (rawDate instanceof Date) {

    const d = rawDate;

    return `${String(d.getDate()).padStart(2,"0")}/${
      String(d.getMonth()+1).padStart(2,"0")
    }/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${
      String(d.getMinutes()).padStart(2,"0")}`;

  }

  if (typeof rawDate === "string") {

    if (rawDate.startsWith("Date(")) {

      const nums =
        rawDate.match(/\d+/g);

      if (nums) {

        const d =
          new Date(
            Number(nums[0]),
            Number(nums[1]),
            Number(nums[2]),
            Number(nums[3]),
            Number(nums[4]),
            Number(nums[5])
          );

        return formatDate(d);

      }

    }

    const d = new Date(rawDate);

    if (!isNaN(d))
      return formatDate(d);

    return rawDate;
  }

  return "";
}

// =======================================
// Fluxo de Seiva
// (temporário até vir da planilha)
// =======================================

function calcSapFlow(
  amp1,
  amp2,
  amp3,
  amp4
) {

  const amps = [
    amp1,
    amp2,
    amp3,
    amp4
  ].filter(v => v != null);

  if (amps.length === 0)
    return 0;

  const media =
    amps.reduce(
      (a,b)=>a+b,
      0
    ) / amps.length;

  return Math.abs(media);
}

// =======================================
// MAIN
// =======================================

export async function getSensorData() {

  const raw =
    await fetchSheetData();

  return raw.map(item => {

    const sapFlow =
      calcSapFlow(
        item.ampT1,
        item.ampT2,
        item.ampT3,
        item.ampT4
      );

    return {

      id: item.id,

      rawTimestamp:
        item.timestamp,

      timestamp:
        formatDate(
          item.timestamp
        ),

      //=========================
      // Dados Sensor
      //=========================

      soilMoisture:
        `${item.soilMoisture?.toFixed(1) ?? "--"}%`,

      airTemp:
        `${item.airTemp?.toFixed(1) ?? "--"}°C`,

      airHumidity:
        `${item.airHumidity?.toFixed(1) ?? "--"}%`,

      leafTemp:
        `${item.leafTemp?.toFixed(1) ?? "--"}°C`,

      pressure:
        `${item.pressure?.toFixed(1) ?? "--"} hPa`,

      //=========================
      // Fluxo de Seiva
      //=========================

      sapFlow:
        `${sapFlow.toFixed(3)}`,

      //=========================
      // Dados Calculados
      //=========================

      dpv:
        item.dpv,

      ctd:
        item.ctd,

      deltaSap:
        item.deltaSap,

      deltaCTD:
        item.deltaCTD,

      deltaDPV:
        item.deltaDPV,

      dpvSap:
        item.dpvSap,

      dpvCanopy:
        item.dpvCanopy,

      slope:
        item.slope,

      r2:
        item.r2,

      siSigma:
        item.siSigma,

      siHybrid:
        item.siHybrid,

      canopyInstant:
        item.canopyInstant,

      canopyDaily:
        item.canopyDaily,

      //=========================
      // Valores Numéricos
      //=========================

      soilMoistureValue:
        item.soilMoisture,

      airTempValue:
        item.airTemp,

      humidityValue:
        item.airHumidity,

      leafTempValue:
        item.leafTemp,

      pressureValue:
        item.pressure,

      sapFlowValue:
        sapFlow,

      dpvValue:
        item.dpv,

      ctdValue:
        item.ctd,

      deltaSapValue:
        item.deltaSap,

      deltaCTDValue:
        item.deltaCTD,

      deltaDPVValue:
        item.deltaDPV,

      dpvSapValue:
        item.dpvSap,

      dpvCanopyValue:
        item.dpvCanopy,

      slopeValue:
        item.slope,

      r2Value:
        item.r2,

      siSigmaValue:
        item.siSigma,

      siHybridValue:
        item.siHybrid,

      canopyInstantValue:
        item.canopyInstant,

      canopyDailyValue:
        item.canopyDaily
    };

  });

}
