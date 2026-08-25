import { COMPLEXITY_TO_SCORE, GOVERNANCE_TO_SCORE } from "@/data/assumptions/enum-conversions";
import type { Opportunity } from "@/lib/schemas";
import { governanceScoreFromLevel } from "@/engine/governance";
import type { GovernanceLevelSchema } from "@/lib/schemas";
import type { z } from "zod";

type GovernanceLevel = z.infer<typeof GovernanceLevelSchema>;

export const SCORING_WEIGHTS = {
  businessValue: 0.3,
  roiPotential: 0.25,
  feasibility: 0.2,
  implementationCost: 0.1,
  governanceRisk: 0.1,
  strategicFit: 0.05,
} as const;

export function calculateCompositeScore(input: {
  valueScore: number;
  roiScore: number;
  feasibilityScore: number;
  costScore: number;
  governanceRisk: GovernanceLevel;
  strategicFitScore: number;
}): number {
  const governanceScore = governanceScoreFromLevel(input.governanceRisk);

  const composite =
    input.valueScore * SCORING_WEIGHTS.businessValue +
    input.roiScore * SCORING_WEIGHTS.roiPotential +
    input.feasibilityScore * SCORING_WEIGHTS.feasibility +
    input.costScore * SCORING_WEIGHTS.implementationCost +
    governanceScore * SCORING_WEIGHTS.governanceRisk +
    input.strategicFitScore * SCORING_WEIGHTS.strategicFit;

  return Math.round(Math.min(100, Math.max(0, composite)));
}

export function costScoreFromBand(firstYearHigh: number): number {
  if (firstYearHigh <= 5000) return 85;
  if (firstYearHigh <= 12000) return 70;
  if (firstYearHigh <= 25000) return 50;
  if (firstYearHigh <= 40000) return 35;
  return 20;
}

export function strategicFitScore(
  opportunity: Opportunity,
  primaryGoal: string,
): number {
  const goalDrivers: Record<string, string[]> = {
    reduce_costs: ["Cost reduction", "Time savings"],
    save_time: ["Time savings", "Capacity"],
    increase_revenue: ["Revenue growth", "Capacity"],
    improve_customer_service: ["Response speed", "Customer experience"],
    improve_quality: ["Quality", "Error reduction", "Consistency"],
    reduce_errors: ["Error reduction", "Quality"],
    scale_operations: ["Capacity", "Time savings"],
    improve_decision_making: ["Decision speed", "Quality"],
    improve_productivity: ["Time savings", "Capacity", "Consistency"],
    other: ["Time savings"],
  };

  const drivers = goalDrivers[primaryGoal] ?? [];
  const overlap = opportunity.typical_value_drivers.filter((d) =>
    drivers.some((g) => d.toLowerCase().includes(g.toLowerCase().split(" ")[0])),
  ).length;

  return Math.min(100, 50 + overlap * 20);
}

export function assignQuadrant(
  valueScore: number,
  opportunity: Opportunity,
): "quick_win" | "strategic" | "opportunistic" | "defer" {
  const complexity = COMPLEXITY_TO_SCORE[opportunity.implementation_complexity];
  const highValue = valueScore >= 55;
  const lowComplexity = complexity <= 40;

  if (highValue && lowComplexity) return "quick_win";
  if (highValue && !lowComplexity) return "strategic";
  if (!highValue && lowComplexity) return "opportunistic";
  return "defer";
}

export function assignRiskQuadrant(
  valueScore: number,
  governanceRisk: GovernanceLevel,
): "high_value_low_risk" | "high_value_high_risk" | "low_value_low_risk" | "low_value_high_risk" {
  const highValue = valueScore >= 55;
  const highRisk = GOVERNANCE_TO_SCORE[governanceRisk] >= 70;

  if (highValue && !highRisk) return "high_value_low_risk";
  if (highValue && highRisk) return "high_value_high_risk";
  if (!highValue && !highRisk) return "low_value_low_risk";
  return "low_value_high_risk";
}

export function overallOpportunityLevel(
  topComposite: number,
): "Low" | "Moderate" | "Moderate–High" | "High" {
  if (topComposite >= 75) return "High";
  if (topComposite >= 60) return "Moderate–High";
  if (topComposite >= 40) return "Moderate";
  return "Low";
}
