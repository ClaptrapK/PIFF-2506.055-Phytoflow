const RAW_URL =
  "https://docs.google.com/spreadsheets/d/1drlmMzdqJb7Yk94EpX-Iyx_tEcYh6sRz78gFEmPG6qY/gviz/tq?tqx=out:json&sheet=Dados_700";

const CALC_URL =
  "https://docs.google.com/spreadsheets/d/1drlmMzdqJb7Yk94EpX-Iyx_tEcYh6sRz78gFEmPG6qY/gviz/tq?tqx=out:json&sheet=Dados_Calc";

function parseGoogle(text) {
  return JSON.parse(text.substring(47).slice(0, -2));
}

function value(cell) {
  return cell?.v ?? null;
}

function toNumber(v) {
  if (v == null) return null;

  if (typeof v === "number") return v;

  return Number(
    String(v)
      .replace(",", ".")
      .trim()
  );
}

export async function fetchSheetData() {
  try {

    const [rawResponse, calcResponse] =
      await Promise.all([
        fetch(RAW_URL),
        fetch(CALC_URL)
      ]);

    const rawText = await rawResponse.text();
    const calcText = await calcResponse.text();

    const rawRows =
      parseGoogle(rawText).table.rows;

    const calcRows =
      parseGoogle(calcText).table.rows;

    const calcMap = {};

    //==============================
    // Dados Calculados
    //==============================

    calcRows.forEach((row) => {

      const timestamp =
        value(row.c[0]);

      calcMap[timestamp] = {

        // Dados do script

        ctd:
          toNumber(
            value(row.c[13])
          ),

        dpv:
          toNumber(
            value(row.c[14])
          ),

        deltaSap:
          toNumber(
            value(row.c[15])
          ),

        deltaCTD:
          toNumber(
            value(row.c[16])
          ),

        deltaDPV:
          toNumber(
            value(row.c[17])
          ),

        dpvSap:
          toNumber(
            value(row.c[18])
          ),

        dpvCanopy:
          toNumber(
            value(row.c[19])
          ),

        slope:
          toNumber(
            value(row.c[20])
          ),

        r2:
          toNumber(
            value(row.c[21])
          ),

        siSigma:
          toNumber(
            value(row.c[22])
          ),

        siHybrid:
          toNumber(
            value(row.c[23])
          ),

        canopyInstant:
          toNumber(
            value(row.c[24])
          ),

        canopyDaily:
          toNumber(
            value(row.c[25])
          )
      };

    });

    //==============================
    // Junta as duas planilhas
    //==============================

    return rawRows.map((row, index) => {

      const timestamp =
        value(row.c[0]);

      const calc =
        calcMap[timestamp] || {};

      return {

        id: String(index + 1),

        timestamp,

        //------------------------
        // Dados Brutos
        //------------------------

        airTemp:
          toNumber(value(row.c[3])),

        pressure:
          toNumber(value(row.c[4])),

        airHumidity:
          toNumber(value(row.c[5])),

        ambientTemp:
          toNumber(value(row.c[6])),

        leafTemp:
          toNumber(value(row.c[7])),

        soilMoisture:
          toNumber(value(row.c[8])),

        ampT1:
          toNumber(value(row.c[9])),

        phaseT1:
          toNumber(value(row.c[10])),

        ampT2:
          toNumber(value(row.c[11])),

        phaseT2:
          toNumber(value(row.c[12])),

        ampT3:
          toNumber(value(row.c[13])),

        phaseT3:
          toNumber(value(row.c[14])),

        ampT4:
          toNumber(value(row.c[15])),

        phaseT4:
          toNumber(value(row.c[16])),

        interval:
          toNumber(value(row.c[17])),

        device:
          value(row.c[18]),

        version:
          value(row.c[19]),

        samplesFlow:
          toNumber(value(row.c[20])),

        //------------------------
        // Dados Calculados
        //------------------------

        ctd:
          calc.ctd,

        dpv:
          calc.dpv,

        deltaSap:
          calc.deltaSap,

        deltaCTD:
          calc.deltaCTD,

        deltaDPV:
          calc.deltaDPV,

        dpvSap:
          calc.dpvSap,

        dpvCanopy:
          calc.dpvCanopy,

        slope:
          calc.slope,

        r2:
          calc.r2,

        siSigma:
          calc.siSigma,

        siHybrid:
          calc.siHybrid,

        canopyInstant:
          calc.canopyInstant,

        canopyDaily:
          calc.canopyDaily

      };

    });

  } catch (error) {

    console.error(
      "Erro ao buscar planilha:",
      error
    );

    return [];
  }
}
