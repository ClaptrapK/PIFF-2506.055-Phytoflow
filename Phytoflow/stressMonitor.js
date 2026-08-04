// stressMonitor.js

export function calcKsFromSoilMoisture(
  soilMoisture,
  fieldCapacity = 100,
  wiltingPoint = 30
) {

  const Ks =
    (soilMoisture - wiltingPoint) /
    (fieldCapacity - wiltingPoint);

  return Math.max(
    0,
    Math.min(1, Ks)
  );
}

export function getStressStatus(Ks) {

  if (Ks >= 0.8) {
    return "Sem Stress";
  }

  if (Ks >= 0.5) {
    return "Stress Moderado";
  }

  return "Stress Severo";
}
