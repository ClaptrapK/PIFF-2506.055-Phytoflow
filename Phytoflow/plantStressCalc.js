// ====================================
// DPV (kPa)
// ====================================
export function calcDPV(tempC, humidity) {
  const es =
    0.6108 *
    Math.exp(
      (17.27 * tempC) /
      (tempC + 237.3)
    );

  const ea =
    es * (humidity / 100);

  return Math.max(es - ea, 0);
}

// ====================================
// CTD
// ====================================
export function calcCTD(
  leafTemp,
  airTemp
) {
  return leafTemp - airTemp;
}

// ====================================
// Fator Canopy
// ====================================
export function calcCanopyFactor(
  ctd,
  dpv
) {
  if (dpv < 0.5) {
    return 0;
  }

  return ctd / dpv;
}

// ====================================
// SAP FLOW ESTIMADO
// ====================================
export function calcEstimatedSapFlow(
  soilMoisture,
  dpv,
  ks
) {
  const moistureFactor =
    soilMoisture / 100;

  return (
    moistureFactor *
    dpv *
    ks *
    100
  );
}

// ====================================
// Desvio padrão
// ====================================
export function std(arr) {
  if (!arr || arr.length < 2) {
    return 0;
  }

  const mean =
    arr.reduce(
      (a, b) => a + b,
      0
    ) / arr.length;

  const variance =
    arr.reduce(
      (sum, v) =>
        sum +
        Math.pow(
          v - mean,
          2
        ),
      0
    ) / arr.length;

  return Math.sqrt(
    variance
  );
}
