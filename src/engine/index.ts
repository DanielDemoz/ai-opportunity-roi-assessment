import type { AssessmentProfile, OpportunityResult } from "@/lib/schemas";
import { runAssessment } from "@/engine/scorer";

export function buildExplainabilitySteps(result: OpportunityResult): void {
  // Populated during scoring in scorer.ts
}

export { runAssessment } from "./scorer";
export type { AssessmentResult } from "@/lib/schemas";

export function formatResultsAsText(result: ReturnType<typeof runAssessment>): string {
  const lines = [
    "AI OPPORTUNITY & ROI ASSESSMENT",
    "",
    `Overall: ${result.overallOpportunityLevel}`,
    `Estimated value: $${result.totalValueLow.toLocaleString()}–$${result.totalValueHigh.toLocaleString()} CAD/year`,
    "",
  ];
  result.opportunities.slice(0, 5).forEach((o, i) => {
    lines.push(`${i + 1}. ${o.opportunity.name} (${o.recommendation})`);
  });
  return lines.join("\n");
}

export function getDefaultProfile(): AssessmentProfile {
  return {
    employeeCount: "6_20",
    industry: "professional_services",
    primaryGoal: "save_time",
    timeSpentAreas: ["email", "document_processing"],
    topFrustrations: ["repetitive_work"],
    repetitiveLevel: "moderate",
    repetitiveTasks: ["writing_emails", "reading_documents"],
    hourlyCost: "dont_know",
    processInputs: [],
    dataQuality: "mixed",
    processStandardization: "somewhat_standard",
    technicalCapacity: "limited",
    employeeReadiness: "neutral",
    sensitiveData: ["customer_pii"],
    decisionAuthority: "informational_only",
  };
}
