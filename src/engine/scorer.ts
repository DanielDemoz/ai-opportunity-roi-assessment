import type { AssessmentProfile, AssessmentResult, OpportunityResult } from "@/lib/schemas";
import { AssessmentProfileSchema } from "@/lib/schemas";
import { getCostBand } from "@/data/assumptions/cost-bands";
import { EMPLOYEE_COUNT_MULTIPLIER } from "@/data/assumptions/enum-conversions";
import { matchOpportunities } from "@/engine/matching";
import {
  estimateValue,
  getProcessInput,
  valueScoreFromEstimate,
} from "@/engine/value";
import { calculateRoi, roiScoreFromEstimate } from "@/engine/roi";
import { calculateFeasibility } from "@/engine/feasibility";
import { calculateGovernanceRisk } from "@/engine/governance";
import { calculateConfidence, overallConfidence } from "@/engine/confidence";
import { determineRecommendation } from "@/engine/recommendations";
import {
  assignQuadrant,
  assignRiskQuadrant,
  calculateCompositeScore,
  costScoreFromBand,
  overallOpportunityLevel,
  strategicFitScore,
} from "@/engine/scoring";
import { buildRoadmap } from "@/engine/roadmap";
import { buildPilotPlans } from "@/engine/pilots";
import { evaluateBrukdCta } from "@/engine/brukd-cta";

export function runAssessment(rawProfile: AssessmentProfile): AssessmentResult {
  const profile = AssessmentProfileSchema.parse(rawProfile);
  const employeeMultiplier = EMPLOYEE_COUNT_MULTIPLIER[profile.employeeCount];
  const matches = matchOpportunities(profile);

  const opportunities: OpportunityResult[] = matches.map((match) => {
    const { opportunity, matchScore } = match;
    const processInput = getProcessInput(profile, opportunity.id);
    const hasProcessInput = !!processInput;

    const value = estimateValue(profile, opportunity, processInput);
    const cost = getCostBand(opportunity.cost_assumption_id, employeeMultiplier);
    const roi = calculateRoi(value, cost);

    const { score: feasibilityScore, factors: feasibilityFactors } =
      calculateFeasibility(profile, opportunity, processInput);

    const { level: governanceRisk, factors: governanceFactors } =
      calculateGovernanceRisk(profile, opportunity);

    const valueScore = valueScoreFromEstimate(
      value.annualTimeValueLow,
      value.annualTimeValueHigh,
    );
    const roiScore = roiScoreFromEstimate(roi);
    const costScore = costScoreFromBand(cost.first_year_cost_cad.high);
    const stratScore = strategicFitScore(opportunity, profile.primaryGoal);

    const compositeScore = calculateCompositeScore({
      valueScore,
      roiScore,
      feasibilityScore,
      costScore,
      governanceRisk,
      strategicFitScore: stratScore,
    });

    const { level: confidence, factors: confidenceFactors } = calculateConfidence(
      profile,
      opportunity.efficiency_assumption_id,
      cost,
      hasProcessInput,
    );

    const roiMid = (roi.firstYearRoiLow + roi.firstYearRoiHigh) / 2;

    const { recommendation, governanceCapApplied } = determineRecommendation({
      compositeScore,
      feasibilityScore,
      governanceRisk,
      roiMid,
      confidence,
      valueScore,
      processStandardization: profile.processStandardization,
      dataQuality: profile.dataQuality,
      processMethod: processInput?.processMethod,
    });

    const quadrant = assignQuadrant(valueScore, opportunity);
    const riskQuadrant = assignRiskQuadrant(valueScore, governanceRisk);

    const valueSteps = [
      `Formula: ${value.formula}`,
      ...Object.entries(value.inputs).map(([k, v]) => `${k}: ${v}`),
      `Estimated annual opportunity value: $${value.annualTimeValueLow.toLocaleString()}–$${value.annualTimeValueHigh.toLocaleString()} CAD`,
      "Label: Estimated opportunity value — not guaranteed savings",
    ];

    const roiSteps = [
      `Annual value (low–high): $${value.annualTimeValueLow.toLocaleString()}–$${value.annualTimeValueHigh.toLocaleString()} CAD`,
      `First-year cost (low–high): $${cost.first_year_cost_cad.low.toLocaleString()}–$${cost.first_year_cost_cad.high.toLocaleString()} CAD`,
      `Net benefit (low–high): $${roi.netBenefitLow.toLocaleString()}–$${roi.netBenefitHigh.toLocaleString()} CAD`,
      `First-year ROI: ${roi.firstYearRoiLow}–${roi.firstYearRoiHigh}%`,
    ];

    return {
      opportunity,
      matchScore,
      value,
      cost,
      roi,
      feasibilityScore,
      governanceRisk,
      compositeScore,
      recommendation,
      confidence,
      quadrant,
      riskQuadrant,
      secondaryValueFlags: opportunity.secondary_value_flags,
      governanceCapApplied,
      explainability: {
        valueSteps,
        roiSteps,
        feasibilityFactors,
        governanceFactors,
        confidenceFactors,
      },
    };
  });

  opportunities.sort((a, b) => {
    if (a.governanceCapApplied !== b.governanceCapApplied) {
      return a.governanceCapApplied ? 1 : -1;
    }
    return b.compositeScore - a.compositeScore;
  });

  const topOpps = opportunities.filter(
    (o) => o.recommendation !== "not_recommended",
  );

  const totalValueLow = topOpps.reduce((s, o) => s + o.value.annualTimeValueLow, 0);
  const totalValueHigh = topOpps.reduce((s, o) => s + o.value.annualTimeValueHigh, 0);
  const totalFirstYearCostLow = topOpps.reduce(
    (s, o) => s + o.cost.first_year_cost_cad.low,
    0,
  );
  const totalFirstYearCostHigh = topOpps.reduce(
    (s, o) => s + o.cost.first_year_cost_cad.high,
    0,
  );

  const portfolioRoiLow =
    totalFirstYearCostHigh > 0
      ? ((totalValueLow - totalFirstYearCostHigh) / totalFirstYearCostHigh) * 100
      : 0;
  const portfolioRoiHigh =
    totalFirstYearCostLow > 0
      ? ((totalValueHigh - totalFirstYearCostLow) / totalFirstYearCostLow) * 100
      : 0;

  const improveProcessFirst = opportunities.some(
    (o) => o.recommendation === "improve_process_first",
  ) && profile.processStandardization === "inconsistent";

  const aiNotRecommended =
    opportunities.length === 0 ||
    opportunities.every((o) => o.recommendation === "not_recommended");

  const roadmap = buildRoadmap(opportunities);
  const pilots = buildPilotPlans(opportunities);

  const result: AssessmentResult = {
    profile,
    opportunities,
    overallOpportunityLevel: overallOpportunityLevel(
      opportunities[0]?.compositeScore ?? 0,
    ),
    totalValueLow: Math.round(totalValueLow),
    totalValueHigh: Math.round(totalValueHigh),
    totalFirstYearCostLow: Math.round(totalFirstYearCostLow),
    totalFirstYearCostHigh: Math.round(totalFirstYearCostHigh),
    portfolioRoiLow: Math.round(portfolioRoiLow),
    portfolioRoiHigh: Math.round(portfolioRoiHigh),
    overallConfidence: overallConfidence(opportunities.map((o) => o.confidence)),
    improveProcessFirst,
    aiNotRecommended,
    roadmap,
    pilots,
    brukdCta: { show: false, reasons: [] },
  };

  const brukd = evaluateBrukdCta(profile, result);
  result.brukdCta = {
    show: brukd.show,
    reasons: brukd.reasons,
  };

  return result;
}
