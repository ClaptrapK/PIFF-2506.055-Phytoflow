import { fetchSheetData } from "./GetSheetData";

function formatDate(rawDate) {
  if (!rawDate) return "";

  const match = rawDate.match(/\d+/g);
  if (!match) return rawDate;

  const [year, month, day, hour, min, sec] = match;

  return `${day}/${Number(month)+1}/${year} ${hour}:${min}`;
}

function normalizePercentage(value) {
  if (value == null) return 0;

  let num = parseFloat(value);

  // Corrigir valores absurdos
  if (Math.abs(num) < 1) {
    num = num * 100;
  }

  // Evitar negativos
  if (num < 0) num = 0;

  return num.toFixed(2);
}

function formatTemperature(value) {
  if (value == null) return "0°C";

  return `${parseFloat(value).toFixed(2)}°C`;
}

function formatFlow(value) {
  if (!value || value <= 0) return "Sem fluxo";

  return `${parseFloat(value).toFixed(2)} L/h`;
}

function formatPressure(value) {
  if (value == null) return "Não Encontrado";

  return `${parseFloat(value).toFixed(2)}kPa`;
}

// Processamento extra depois caso necessario
export async function getSensorData() {
  const raw = await fetchSheetData();

  return raw.map((item) => {
    const soil = normalizePercentage(item.soilMoisture);
    const temp = formatTemperature(item.temp);
    const airTemp = formatTemperature(item.airTemp);
    const leafTemp = formatTemperature(item.leafTemp);
    const pressure = formatPressure(item.pressure);
    const humidity = normalizePercentage(item.airHumidity);
    const flow = formatFlow(item.samples_flow);

    /*timestamp: row.c[0]?.v,
    temp: (row.c[3]?.v ?? 0) + "°C",
    pressure: (row.c[4]?.v ?? 0) + "°C",
    airHumidity: (row.c[5]?.v ?? 0) + "%",
    airTemp: (row.c[6]?.v ?? 0) + "°C",
    leafTemp: (row.c[7]?.v ?? 0) + "°C",
    soilMoisture: (row.c[7]?.v ?? 0) + "%",
    sapFlow: (row.c[20]?.v ?? 0) + " L/h",*/

    return {
      id: item.id,

      timestamp: formatDate(item.timestamp),

      soilMoisture: `${soil}%`,
      temp: temp,
      pressure: pressure,
      airTemp: airTemp,
      leafTemp: leafTemp,
      airHumidity: `${humidity}%`,
      sapFlow: flow,

      //valores numéricos (para cálculos)
      soilMoistureValue: parseFloat(soil),
      TempValue: parseFloat(temp),
      pressureValue: parseFloat(pressure),
      airTempValue: parseFloat(airTemp),
      leafTempValue: parseFloat(leafTemp),
      humidityValue: parseFloat(humidity),
      sapFlowValue: parseFloat(item.samples_flow) || 0,
    };
  });
}
