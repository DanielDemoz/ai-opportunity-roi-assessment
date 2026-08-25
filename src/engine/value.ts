import type {
  AssessmentProfile,
  Opportunity,
  OpportunityProcessInput,
  ValueEstimate,
} from "@/lib/schemas";
import { getEfficiencyAssumption } from "@/data/assumptions/efficiency-assumptions";
import {
  DURATION_TO_HOURS,
  EMPLOYEES_TO_COUNT,
  FREQUENCY_TO_ANNUAL,
  HOURLY_COST_TO_CAD,
} from "@/data/assumptions/enum-conversions";
import { DEFAULT_HOURLY_COST_CAD, WORKING_DAYS_PER_YEAR } from "@/lib/constants";

export function resolveHourlyCost(profile: AssessmentProfile): {
  value: number;
  isDefault: boolean;
} {
  const mapped = HOURLY_COST_TO_CAD[profile.hourlyCost];
  if (mapped === null) {
    return { value: DEFAULT_HOURLY_COST_CAD, isDefault: true };
  }
  return { value: mapped, isDefault: false };
}

export function getProcessInput(
  profile: AssessmentProfile,
  opportunityId: string,
): OpportunityProcessInput | undefined {
  return profile.processInputs.find((p) => p.opportunityId === opportunityId);
}

export function estimateValue(
  profile: AssessmentProfile,
  opportunity: Opportunity,
  processInput?: OpportunityProcessInput,
): ValueEstimate {
  const hourly = resolveHourlyCost(profile);
  const efficiency = getEfficiencyAssumption(opportunity.efficiency_assumption_id);

  const input = processInput ?? {
    opportunityId: opportunity.id,
    processMethod: "completely_manual" as const,
    frequency: "weekly" as const,
    duration: "30_60_min" as const,
    employeesInvolved: "2_5" as const,
  };

  const hoursPerOccurrence = DURATION_TO_HOURS[input.duration];
  const annualOccurrences = FREQUENCY_TO_ANNUAL[input.frequency];
  const employeeCount = EMPLOYEES_TO_COUNT[input.employeesInvolved];

  const annualHours =
    hoursPerOccurrence * annualOccurrences * employeeCount;

  const annualTimeValueBase = annualHours * hourly.value;

  const annualTimeValueLow =
    annualTimeValueBase * efficiency.range.low;
  const annualTimeValueHigh =
    annualTimeValueBase * efficiency.range.high;

  const formula =
    "time per occurrence × frequency × employees × hourly cost × efficiency range";

  const inputs: Record<string, string | number> = {
    "Hours per occurrence": hoursPerOccurrence,
    "Annual occurrences": annualOccurrences,
    Employees: employeeCount,
    "Hourly cost (CAD)": hourly.value,
    "Efficiency low": `${Math.round(efficiency.range.low * 100)}%`,
    "Efficiency high": `${Math.round(efficiency.range.high * 100)}%`,
    "Working days reference": WORKING_DAYS_PER_YEAR,
  };

  if (hourly.isDefault) {
    inputs["Hourly cost note"] = "Default assumption — user selected 'I don't know'";
  }

  return {
    annualTimeValueLow: Math.round(annualTimeValueLow),
    annualTimeValueHigh: Math.round(annualTimeValueHigh),
    formula,
    inputs,
  };
}

export function valueScoreFromEstimate(low: number, high: number): number {
  const mid = (low + high) / 2;
  if (mid >= 50000) return 90;
  if (mid >= 25000) return 75;
  if (mid >= 10000) return 60;
  if (mid >= 5000) return 45;
  if (mid >= 2000) return 30;
  return 15;
}
