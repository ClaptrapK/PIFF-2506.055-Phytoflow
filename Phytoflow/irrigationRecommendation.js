export function irrigationRecommendation(soil, ET0 = 4, Kc = 0.75) {
  const { thetaFC, thetaWP, rootDepth } = soil;

  const TAW = (thetaFC - thetaWP) * rootDepth * 1000;   // Total Available Water (mm)
  const RAW = TAW * 0.55;                              // Readily available water (FAO standard)
  const depletion = TAW - RAW;                         // When to irrigate
  const Ks = Math.min(1, RAW / TAW);

  // Irrigation necessaria:
  const irrigationMM = (thetaFC - thetaWP) * rootDepth * 1000 * (1 - Ks);

  // Daily ETc
  const ETc = ET0 * Kc * Ks;

  return {
    TAW,
    RAW,
    depletion,
    Ks,
    irrigationMM,
    ETc
  };
}
