import type { AssessmentProfile, AssessmentResult } from "@/lib/schemas";

export type BrukdCtaReason =
  | "complex_integration"
  | "custom_ai_requirement"
  | "sensitive_data"
  | "high_value_opportunity"
  | "high_governance_risk"
  | "high_implementation_complexity";

export function evaluateBrukdCta(
  profile: AssessmentProfile,
  result: AssessmentResult,
): { show: boolean; reasons: BrukdCtaReason[] } {
  const reasons: BrukdCtaReason[] = [];

  const top = result.opportunities[0];
  if (!top) return { show: false, reasons: [] };

  const simpleLowRisk =
    top.recommendation === "priority_opportunity" &&
    (top.governanceRisk === "Low" || top.governanceRisk === "Moderate") &&
    top.opportunity.implementation_complexity === "Low";

  if (simpleLowRisk && result.overallConfidence !== "low") {
    return { show: false, reasons: [] };
  }

  if (
    top.opportunity.implementation_complexity === "High" ||
    result.opportunities.some(
      (o) =>
        o.opportunity.implementation_complexity === "High" &&
        o.recommendation !== "not_recommended",
    )
  ) {
    reasons.push("high_implementation_complexity");
  }

  if (
    profile.sensitiveData.includes("health") ||
    profile.sensitiveData.includes("financial") ||
    profile.sensitiveData.length >= 2
  ) {
    reasons.push("sensitive_data");
  }

  if (
    result.opportunities.some(
      (o) => o.governanceRisk === "High" || o.governanceRisk === "Very High",
    )
  ) {
    reasons.push("high_governance_risk");
  }

  if (result.totalValueHigh >= 40000) {
    reasons.push("high_value_opportunity");
  }

  if (
    top.opportunity.data_requirement === "High" &&
    profile.technicalCapacity !== "strong"
  ) {
    reasons.push("complex_integration");
  }

  if (
    top.opportunity.ai_type.some((t) => t.includes("Predictive")) &&
    top.opportunity.implementation_complexity === "High"
  ) {
    reasons.push("custom_ai_requirement");
  }

  const unique = [...new Set(reasons)];
  return { show: unique.length > 0, reasons: unique };
}

export function brukdReasonLabel(reason: BrukdCtaReason): string {
  const labels: Record<BrukdCtaReason, string> = {
    complex_integration: "Complex system integration may be required",
    custom_ai_requirement: "Custom AI development may be needed",
    sensitive_data: "Sensitive data handling requires careful assessment",
    high_value_opportunity: "High-value opportunity may justify detailed analysis",
    high_governance_risk: "Elevated governance risk requires expert review",
    high_implementation_complexity: "Significant implementation complexity identified",
  };
  return labels[reason];
}
