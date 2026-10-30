import type { AssessmentProfile, ConfidenceLevelSchema } from "@/lib/schemas";
import type { z } from "zod";
import { getEfficiencyAssumption } from "@/data/assumptions/efficiency-assumptions";
import type { CostBand } from "@/lib/schemas";
import { resolveHourlyCost } from "@/engine/value";

type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

export function calculateConfidence(
  profile: AssessmentProfile,
  efficiencyId: string,
  cost: CostBand,
  hasProcessInput: boolean,
): { level: ConfidenceLevel; factors: string[]; score: number } {
  const factors: string[] = [];
  let score = 100;

  const efficiency = getEfficiencyAssumption(efficiencyId);
  if (efficiency.confidence === "low") {
    score -= 15;
    factors.push("Efficiency assumption has low confidence (−15)");
  } else if (efficiency.confidence === "moderate") {
    score -= 5;
    factors.push("Efficiency assumption has moderate confidence (−5)");
  }

  if (cost.confidence === "low") {
    score -= 15;
    factors.push("Cost estimate has low confidence (−15)");
  }

  const hourly = resolveHourlyCost(profile);
  if (hourly.isDefault) {
    score -= 10;
    factors.push("Hourly cost uses default assumption (−10)");
  }

  if (!hasProcessInput) {
    score -= 20;
    factors.push("No specific process inputs, using defaults (−20)");
  }

  if (profile.dataQuality === "not_sure" || profile.dataQuality === "poor") {
    score -= 10;
    factors.push("Data quality uncertain or poor (−10)");
  }

  if (profile.processStandardization === "not_sure" || profile.processStandardization === "inconsistent") {
    score -= 10;
    factors.push("Process standardization uncertain (−10)");
  }

  const efficiencyRange = efficiency.range.high - efficiency.range.low;
  if (efficiencyRange > 0.35) {
    score -= 15;
    factors.push("Wide efficiency range increases uncertainty (−15)");
  }

  let level: ConfidenceLevel = "high";
  if (score < 50) level = "low";
  else if (score < 75) level = "moderate";

  return { level, factors, score: Math.max(0, score) };
}

export function overallConfidence(
  levels: ConfidenceLevel[],
): ConfidenceLevel {
  if (levels.some((l) => l === "low")) return "low";
  if (levels.filter((l) => l === "moderate").length >= levels.length / 2) {
    return "moderate";
  }
  return "high";
}
