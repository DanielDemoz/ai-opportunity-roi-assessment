import type {
  DurationSchema,
  EmployeesInvolvedSchema,
  EmployeeCountSchema,
  FrequencySchema,
  HourlyCostSchema,
} from "@/lib/schemas";
import type { z } from "zod";

export const FREQUENCY_TO_ANNUAL: Record<
  z.infer<typeof FrequencySchema>,
  number
> = {
  several_per_day: 3 * 220,
  daily: 220,
  several_per_week: 3 * 52,
  weekly: 52,
  monthly: 12,
  occasionally: 24,
};

export const DURATION_TO_HOURS: Record<
  z.infer<typeof DurationSchema>,
  number
> = {
  under_15_min: 0.125,
  "15_30_min": 0.375,
  "30_60_min": 0.75,
  "1_2_hours": 1.5,
  "2_4_hours": 3,
  over_4_hours: 5,
};

export const EMPLOYEES_TO_COUNT: Record<
  z.infer<typeof EmployeesInvolvedSchema>,
  number
> = {
  "1": 1,
  "2_5": 3.5,
  "6_10": 8,
  "10_plus": 12,
};

export const HOURLY_COST_TO_CAD: Record<
  z.infer<typeof HourlyCostSchema>,
  number | null
> = {
  under_20: 17,
  "20_30": 25,
  "30_40": 35,
  "40_60": 50,
  "60_80": 70,
  "80_plus": 90,
  dont_know: null,
};

export const EMPLOYEE_COUNT_MULTIPLIER: Record<
  z.infer<typeof EmployeeCountSchema>,
  number
> = {
  "1_5": 0.8,
  "6_20": 1,
  "21_50": 1.15,
  "51_100": 1.3,
  "101_250": 1.5,
  "250_plus": 1.8,
};

export const COMPLEXITY_TO_SCORE = { Low: 25, Medium: 55, High: 85 } as const;
export const GOVERNANCE_TO_SCORE = {
  Low: 15,
  Moderate: 40,
  High: 70,
  "Very High": 90,
} as const;

export const VALUE_TO_LABEL = (score: number): "Low" | "Medium" | "High" => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};
