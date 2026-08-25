import { describe, expect, it } from "vitest";
import { runAssessment } from "@/engine/scorer";
import { DEMO_SCENARIOS } from "@/data/scenarios/index";
import type { AssessmentProfile } from "@/lib/schemas";

describe("runAssessment golden scenarios", () => {
  for (const scenario of DEMO_SCENARIOS) {
    it(`scenario: ${scenario.name}`, () => {
      const result = runAssessment(scenario.profile);
      expect(result.opportunities.length).toBeGreaterThanOrEqual(
        scenario.expectedOutcomes.minOpportunities,
      );

      if (scenario.expectedOutcomes.shouldInclude) {
        for (const id of scenario.expectedOutcomes.shouldInclude) {
          expect(result.opportunities.some((o) => o.opportunity.id === id)).toBe(true);
        }
      }

      if (scenario.expectedOutcomes.governanceCap) {
        const hasElevatedRisk = result.opportunities.some(
          (o) => o.governanceRisk === "High" || o.governanceRisk === "Very High",
        );
        expect(hasElevatedRisk).toBe(true);
      }
    });
  }
});

describe("recommendation safeguards", () => {
  it("high-value high-risk should not be priority without cap", () => {
    const profile: AssessmentProfile = {
      employeeCount: "21_50",
      industry: "healthcare",
      primaryGoal: "save_time",
      timeSpentAreas: ["administrative", "employee_onboarding"],
      topFrustrations: ["repetitive_work", "too_much_admin"],
      repetitiveLevel: "significant",
      repetitiveTasks: ["reviewing_forms"],
      hourlyCost: "40_60",
      processInputs: [],
      dataQuality: "good",
      processStandardization: "well_defined",
      technicalCapacity: "some",
      employeeReadiness: "open",
      sensitiveData: ["health", "employee_pii"],
      decisionAuthority: "semi_automated",
    };

    const result = runAssessment(profile);
    const hiring = result.opportunities.find(
      (o) => o.opportunity.id === "automated-hiring-screening",
    );
    if (hiring) {
      expect(hiring.recommendation).not.toBe("priority_opportunity");
    }
  });

  it("inconsistent process should recommend improve process first", () => {
    const profile: AssessmentProfile = {
      ...DEMO_SCENARIOS[0].profile,
      processStandardization: "inconsistent",
      dataQuality: "poor",
    };
    const result = runAssessment(profile);
    expect(
      result.opportunities.some((o) => o.recommendation === "improve_process_first") ||
        result.improveProcessFirst,
    ).toBe(true);
  });

  it("low value high complexity should defer or not recommend", () => {
    const profile: AssessmentProfile = {
      employeeCount: "1_5",
      industry: "retail",
      primaryGoal: "reduce_costs",
      timeSpentAreas: ["other"],
      topFrustrations: [],
      repetitiveLevel: "very_little",
      repetitiveTasks: ["other"],
      hourlyCost: "under_20",
      processInputs: [],
      dataQuality: "poor",
      processStandardization: "inconsistent",
      technicalCapacity: "none",
      employeeReadiness: "resistant",
      sensitiveData: ["none"],
      decisionAuthority: "informational_only",
    };
    const result = runAssessment(profile);
    const deferOrNot = result.opportunities.every(
      (o) =>
        o.recommendation === "not_recommended" ||
        o.recommendation === "improve_process_first" ||
        o.quadrant === "defer",
    );
    expect(deferOrNot || result.aiNotRecommended).toBe(true);
  });
});
