import type { Opportunity, OpportunityResult, PilotPlan } from "@/lib/schemas";

const METRICS_BY_CATEGORY: Record<string, string[]> = {
  "Customer Service": [
    "Average response time",
    "Tickets resolved per day",
    "Customer satisfaction score",
    "Employee hours on inquiries",
  ],
  Administration: [
    "Processing time per document",
    "Error rate",
    "Employee hours saved",
    "Documents processed per week",
  ],
  Marketing: [
    "Content pieces produced per week",
    "Campaign analysis turnaround time",
    "Engagement metrics",
  ],
  Operations: [
    "Scheduling conflicts per week",
    "Resource utilization rate",
    "Forecast accuracy",
  ],
  Finance: [
    "Invoices processed per day",
    "Processing cost per transaction",
    "Error/rework rate",
  ],
  "HR / Operations": [
    "Onboarding completion time",
    "Policy inquiry resolution time",
    "New hire satisfaction",
  ],
  HR: [
    "Time to complete onboarding tasks",
    "HR admin hours per new hire",
    "Employee self-service rate",
  ],
  Sales: [
    "Leads contacted per week",
    "Conversion rate",
    "Sales cycle length",
  ],
};

export function generatePilotPlan(
  opportunity: Opportunity,
  result: OpportunityResult,
): PilotPlan {
  const metrics =
    METRICS_BY_CATEGORY[opportunity.category] ?? [
      "Processing time",
      "Error rate",
      "Employee hours",
      "Quality score",
    ];

  const efficiencyLow = Math.round(
    ((result.value.annualTimeValueLow / Math.max(result.value.annualTimeValueHigh, 1)) * 100) / 2,
  );
  const targetReduction = Math.max(20, Math.min(40, 30));

  return {
    objective: `Validate whether ${opportunity.name.toLowerCase()} can reduce time spent on ${opportunity.pain_point_tags[0]?.replace(/_/g, " ") ?? "target tasks"} while maintaining quality standards.`,
    baseline: `Document current performance: time per task, error rate, and volume before introducing AI assistance.`,
    successMetrics: metrics.slice(0, 4),
    durationWeeks: { low: 4, high: 8 },
    goNoGo: `Proceed if processing time decreases by at least ${targetReduction}% while quality remains above the agreed threshold and governance requirements are met.`,
  };
}

export function buildPilotPlans(
  opportunities: OpportunityResult[],
): Record<string, PilotPlan> {
  const plans: Record<string, PilotPlan> = {};
  for (const opp of opportunities.filter(
    (o) =>
      o.recommendation === "priority_opportunity" || o.recommendation === "pilot",
  )) {
    plans[opp.opportunity.id] = generatePilotPlan(opp.opportunity, opp);
  }
  return plans;
}
