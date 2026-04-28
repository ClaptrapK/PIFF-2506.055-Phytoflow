const urlSheet = "https://docs.google.com/spreadsheets/d/1kJd961sym98HPhkz_Bi8l5fqmEnRH7fswFoZN_ndyZA/gviz/tq?tqx=out:json&sheet=Dados_700";

export async function fetchSheetData() {
  try {
    const res = await fetch(urlSheet);
    const text = await res.text();

    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    return rows.map((row, index) => ({
      id: String(index + 1),

      timestamp: row.c[0]?.v,
      temp: (row.c[3]?.v ?? 0) + "°C",
      pressure: (row.c[4]?.v ?? 0) + "kPa",
      airHumidity: (row.c[5]?.v ?? 0) + "%",
      airTemp: (row.c[6]?.v ?? 0) + "°C",
      leafTemp: (row.c[7]?.v ?? 0) + "°C",
      soilMoisture: (row.c[7]?.v ?? 0) + "%",
      sapFlow: (row.c[20]?.v ?? 0) + " L/h",
      samples_flow: (row.c[20]?.v ?? 0) + " L/h",
    }));

  } catch (error) {
    console.error("Erro ao buscar planilha:", error);
    return [];
  }
}
