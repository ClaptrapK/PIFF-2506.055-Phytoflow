// analyticsBuilder.js

import {
  buildLineChartData,
  buildLineChartConfig
} from "./chartBuilder";

// =====================================
// Util
// =====================================

function number(value) {

  if (value == null) return 0;

  if (typeof value === "number")
    return value;

  return (
    parseFloat(
      String(value).replace(",", ".")
    ) || 0
  );

}

// =====================================
// Status baseado no SI Híbrido
// =====================================

function getStressStatus(si) {

  if (si <= 0.30)
    return "Sem Stress";

  if (si <= 0.60)
    return "Stress Moderado";

  return "Stress Severo";

}

// =====================================
// Main
// =====================================

export function generateAnalytics(sensorData) {

  if (!sensorData || sensorData.length === 0) {

    return {

      current: {},
      status: "Sem dados"

    };

  }

  // ordena cronologicamente

  const data =
    [...sensorData].sort(

      (a,b)=>

        new Date(a.rawTimestamp) -
        new Date(b.rawTimestamp)

    );

  // Labels

  const labels =
    data.map(item => {

      if (!item.timestamp)
        return "";

      const split =
        item.timestamp.split(" ");

      return split.length > 1
        ? split[1].substring(0,5)
        : item.timestamp;

    });

  // Último registro

  const current =
    data[data.length-1];

  //====================================
  // Dashboard
  //====================================

  const dashboard = {

    airTemp:
      number(current.airTempValue).toFixed(1),

    soil:
      number(current.soilMoistureValue).toFixed(1),

    humidity:
      number(current.humidityValue).toFixed(1),

    dpv:
      number(current.dpvValue).toFixed(3),

    ctd:
      number(current.ctdValue).toFixed(3),

    sapFlow:
      number(current.sapFlowValue).toFixed(3),

    deltaSap:
      number(current.deltaSapValue).toFixed(3),

    deltaDPV:
      number(current.deltaDPVValue).toFixed(3),

    deltaCTD:
      number(current.deltaCTDValue).toFixed(3),

    siSigma:
      number(current.siSigmaValue).toFixed(3),

    siHybrid:
      number(current.siHybridValue).toFixed(3),

    r2:
      number(current.r2Value).toFixed(3)

  };

  return {

    current: dashboard,

    status:
      getStressStatus(
        number(current.siHybridValue)
      ),

    //----------------------------------
    // Umidade Solo
    //----------------------------------

    soilChart:{

      data:buildLineChartData(

        labels,

        "Umidade",

        data.map(i=>
          number(i.soilMoistureValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Umidade Ar
    //----------------------------------

    humidityChart:{

      data:buildLineChartData(

        labels,

        "Umidade",

        data.map(i=>
          number(i.humidityValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Temperatura Ar
    //----------------------------------

    tempChart:{

      data:buildLineChartData(

        labels,

        "Temperatura",

        data.map(i=>
          number(i.airTempValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Temperatura Folha
    //----------------------------------

    leafChart:{

      data:buildLineChartData(

        labels,

        "Folha",

        data.map(i=>
          number(i.leafTempValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // DPV
    //----------------------------------

    dpvChart:{

      data:buildLineChartData(

        labels,

        "DPV",

        data.map(i=>
          number(i.dpvValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // CTD
    //----------------------------------

    ctdChart:{

      data:buildLineChartData(

        labels,

        "CTD",

        data.map(i=>
          number(i.ctdValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Fluxo Seiva
    //----------------------------------

    sapFlowChart:{

      data:buildLineChartData(

        labels,

        "Fluxo",

        data.map(i=>
          number(i.sapFlowValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Delta Sap
    //----------------------------------

    deltaSapChart:{

      data:buildLineChartData(

        labels,

        "ΔSap",

        data.map(i=>
          number(i.deltaSapValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Delta CTD
    //----------------------------------

    deltaCTDChart:{

      data:buildLineChartData(

        labels,

        "ΔCTD",

        data.map(i=>
          number(i.deltaCTDValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Delta DPV
    //----------------------------------

    deltaDPVChart:{

      data:buildLineChartData(

        labels,

        "ΔDPV",

        data.map(i=>
          number(i.deltaDPVValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // DPV Sap
    //----------------------------------

    dpvSapChart:{

      data:buildLineChartData(

        labels,

        "DPV Sap",

        data.map(i=>
          number(i.dpvSapValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // DPV Canopy
    //----------------------------------

    dpvCanopyChart:{

      data:buildLineChartData(

        labels,

        "DPV Canopy",

        data.map(i=>
          number(i.dpvCanopyValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // SI Sigma
    //----------------------------------

    siSigmaChart:{

      data:buildLineChartData(

        labels,

        "SI Sigma",

        data.map(i=>
          number(i.siSigmaValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // SI Híbrido
    //----------------------------------

    siHybridChart:{

      data:buildLineChartData(

        labels,

        "SI Híbrido",

        data.map(i=>
          number(i.siHybridValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // R²
    //----------------------------------

    r2Chart:{

      data:buildLineChartData(

        labels,

        "R²",

        data.map(i=>
          number(i.r2Value)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Canopy Instantâneo
    //----------------------------------

    canopyInstantChart:{

      data:buildLineChartData(

        labels,

        "Canopy",

        data.map(i=>
          number(i.canopyInstantValue)
        )

      ),

      config:buildLineChartConfig()

    },

    //----------------------------------
    // Canopy Diário
    //----------------------------------

    canopyDailyChart:{

      data:buildLineChartData(

        labels,

        "Canopy Diário",

        data.map(i=>
          number(i.canopyDailyValue)
        )

      ),

      config:buildLineChartConfig()

    }

  };

}
