import type { AssessmentProfile, GovernanceLevelSchema, Opportunity } from "@/lib/schemas";
import type { z } from "zod";

type GovernanceLevel = z.infer<typeof GovernanceLevelSchema>;

const LEVEL_ORDER: GovernanceLevel[] = ["Low", "Moderate", "High", "Very High"];

function maxLevel(a: GovernanceLevel, b: GovernanceLevel): GovernanceLevel {
  return LEVEL_ORDER.indexOf(a) >= LEVEL_ORDER.indexOf(b) ? a : b;
}

export function calculateGovernanceRisk(
  profile: AssessmentProfile,
  opportunity: Opportunity,
): { level: GovernanceLevel; factors: string[] } {
  const factors: string[] = [];
  let level: GovernanceLevel = opportunity.governance_level;

  factors.push(`Base opportunity governance level: ${opportunity.governance_level}`);

  if (profile.sensitiveData.includes("health")) {
    level = maxLevel(level, "High");
    factors.push("Health information involved → elevated to at least High");
  }
  if (profile.sensitiveData.includes("customer_pii")) {
    level = maxLevel(level, "Moderate");
    factors.push("Customer personal information → elevated to at least Moderate");
  }
  if (profile.sensitiveData.includes("employee_pii")) {
    level = maxLevel(level, "Moderate");
    factors.push("Employee personal information → elevated to at least Moderate");
  }
  if (profile.sensitiveData.includes("financial")) {
    level = maxLevel(level, "Moderate");
    factors.push("Financial data involved → elevated to at least Moderate");
  }

  if (
    profile.decisionAuthority === "semi_automated" ||
    profile.decisionAuthority === "fully_automated"
  ) {
    level = maxLevel(level, "High");
    factors.push("Automated decision-making authority → elevated to at least High");
  }

  if (opportunity.high_risk) {
    level = maxLevel(level, "Very High");
    factors.push("High-risk use case category → elevated to Very High");
  }

  if (profile.industry === "healthcare") {
    level = maxLevel(level, "High");
    factors.push("Healthcare industry context → privacy sensitivity elevated");
  }

  return { level, factors };
}

export function governanceScoreFromLevel(level: GovernanceLevel): number {
  const map: Record<GovernanceLevel, number> = {
    Low: 90,
    Moderate: 70,
    High: 40,
    "Very High": 15,
  };
  return map[level];
}

export function isHighGovernanceRisk(level: GovernanceLevel): boolean {
  return level === "High" || level === "Very High";
}
