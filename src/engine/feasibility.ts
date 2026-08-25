import type { AssessmentProfile, Opportunity, OpportunityProcessInput } from "@/lib/schemas";

const PROCESS_METHOD_SCORE: Record<string, number> = {
  completely_manual: 20,
  spreadsheet: 35,
  existing_software: 55,
  rule_based_automation: 70,
  ai_assisted: 80,
  fully_automated: 90,
  not_sure: 30,
};

const COMPLEXITY_PENALTY = { Low: 0, Medium: 15, High: 30 } as const;
const DATA_REQ_PENALTY = { Low: 0, Medium: 10, High: 25 } as const;

export function calculateFeasibility(
  profile: AssessmentProfile,
  opportunity: Opportunity,
  processInput?: OpportunityProcessInput,
): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 70;

  const method = processInput?.processMethod ?? "not_sure";
  const methodScore = PROCESS_METHOD_SCORE[method] ?? 30;
  score = (score + methodScore) / 2;
  factors.push(`Current process method: ${method.replace(/_/g, " ")} (${methodScore}/100 contribution)`);

  if (profile.processStandardization === "well_defined") {
    score += 15;
    factors.push("Process is well defined (+15)");
  } else if (profile.processStandardization === "inconsistent") {
    score -= 25;
    factors.push("Process is inconsistent (−25)");
  } else if (profile.processStandardization === "somewhat_standard") {
    score += 5;
    factors.push("Process is somewhat standardized (+5)");
  }

  if (profile.dataQuality === "good") {
    score += 10;
    factors.push("Data quality is good (+10)");
  } else if (profile.dataQuality === "poor") {
    score -= 20;
    factors.push("Data quality is poor (−20)");
  } else if (profile.dataQuality === "mixed") {
    score -= 5;
    factors.push("Data quality is mixed (−5)");
  }

  score -= COMPLEXITY_PENALTY[opportunity.implementation_complexity];
  factors.push(
    `Implementation complexity: ${opportunity.implementation_complexity} (−${COMPLEXITY_PENALTY[opportunity.implementation_complexity]})`,
  );

  score -= DATA_REQ_PENALTY[opportunity.data_requirement];
  factors.push(
    `Data requirement: ${opportunity.data_requirement} (−${DATA_REQ_PENALTY[opportunity.data_requirement]})`,
  );

  if (profile.technicalCapacity === "none") {
    score -= 15;
    factors.push("No technical capacity (−15)");
  } else if (profile.technicalCapacity === "limited") {
    score -= 8;
    factors.push("Limited technical capacity (−8)");
  } else if (profile.technicalCapacity === "strong") {
    score += 10;
    factors.push("Strong technical capacity (+10)");
  }

  if (profile.employeeReadiness === "resistant") {
    score -= 10;
    factors.push("Employee resistance expected (−10)");
  } else if (profile.employeeReadiness === "eager") {
    score += 5;
    factors.push("Employees are eager to adopt (+5)");
  }

  if (method === "completely_manual" && profile.processStandardization === "inconsistent") {
    score -= 10;
    factors.push("Manual + inconsistent process (−10 additional)");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    factors,
  };
}
