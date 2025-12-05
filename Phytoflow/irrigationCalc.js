// =========================
//   Irrigation Calculations
//   Based on AquaCrop formulas
// =========================

// Total Available Water (TAW)
export function calcTAW(thetaFC, thetaWP, depthMeters, gravelPercent = 0) {
  return 1000 * (thetaFC - thetaWP) * depthMeters * (1 - gravelPercent / 100);
}

// Root Zone Depletion (Dr)
export function calcRootZoneDepletion(theta, thetaFC, depthMeters, gravelPercent = 0) {
  const Wr = 1000 * theta * depthMeters * (1 - gravelPercent / 100);
  const WrFC = 1000 * thetaFC * depthMeters * (1 - gravelPercent / 100);
  return WrFC - Wr;
}

// Top Soil Depletion (DZtop)
export function calcTopSoilDepletion(thetaTop, thetaTopFC, depthTop, gravelPercent = 0) {
  const Wtop = 1000 * thetaTop * depthTop * (1 - gravelPercent / 100);
  const WtopFC = 1000 * thetaTopFC * depthTop * (1 - gravelPercent / 100);
  return WtopFC - Wtop;
}

// Stomatal stress thresholds
export function calcStomatalThresholds(TAW, psto) {
  return {
    upper: psto * TAW,
    lower: TAW
  };
}

// Stress coefficient Ks (0–1)
export function calcKsSto(D, upper, lower) {
  if (D <= upper) return 1;      // no stress
  if (D >= lower) return 0;      // full stress

  const Srel = (D - upper) / (lower - upper);
  return 1 - Srel;
}
