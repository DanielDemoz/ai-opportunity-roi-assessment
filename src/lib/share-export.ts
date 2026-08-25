import type { AssessmentProfile } from "@/lib/schemas";
import { AssessmentProfileSchema } from "@/lib/schemas";

const SHARE_PARAM = "share";

export function encodeProfileForShare(profile: AssessmentProfile): string {
  const json = JSON.stringify(profile);
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(json)));
  }
  return Buffer.from(json, "utf-8").toString("base64");
}

export function decodeProfileFromShare(encoded: string): AssessmentProfile | null {
  try {
    let json: string;
    if (typeof atob !== "undefined") {
      json = decodeURIComponent(escape(atob(encoded)));
    } else {
      json = Buffer.from(encoded, "base64").toString("utf-8");
    }
    const parsed = JSON.parse(json);
    const result = AssessmentProfileSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function buildShareUrl(profile: AssessmentProfile): string {
  if (typeof window === "undefined") return `/results?${SHARE_PARAM}=`;
  const encoded = encodeProfileForShare(profile);
  return `${window.location.origin}/results?${SHARE_PARAM}=${encodeURIComponent(encoded)}`;
}

export function getShareParamName(): string {
  return SHARE_PARAM;
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatResultsAsReport(result: import("@/lib/schemas").AssessmentResult): string {
  const lines: string[] = [
    "AI OPPORTUNITY & ROI ASSESSMENT REPORT",
    "========================================",
    "",
    "DISCLAIMER: Scenario-based estimates only — not financial forecasts or guaranteed savings.",
    "",
    `Overall AI Opportunity: ${result.overallOpportunityLevel}`,
    `Estimated Annual Opportunity Value: $${result.totalValueLow.toLocaleString()}–$${result.totalValueHigh.toLocaleString()} CAD`,
    `Estimated First-Year Investment: $${result.totalFirstYearCostLow.toLocaleString()}–$${result.totalFirstYearCostHigh.toLocaleString()} CAD`,
    `Estimated First-Year ROI: ${Math.round(result.portfolioRoiLow)}–${Math.round(result.portfolioRoiHigh)}%`,
    `Confidence: ${result.overallConfidence}`,
    "",
    "TOP OPPORTUNITIES",
    "---------------",
  ];

  result.opportunities.slice(0, 5).forEach((o, i) => {
    lines.push(
      `${i + 1}. ${o.opportunity.name} — ${o.recommendation.replace(/_/g, " ")}`,
      `   Value: $${o.value.annualTimeValueLow.toLocaleString()}–$${o.value.annualTimeValueHigh.toLocaleString()} CAD/year`,
      `   Feasibility: ${o.feasibilityScore}/100 | Risk: ${o.governanceRisk}`,
      "",
    );
  });

  lines.push("ASSUMPTIONS", "-----------");
  lines.push("All figures depend on user inputs and illustrative efficiency assumptions.");
  lines.push("See full results page for calculation details.");

  return lines.join("\n");
}
