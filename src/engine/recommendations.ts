import type { RecommendationCategorySchema } from "@/lib/schemas";
import type { z } from "zod";
import { isHighGovernanceRisk } from "@/engine/governance";
import type { GovernanceLevelSchema } from "@/lib/schemas";

type Recommendation = z.infer<typeof RecommendationCategorySchema>;
type GovernanceLevel = z.infer<typeof GovernanceLevelSchema>;

export function determineRecommendation(input: {
  compositeScore: number;
  feasibilityScore: number;
  governanceRisk: GovernanceLevel;
  roiMid: number;
  confidence: "high" | "moderate" | "low";
  valueScore: number;
  processStandardization: string;
  dataQuality: string;
  processMethod?: string;
}): { recommendation: Recommendation; governanceCapApplied: boolean } {
  const {
    compositeScore,
    feasibilityScore,
    governanceRisk,
    roiMid,
    confidence,
    valueScore,
    processStandardization,
    dataQuality,
    processMethod,
  } = input;

  let governanceCapApplied = false;

  if (
    processStandardization === "inconsistent" ||
    (dataQuality === "poor" && feasibilityScore < 50)
  ) {
    return { recommendation: "improve_process_first", governanceCapApplied: false };
  }

  if (
    processMethod === "completely_manual" &&
    processStandardization === "not_sure" &&
    feasibilityScore < 55
  ) {
    return { recommendation: "improve_process_first", governanceCapApplied: false };
  }

  if (valueScore < 25 && feasibilityScore < 45) {
    return { recommendation: "not_recommended", governanceCapApplied: false };
  }

  if (roiMid < -10 && valueScore < 35) {
    return { recommendation: "not_recommended", governanceCapApplied: false };
  }

  if (governanceRisk === "Very High" && valueScore < 70) {
    return { recommendation: "not_recommended", governanceCapApplied: true };
  }

  let recommendation: Recommendation = "further_assessment";

  if (
    compositeScore >= 75 &&
    feasibilityScore >= 70 &&
    !isHighGovernanceRisk(governanceRisk) &&
    (confidence === "high" || confidence === "moderate")
  ) {
    recommendation = "priority_opportunity";
  } else if (
    valueScore >= 45 &&
    (feasibilityScore >= 50 || roiMid >= 25)
  ) {
    recommendation = "pilot";
  } else if (valueScore < 35 && feasibilityScore < 50) {
    recommendation = "not_recommended";
  } else if (feasibilityScore < 45) {
    recommendation = "improve_process_first";
  }

  if (isHighGovernanceRisk(governanceRisk)) {
    governanceCapApplied = true;
    if (recommendation === "priority_opportunity") {
      recommendation = "pilot";
    }
    if (governanceRisk === "Very High" && recommendation !== "not_recommended") {
      recommendation = "further_assessment";
    }
  }

  if (confidence === "low" && recommendation === "priority_opportunity") {
    recommendation = "pilot";
  }

  if (
    feasibilityScore < 50 &&
    recommendation === "priority_opportunity"
  ) {
    recommendation = "pilot";
  }

  return { recommendation, governanceCapApplied };
}

export function recommendationLabel(rec: Recommendation): string {
  const labels: Record<Recommendation, string> = {
    priority_opportunity: "Priority Opportunity",
    pilot: "Pilot Recommended",
    improve_process_first: "Improve Process First",
    further_assessment: "Further Assessment Required",
    not_recommended: "Not Recommended",
  };
  return labels[rec];
}

export function recommendationEmoji(rec: Recommendation): string {
  const emojis: Record<Recommendation, string> = {
    priority_opportunity: "🟢",
    pilot: "🟢",
    improve_process_first: "🟡",
    further_assessment: "🟠",
    not_recommended: "🔴",
  };
  return emojis[rec];
}
