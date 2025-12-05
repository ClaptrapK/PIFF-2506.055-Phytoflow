import { calcStomatalThresholds, calcKsSto } from "./irrigationCalc";

// Hydric Stress Monitor
export function checkHydricStress(Dr, DZtop, TAW, psto) {
  // The layer with LESS depletion dominates (AquaCrop logic)
  const D = Math.min(Dr, DZtop);

  const { upper, lower } = calcStomatalThresholds(TAW, psto);
  const Ks = calcKsSto(D, upper, lower);

  let status = "Sem Stress";
  let recommendedAction = "Nenhuma ação necessária.";

  if (Ks < 1 && Ks > 0.3) {
    status = "Stress Moderado";
    recommendedAction = "Considere irrigar nas próximas horas.";
  }

  if (Ks <= 0.3) {
    status = "Stress Severo";
    recommendedAction = "⚠️ Irrigação URGENTE!";
  }

  return {
    status,
    Ks,
    recommendedAction,
    depletionUsed: D
  };
}
